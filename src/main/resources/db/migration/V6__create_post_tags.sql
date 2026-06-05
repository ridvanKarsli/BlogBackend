CREATE TABLE post_tags (
                           post_id BIGINT NOT NULL,
                           tag_id BIGINT NOT NULL,
                           PRIMARY KEY (post_id, tag_id),
                           CONSTRAINT fk_pt_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                           CONSTRAINT fk_pt_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);