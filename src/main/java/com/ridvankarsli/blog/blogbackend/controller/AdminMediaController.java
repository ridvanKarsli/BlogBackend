package com.ridvankarsli.blog.blogbackend.controller;

import com.ridvankarsli.blog.blogbackend.entity.Media;
import com.ridvankarsli.blog.blogbackend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<List<Media>> list() {
        return ResponseEntity.ok(mediaService.listMedia());
    }

    @PostMapping("/upload")
    public ResponseEntity<Media> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(mediaService.uploadMedia(file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.ok("Medya silindi.");
    }
}
