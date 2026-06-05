package com.ridvankarsli.blog.blogbackend.repository;


import com.ridvankarsli.blog.blogbackend.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<Media, Long> {
}
