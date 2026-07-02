package com.ridvankarsli.blog.blogbackend.service;

import com.ridvankarsli.blog.blogbackend.entity.Media;
import com.ridvankarsli.blog.blogbackend.entity.User;
import com.ridvankarsli.blog.blogbackend.repository.MediaRepository;
import com.ridvankarsli.blog.blogbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final com.ridvankarsli.blog.blogbackend.storage.StorageService storageService;

    public Media uploadMedia(MultipartFile file) {
        try {
            String url = storageService.store(file);

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email = ((UserDetails) principal).getUsername();
            User uploader = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

            Media media = new Media();
            media.setFileName(file.getOriginalFilename());
            media.setFileUrl(url);
            media.setMimeType(file.getContentType());
            media.setFileSize(file.getSize());
            media.setUploadedBy(uploader);

            return mediaRepository.save(media);
        } catch (Exception e) {
            throw new RuntimeException("Dosya yüklenemedi: " + e.getMessage());
        }
    }

    public java.util.List<Media> listMedia() {
        return mediaRepository.findAll();
    }

    public void deleteMedia(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medya bulunamadı."));

        try {
            storageService.delete(media.getFileUrl());
        } catch (Exception ignored) {
        }

        mediaRepository.deleteById(id);
    }
}
