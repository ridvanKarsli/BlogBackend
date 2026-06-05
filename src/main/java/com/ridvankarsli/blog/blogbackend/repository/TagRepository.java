package com.ridvankarsli.blog.blogbackend.repository;


import com.ridvankarsli.blog.blogbackend.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findBySlug(String slug);
}
