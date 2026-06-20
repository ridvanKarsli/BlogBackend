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

    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }
}