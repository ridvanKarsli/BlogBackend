package com.ridvankarsli.blog.blogbackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 1. İstekteki Cookie'den token'ı alıyoruz
            String jwt = jwtUtil.getJwtFromCookies(request);

            // 2. Token var mı ve geçerli mi kontrol ediyoruz
            if (jwt != null && jwtUtil.validateToken(jwt)) {

                // 3. Token'ın içinden kullanıcının emailini çıkarıyoruz
                String email = jwtUtil.extractEmail(jwt);

                // 4. Email ile kullanıcıyı ve yetkilerini (Role) buluyoruz
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // 5. Spring Security'e özel "Kimlik Doğrulandı" kartını hazırlıyoruz
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null, // Şifreyi buraya koymuyoruz, güvenlik için null geçiyoruz
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Bu kartı SecurityContext'e (sistemin beynine) yerleştiriyoruz
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Kullanıcı kimlik doğrulaması yapılamadı: {}", e);
        }

        // 7. Her şey tamamsa filtre zincirine devam et (isteği Controller'a yolla)
        filterChain.doFilter(request, response);
    }
}