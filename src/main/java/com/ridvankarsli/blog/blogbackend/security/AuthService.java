package com.ridvankarsli.blog.blogbackend.security;

import com.ridvankarsli.blog.blogbackend.dto.LoginRequest;
import com.ridvankarsli.blog.blogbackend.dto.RegisterRequest;
import com.ridvankarsli.blog.blogbackend.dto.UserResponse;
import com.ridvankarsli.blog.blogbackend.entity.User;
import com.ridvankarsli.blog.blogbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // Kayıt Olma İşlemi
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Bu email adresi zaten kullanımda!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        // Şifreyi veritabanına kaydetmeden önce BCrypt ile şifreliyoruz (Çok önemli!)
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("EDITOR");

        userRepository.save(user);
    }

    public UserResponse getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDetails userDetails)) {
            throw new RuntimeException("Kimlik doğrulaması gerekli!");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
        return new UserResponse(user.getId(), user.getEmail(), user.getRole());
    }

    // Giriş Yapma İşlemi
    public String login(LoginRequest request) {
        // Spring Security bu satırda gidip veritabanındaki şifre ile kullanıcının girdiği şifreyi kıyaslar.
        // Yanlışsa direkt Exception fırlatır, aşağıya inmez.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Her şey doğruysa token üret ve geri dön
        return jwtUtil.generateToken(request.getEmail());
    }
}