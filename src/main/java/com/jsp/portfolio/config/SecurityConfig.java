package com.jsp.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF since we just use simple stateless fetch requests in the admin panel
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin.html", "/api/admin/**").authenticated() // Require passcode for admin areas
                .anyRequest().permitAll() // Allow public access to index, projects, skills, and static files
            )
            .httpBasic(withDefaults()); // Uses the browser's native login popup
            
        return http.build();
    }
}
