package com.ridvankarsli.blog.blogbackend.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    @Value("${media.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String store(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.')) : "";
        String unique = UUID.randomUUID().toString() + ext;

        Path target = uploadPath.resolve(unique);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return "/" + uploadDir + "/" + unique;
    }

    @Override
    public void delete(String fileUrl) throws IOException {
        if (fileUrl != null && fileUrl.startsWith("/")) {
            Path p = Paths.get(fileUrl.substring(1));
            Files.deleteIfExists(p);
        }
    }
}
