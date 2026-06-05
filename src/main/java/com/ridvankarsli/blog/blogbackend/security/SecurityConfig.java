package com.ridvankarsli.blog.blogbackend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    // 1. Şifreleri (Password) geri döndürülemez şekilde kriptolayan araç (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Veritabanından kullanıcıyı ve kriptolanmış şifresini okuyup doğrulamayı yapan sağlayıcı
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 3. AuthController'da login işlemi yaparken kullanacağımız ana yönetici
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 4. Sistemin asıl güvenlik kurallarının yazıldığı Filtre Zinciri (Security Filter Chain)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF korumasını kapatıyoruz (JWT kullandığımız için gerek yok)
                .csrf(AbstractHttpConfigurer::disable)

                // Kimlerin nereye girebileceğini belirliyoruz
                .authorizeHttpRequests(auth -> auth
                        // Herkese Açık Olan İstekler (Login, Arama, Anasayfa Postları vs.)
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers("/api/posts", "/api/posts/**").permitAll()
                        .requestMatchers("/api/categories", "/api/categories/**").permitAll()
                        .requestMatchers("/api/tags", "/api/tags/**").permitAll()
                        .requestMatchers("/api/search").permitAll()
                        .requestMatchers("/sitemap.xml").permitAll()
                        // Admin ve Editörlere Özel İstekler (Sadece yetkisi olanlar)
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "EDITOR")
                        // Geri kalan her istek kimlik doğrulaması (Token) gerektirsin
                        .anyRequest().authenticated()
                )

                // Oturum yönetimini STATELESS (Durumsuz) yapıyoruz.
                // Yani Spring Security hafızada kullanıcı tutmayacak, her istekte token soracak.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // AuthenticationProvider'ı sisteme tanıtıyoruz
                .authenticationProvider(authenticationProvider())

                // Kendi yazdığımız JWT filtresini, Spring'in varsayılan şifre sorma filtresinden HEMEN ÖNCE devreye sokuyoruz
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}