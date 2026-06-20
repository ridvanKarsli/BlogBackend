package com.ridvankarsli.blog.blogbackend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String role; // "ADMIN" veya "EDITOR" göndereceğiz
}