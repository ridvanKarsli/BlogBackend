package com.ridvankarsli.blog.blogbackend.controller;

import com.ridvankarsli.blog.blogbackend.entity.Media;
import com.ridvankarsli.blog.blogbackend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<Media> uploadMedia(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(mediaService.uploadMedia(file));
    }
}