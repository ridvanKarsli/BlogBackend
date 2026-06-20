package com.ridvankarsli.blog.blogbackend.controller;

import com.ridvankarsli.blog.blogbackend.dto.PostRequest;
import com.ridvankarsli.blog.blogbackend.entity.Post;
import com.ridvankarsli.blog.blogbackend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Herkese açık olan liste metodu (SecurityConfig'de izin vermiştik)
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Sadece giriş yapmış yetkili kişilerin kullanabileceği ekleme metodu
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    // Herkese açık olan detay okuma metodu
    @GetMapping("/{slug}")
    public ResponseEntity<Post> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }

    // Sadece giriş yapmış yetkili kişilerin kullanabileceği güncelleme metodu
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    // Sadece giriş yapmış yetkili kişilerin kullanabileceği silme metodu
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Yazı başarıyla silindi.");
    }
}