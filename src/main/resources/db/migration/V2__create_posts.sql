CREATE TABLE posts (
                       id BIGSERIAL PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       slug VARCHAR(255) NOT NULL UNIQUE,
                       content TEXT NOT NULL,
                       excerpt TEXT,
                       seo_title VARCHAR(255),
                       seo_description TEXT,
                       canonical_url VARCHAR(255),
                       og_image VARCHAR(255),
                       status VARCHAR(50) NOT NULL,
                       published_at TIMESTAMP,
                       author_id BIGINT NOT NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users (id)
);