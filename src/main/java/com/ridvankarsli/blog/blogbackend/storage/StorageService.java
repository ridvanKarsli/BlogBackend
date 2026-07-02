package com.ridvankarsli.blog.blogbackend.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    // Stores file and returns a public URL or path
    String store(MultipartFile file) throws Exception;

    // Deletes stored file by returned URL/path
    void delete(String fileUrl) throws Exception;
}
