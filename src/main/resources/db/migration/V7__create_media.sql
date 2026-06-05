CREATE TABLE media (
                       id BIGSERIAL PRIMARY KEY,
                       file_name VARCHAR(255) NOT NULL,
                       file_url VARCHAR(500) NOT NULL,
                       mime_type VARCHAR(100),
                       file_size BIGINT,
                       uploaded_by BIGINT NOT NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by) REFERENCES users (id)
);