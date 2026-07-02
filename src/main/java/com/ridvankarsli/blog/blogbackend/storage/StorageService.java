package com.ridvankarsli.blog.blogbackend.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String store(MultipartFile file) throws Exception;

    void delete(String fileUrl) throws Exception;
}
