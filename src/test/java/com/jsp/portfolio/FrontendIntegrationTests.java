package com.jsp.portfolio;

import jakarta.servlet.Filter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import com.jsp.portfolio.config.SecurityHeadersFilter;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "PORTFOLIO_ADMIN_USERNAME=test-admin", "PORTFOLIO_ADMIN_PASSWORD=test-password",
    "spring.datasource.url=jdbc:h2:mem:frontend_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver", "spring.datasource.username=sa",
    "spring.datasource.password=", "spring.jpa.hibernate.ddl-auto=create-drop"
})
class FrontendIntegrationTests {
    @Autowired WebApplicationContext context;
    @Autowired @Qualifier("springSecurityFilterChain") Filter security;
    @Autowired SecurityHeadersFilter headers;
    MockMvc mvc;
    @BeforeEach void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context).addFilters(headers, security).build();
    }
    @Test void publicApisAndResumeRemainAvailable() throws Exception {
        for (String resource : new String[]{"projects", "experiences", "skills", "stats", "principles"}) {
            mvc.perform(get("/api/" + resource)).andExpect(status().isOk()).andExpect(content().json("[]"));
        }
        mvc.perform(get("/api/health")).andExpect(status().isOk()).andExpect(jsonPath("$.database").value("UP"));
        mvc.perform(get("/resume")).andExpect(status().isOk()).andExpect(content().contentType("application/pdf"))
            .andExpect(header().string("Content-Disposition", "inline; filename=Yatharth_Maharwade_Resume.pdf"));
    }
    @Test void reactRouteDoesNotConsumeBackendRoutes() throws Exception {
        mvc.perform(get("/myworks")).andExpect(status().isOk()).andExpect(forwardedUrl("/index.html"));
        mvc.perform(get("/projects/foodfinder.html")).andExpect(status().isOk());
        mvc.perform(get("/admin.html")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/csrf")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/no-such-resource")).andExpect(status().isNotFound());
    }
    @Test void adminAuthenticationCsrfAndWebglCspRemainEnforced() throws Exception {
        String basic = "Basic " + Base64.getEncoder().encodeToString("test-admin:test-password".getBytes(StandardCharsets.UTF_8));
        mvc.perform(get("/api/admin/csrf").header("Authorization", basic))
            .andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty())
            .andExpect(header().string("Cache-Control", org.hamcrest.Matchers.containsString("no-store")));
        mvc.perform(post("/api/admin/addSkill").header("Authorization", basic).contentType("application/json")
            .content("{\"name\":\"Java\",\"rating\":5,\"category\":\"Backend\"}"))
            .andExpect(status().isForbidden());
        mvc.perform(get("/api/projects")).andExpect(header().string("Content-Security-Policy",
            org.hamcrest.Matchers.containsString("connect-src 'self'")));
    }
}
