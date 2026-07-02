package com.ridvankarsli.blog.blogbackend.service;

import com.ridvankarsli.blog.blogbackend.dto.TagRequest;
import com.ridvankarsli.blog.blogbackend.entity.Tag;
import com.ridvankarsli.blog.blogbackend.repository.TagRepository;
import com.ridvankarsli.blog.blogbackend.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public Tag createTag(TagRequest request) {
        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setSlug(SlugUtil.makeSlug(request.getName()));
        return tagRepository.save(tag);
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Tag getTagBySlug(String slug) {
        return tagRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Etiket bulunamadı!"));
    }

    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etiket bulunamadı!"));
    }

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }

    public Tag updateTag(Long id, com.ridvankarsli.blog.blogbackend.dto.TagRequest request) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Güncellenecek etiket bulunamadı!"));
        tag.setName(request.getName());
        tag.setSlug(com.ridvankarsli.blog.blogbackend.util.SlugUtil.makeSlug(request.getName()));
        return tagRepository.save(tag);
    }
}