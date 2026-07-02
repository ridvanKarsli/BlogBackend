package com.ridvankarsli.blog.blogbackend.controller;

import com.ridvankarsli.blog.blogbackend.entity.Category;
import com.ridvankarsli.blog.blogbackend.entity.Post;
import com.ridvankarsli.blog.blogbackend.entity.Tag;
import com.ridvankarsli.blog.blogbackend.service.CategoryService;
import com.ridvankarsli.blog.blogbackend.service.PostService;
import com.ridvankarsli.blog.blogbackend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SitemapController {

    private final PostService postService;
    private final CategoryService categoryService;
    private final TagService tagService;

    @Value("${site.base-url:http://localhost}")
    private String siteBaseUrl;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        List<Post> posts = postService.getPublishedPosts();
        List<Category> categories = categoryService.getAllCategories();
        List<Tag> tags = tagService.getAllTags();

        String base = siteBaseUrl.endsWith("/") ? siteBaseUrl.substring(0, siteBaseUrl.length() - 1) : siteBaseUrl;
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        sb.append("  <url>\n");
        sb.append("    <loc>").append(base).append("/</loc>\n");
        sb.append("    <changefreq>daily</changefreq>\n");
        sb.append("    <priority>1.0</priority>\n");
        sb.append("  </url>\n");

        sb.append("  <url>\n");
        sb.append("    <loc>").append(base).append("/blog</loc>\n");
        sb.append("    <changefreq>daily</changefreq>\n");
        sb.append("    <priority>0.9</priority>\n");
        sb.append("  </url>\n");

        DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE;

        for (Post post : posts) {
            sb.append("  <url>\n");
            sb.append("    <loc>").append(base).append("/blog/").append(escapeXml(post.getSlug())).append("</loc>\n");
            if (post.getPublishedAt() != null) {
                sb.append("    <lastmod>").append(post.getPublishedAt().toLocalDate().format(fmt)).append("</lastmod>\n");
            }
            sb.append("    <changefreq>weekly</changefreq>\n");
            sb.append("    <priority>0.8</priority>\n");
            sb.append("  </url>\n");
        }

        for (Category category : categories) {
            sb.append("  <url>\n");
            sb.append("    <loc>").append(base).append("/blog?category=").append(escapeXml(category.getSlug())).append("</loc>\n");
            sb.append("    <changefreq>weekly</changefreq>\n");
            sb.append("    <priority>0.6</priority>\n");
            sb.append("  </url>\n");
        }

        for (Tag tag : tags) {
            sb.append("  <url>\n");
            sb.append("    <loc>").append(base).append("/blog?tag=").append(escapeXml(tag.getSlug())).append("</loc>\n");
            sb.append("    <changefreq>weekly</changefreq>\n");
            sb.append("    <priority>0.5</priority>\n");
            sb.append("  </url>\n");
        }

        sb.append("</urlset>");

        return ResponseEntity.ok(sb.toString());
    }

    private String escapeXml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
