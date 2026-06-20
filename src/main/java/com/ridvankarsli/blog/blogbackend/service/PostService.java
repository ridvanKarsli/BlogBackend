package com.ridvankarsli.blog.blogbackend.service;


import com.ridvankarsli.blog.blogbackend.dto.PostRequest;
import com.ridvankarsli.blog.blogbackend.entity.Post;
import com.ridvankarsli.blog.blogbackend.entity.User;
import com.ridvankarsli.blog.blogbackend.repository.PostRepository;
import com.ridvankarsli.blog.blogbackend.repository.UserRepository;
import com.ridvankarsli.blog.blogbackend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Yeni Yazı Ekleme
    public Post createPost(PostRequest request) {
        // 1. Sisteme giriş yapmış olan kullanıcının emailini Security Context'ten alıyoruz
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        // 2. Kullanıcıyı veritabanından buluyoruz
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

        // 3. Yeni Post nesnesini oluşturup dolduruyoruz
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setSlug(SlugUtil.makeSlug(request.getTitle()));
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setStatus(request.getStatus());
        post.setAuthor(author);

        if ("PUBLISHED".equalsIgnoreCase(request.getStatus())) {
            post.setPublishedAt(LocalDateTime.now());
        }

        // 4. Kaydet
        return postRepository.save(post);
    }

    // Tüm Yazıları Listeleme
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Slug (URL) ile tekil yazı getirme
    public Post getPostBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Bu URL'ye ait yazı bulunamadı!"));
    }

    // Yazı Güncelleme
    public Post updatePost(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Güncellenecek yazı bulunamadı!"));

        post.setTitle(request.getTitle());
        post.setSlug(SlugUtil.makeSlug(request.getTitle())); // Başlık değişirse URL de güncellensin
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setStatus(request.getStatus());

        // Eğer daha önce taslak olan bir yazı şimdi yayınlanıyorsa, yayınlanma tarihini ata
        if ("PUBLISHED".equalsIgnoreCase(request.getStatus()) && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        return postRepository.save(post);
    }

    // Yazı Silme
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Silinecek yazı bulunamadı!");
        }
        postRepository.deleteById(id);
    }
}