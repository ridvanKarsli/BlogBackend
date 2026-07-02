package com.ridvankarsli.blog.blogbackend.repository;


import com.ridvankarsli.blog.blogbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);

    Optional<Post> findBySlugAndStatusIgnoreCase(String slug, String status);

    List<Post> findByTitleContainingIgnoreCaseAndStatusIgnoreCaseOrContentContainingIgnoreCaseAndStatusIgnoreCase(
            String title, String status1, String content, String status2);

    List<Post> findByStatusIgnoreCase(String status);

    @Query(value = """
            SELECT * FROM posts
            WHERE status = 'PUBLISHED'
              AND to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''))
                  @@ plainto_tsquery('simple', :query)
            """, nativeQuery = true)
    List<Post> searchPublishedByFullText(@Param("query") String query);
}
