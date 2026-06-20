package com.ridvankarsli.blog.blogbackend.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private String excerpt;
    private String status; // DRAFT veya PUBLISHED
}