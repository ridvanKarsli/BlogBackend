package com.ridvankarsli.blog.blogbackend.service;

import com.ridvankarsli.blog.blogbackend.entity.Media;
import com.ridvankarsli.blog.blogbackend.entity.User;
import com.ridvankarsli.blog.blogbackend.repository.MediaRepository;
import com.ridvankarsli.blog.blogbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

    @Value("${media.upload-dir:uploads}")
    private String uploadDir;

    public Media uploadMedia(MultipartFile file) {
        try {
            // 1. Klasörü kontrol et, yoksa proje dizininde oluştur
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Dosya ismini benzersiz yap (Örn: resim.jpg -> 123e4567-e89b-12d3...jpg)
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // 3. Dosyayı fiziksel olarak "uploads" klasörüne kaydet
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 4. İsteği atan kullanıcıyı Security Context'ten bul
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email = ((UserDetails) principal).getUsername();
            User uploader = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı!"));

            // 5. Veritabanına Media kaydını ekle
            Media media = new Media();
            media.setFileName(originalFilename);
            media.setFileUrl("/" + uploadDir + "/" + uniqueFilename);
            media.setMimeType(file.getContentType());
            media.setFileSize(file.getSize());
            media.setUploadedBy(uploader);

            return mediaRepository.save(media);

        } catch (IOException e) {
            throw new RuntimeException("Dosya yüklenirken hata oluştu: " + e.getMessage());
        }
    }
}