package com.ridvankarsli.blog.blogbackend.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

    private final S3Client s3;

    @Value("${storage.bucket}")
    private String bucket;

    @Value("${storage.public-url-prefix:/media}")
    private String publicUrlPrefix;

    public S3StorageService(@Value("${storage.access-key}") String accessKey,
                            @Value("${storage.secret-key}") String secretKey,
                            @Value("${storage.region:us-east-1}") String region,
                            @Value("${storage.endpoint:}") String endpoint) {
        AwsBasicCredentials creds = AwsBasicCredentials.create(accessKey, secretKey);
        var builder = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .region(Region.of(region))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build());
        if (endpoint != null && !endpoint.isBlank()) {
            builder.endpointOverride(URI.create(endpoint));
        }
        this.s3 = builder.build();
    }

    @Override
    public String store(MultipartFile file) throws IOException {
        String original = file.getOriginalFilename();
        String ext = original != null && original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String key = UUID.randomUUID().toString() + ext;

        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3.putObject(req, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String prefix = publicUrlPrefix.endsWith("/")
                ? publicUrlPrefix.substring(0, publicUrlPrefix.length() - 1)
                : publicUrlPrefix;
        return prefix + "/" + key;
    }

    @Override
    public void delete(String fileUrl) {
        String key = fileUrl;
        if (fileUrl.contains("/")) {
            key = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        }
        DeleteObjectRequest req = DeleteObjectRequest.builder().bucket(bucket).key(key).build();
        s3.deleteObject(req);
    }
}
