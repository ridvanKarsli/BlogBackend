package com.ridvankarsli.blog.blogbackend.security;

import com.ridvankarsli.blog.blogbackend.entity.User;
import com.ridvankarsli.blog.blogbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Veritabanından email ile kullanıcıyı arıyoruz. Bulamazsa hata fırlatıyoruz.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + email));

        // 2. Kendi User nesnemizi, Spring Security'nin anladığı UserDetails nesnesine dönüştürüyoruz.
        // Not: Spring Security rollerin başında genelde "ROLE_" takısı arar (Örn: ROLE_ADMIN).
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}