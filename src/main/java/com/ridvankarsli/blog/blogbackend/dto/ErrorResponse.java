package com.ridvankarsli.blog.blogbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;          // HTTP Hata Kodu (Örn: 400, 404, 500)
    private String message;      // Hatanın anlaşılır mesajı
    private LocalDateTime timestamp; // Hatanın gerçekleştiği zaman
}