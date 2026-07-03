package com.smartlogix.auth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitamos CSRF porque para APIs REST con tokens JWT no se necesita
            .csrf(AbstractHttpConfigurer::disable)
            // Configuramos los permisos de las rutas
            .authorizeHttpRequests(auth -> auth
                // Dejamos libre el acceso a cualquier ruta (register, login, etc.)
                .requestMatchers(
                "/api/auth/**",
                "/error",
                "/swagger-ui/**"
                ,"/swagger-ui.html",
                "/v3/api-docs/**",
                "/actuator/**").permitAll()
                // Cualquier otra petición en la aplicación pedirá estar autenticado
                .anyRequest().authenticated()
            );
            
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}