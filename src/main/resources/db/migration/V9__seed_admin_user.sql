-- Default admin user (password: Admin123!)
INSERT INTO users (email, password, role, created_at, updated_at)
SELECT 'admin@blog.local',
       '$2y$10$JbusWi3bQReVh0Mk8Ovr0uyZB1iASErLTnoO/luEVtJ9CvnTx3WzK',
       'ADMIN',
       NOW(),
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@blog.local');
