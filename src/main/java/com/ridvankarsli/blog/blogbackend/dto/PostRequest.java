package com.ridvankarsli.blog.blogbackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PostRequest {
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String status; // DRAFT veya PUBLISHED
    private String seoTitle;
    private String seoDescription;
    private String canonicalUrl;
    private String ogImage;
    private List<Long> categoryIds;
    private List<Long> tagIds;
}
