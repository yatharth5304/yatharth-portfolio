package com.jsp.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"PORTFOLIO_ADMIN_PASSWORD=test-password",
		"spring.datasource.url=jdbc:h2:mem:portfolio_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
		"spring.flyway.enabled=false"
})
class PortfolioApplicationTests {

	@Test
	void contextLoads() {
	}

}
