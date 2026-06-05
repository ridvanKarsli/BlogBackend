CREATE TABLE post_categories (
                                 post_id BIGINT NOT NULL,
                                 category_id BIGINT NOT NULL,
                                 PRIMARY KEY (post_id, category_id),
                                 CONSTRAINT fk_pc_post FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                                 CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);