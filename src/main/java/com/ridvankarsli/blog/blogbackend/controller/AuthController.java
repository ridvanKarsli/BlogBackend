package com.ridvankarsli.blog.blogbackend.controller;

import com.ridvankarsli.blog.blogbackend.dto.AuthResponse;
import com.ridvankarsli.blog.blogbackend.dto.LoginRequest;
import com.ridvankarsli.blog.blogbackend.dto.RegisterRequest;
import com.ridvankarsli.blog.blogbackend.dto.UserResponse;
import com.ridvankarsli.blog.blogbackend.security.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.cookie-name}")
    private String cookieName;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        // 1. Şifre doğruysa token'ı al
        String token = authService.login(request);

        // 2. Token'ı güvenli bir şekilde Cookie'ye yerleştir (Tarayıcıda JavaScript ile okunamasın diye HttpOnly yapıyoruz)
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Sadece HTTPS'te çalışsın diyorsan true yap (Production'da true olmalı)
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 Gün
        response.addCookie(cookie);

        // 3. Başarılı mesajı dön
        return ResponseEntity.ok(new AuthResponse(request.getEmail(), "Giriş başarılı!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Çıkış yaparken Cookie'yi ezip süresini sıfırlıyoruz (Siliyoruz)
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Çıkış yapıldı.");
    }
}