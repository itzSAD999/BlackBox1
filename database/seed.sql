-- Insert sample products
INSERT INTO products (id, name, description, price, image_url, category, rating, review_count, discount, new) VALUES
('BB-101', 'iPhone 15 Pro Max', 'Latest iPhone with titanium design and A17 Pro chip', 1199.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab', 'iPhone', 4.8, 245, null, true),
('BB-102', 'MacBook Pro 16"', 'Powerful laptop with M3 Max chip and stunning display', 2499.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'Laptop', 4.9, 189, 10, false),
('BB-103', 'AirPods Pro 2', 'Premium wireless earbuds with active noise cancellation', 249.00, 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5', 'Audio', 4.6, 412, null, false),
('BB-104', 'iPad Pro 12.9"', 'Professional tablet with M2 chip and Liquid Retina XDR display', 1099.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', 'Accessories', 4.7, 156, 15, false),
('BB-105', 'Apple Watch Ultra 2', 'Rugged smartwatch designed for extreme adventures', 799.00, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26', 'Accessories', 4.8, 203, null, true),
('BB-106', 'PlayStation 5', 'Next-generation gaming console with 4K gaming', 499.00, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3', 'Gaming', 4.9, 567, 5, false),
('BB-107', 'Xbox Series X', 'Most powerful Xbox console ever made', 499.00, 'https://images.unsplash.com/photo-1621259182955-15e28961a89a', 'Gaming', 4.7, 423, null, false),
('BB-108', 'Sony WH-1000XM5', 'Industry-leading noise canceling headphones', 399.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'Audio', 4.8, 334, 20, false),
('BB-109', 'Samsung Galaxy S24 Ultra', 'Premium Android phone with S Pen and advanced camera', 1199.00, 'https://images.unsplash.com/photo-1598327108529-82b91d34e8a3', 'iPhone', 4.7, 278, null, false),
('BB-110', 'Dell XPS 15', 'High-performance Windows laptop with OLED display', 1799.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 'Laptop', 4.5, 145, 10, false),
('BB-111', 'Nintendo Switch OLED', 'Premium gaming console with vibrant OLED screen', 349.00, 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853', 'Gaming', 4.8, 445, null, false),
('BB-112', 'Bose QuietComfort 45', 'Comfortable over-ear headphones with noise cancellation', 329.00, 'https://images.unsplash.com/photo-1484704849700-f032de5743a0', 'Audio', 4.6, 289, 15, false);

-- Update created_at timestamps
UPDATE products SET created_at = NOW() - INTERVAL '1 day' * (RANDOM() * 30)::integer WHERE id LIKE 'BB-%';
