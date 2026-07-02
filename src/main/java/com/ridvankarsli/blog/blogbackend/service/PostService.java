package com.ridvankarsli.blog.blogbackend.service;


import com.ridvankarsli.blog.blogbackend.dto.PostRequest;
import com.ridvankarsli.blog.blogbackend.entity.Category;
import com.ridvankarsli.blog.blogbackend.entity.Post;
import com.ridvankarsli.blog.blogbackend.entity.Tag;
import com.ridvankarsli.blog.blogbackend.entity.User;
import com.ridvankarsli.blog.blogbackend.repository.CategoryRepository;
import com.ridvankarsli.blog.blogbackend.repository.PostRepository;
import com.ridvankarsli.blog.blogbackend.repository.TagRepository;
import com.ridvankarsli.blog.blogbackend.repository.UserRepository;
import com.ridvankarsli.blog.blogbackend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public Post createPost(PostRequest request) {
        User author = getCurrentUser();

        Post post = new Post();
        applyPostFields(post, request, null);
        post.setAuthor(author);

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yazı bulunamadı!"));
    }

    public List<Post> getPublishedPosts() {
        return postRepository.findByStatusIgnoreCase("PUBLISHED");
    }

    public Post getPublishedPostBySlug(String slug) {
        return postRepository.findBySlugAndStatusIgnoreCase(slug, "PUBLISHED")
                .orElseThrow(() -> new RuntimeException("Bu URL'ye ait yazı bulunamadı!"));
    }

    public Post getPostBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Bu URL'ye ait yazı bulunamadı!"));
    }

    public Post updatePost(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Güncellenecek yazı bulunamadı!"));

        applyPostFields(post, request, id);
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Silinecek yazı bulunamadı!");
        }
        postRepository.deleteById(id);
    }

    public List<Post> searchPublishedPosts(String keyword) {
        return postRepository.findByTitleContainingIgnoreCaseAndStatusIgnoreCaseOrContentContainingIgnoreCaseAndStatusIgnoreCase(
                keyword, "PUBLISHED", keyword, "PUBLISHED");
    }

    public List<Post> searchPostsFullText(String query) {
        return postRepository.searchPublishedByFullText(query);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));
    }

    private void applyPostFields(Post post, PostRequest request, Long currentPostId) {
        post.setTitle(request.getTitle());

        String baseSlug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? SlugUtil.makeSlug(request.getSlug())
                : SlugUtil.makeSlug(request.getTitle());
        post.setSlug(generateUniqueSlug(baseSlug, currentPostId));

        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setSeoTitle(request.getSeoTitle());
        post.setSeoDescription(request.getSeoDescription());
        post.setCanonicalUrl(request.getCanonicalUrl());
        post.setOgImage(request.getOgImage());

        String status = request.getStatus();
        post.setStatus(status);

        if ("PUBLISHED".equalsIgnoreCase(status)) {
            if (post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
        } else if ("DRAFT".equalsIgnoreCase(status)) {
            post.setPublishedAt(null);
        }

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : request.getCategoryIds()) {
                categoryRepository.findById(categoryId).ifPresent(categories::add);
            }
            post.setCategories(categories);
        }

        if (request.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : request.getTagIds()) {
                tagRepository.findById(tagId).ifPresent(tags::add);
            }
            post.setTags(tags);
        }
    }

    private String generateUniqueSlug(String baseSlug, Long currentPostId) {
        String slug = baseSlug;
        int i = 1;
        while (true) {
            var existing = postRepository.findBySlug(slug);
            if (existing.isEmpty()) {
                return slug;
            }
            if (currentPostId != null && existing.get().getId().equals(currentPostId)) {
                return slug;
            }
            slug = baseSlug + "-" + i++;
        }
    }
}
