-- ============================================================================
-- KUHUDE - Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Perfumes', 'perfumes', 'Signature eau de parfums crafted to linger', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Body Mists', 'body-mists', 'Lightweight fragrance for everyday moments', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Body Care', 'body-care', 'Luxurious body care infused with our signature scents', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Gift Sets', 'gift-sets', 'Curated collections for unforgettable gifting', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Accessories', 'accessories', 'Elegant accessories to complement your fragrance', 5);

-- ============================================================================
-- PRODUCTS - 10 Premium Perfumes
-- ============================================================================

-- 1. Velvet Memoir
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000001',
  'Velvet Memoir',
  'velvet-memoir',
  'A warm embrace of rose and oud that lingers like a beautiful memory.',
  'Velvet Memoir is the scent of a story you never want to end. Opening with delicate Bulgarian rose petals kissed by morning dew, it unfolds into a rich heart of precious oud and saffron. The base of amber and vanilla creates a lasting impression — warm, intimate, and unmistakably yours. This is not just a fragrance. It is a memory waiting to happen.',
  'c1000000-0000-0000-0000-000000000001',
  2999, 3999,
  'KH-VM-001',
  50, 'active', true, true,
  'Bulgarian Rose, Bergamot, Pink Pepper',
  'Oud, Saffron, Jasmine Sambac',
  'Amber, Vanilla, White Musk',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Rosa Damascena Oil, Santalum Album Oil, Vanillin',
  '100ml', '100ml EDP',
  'dark-sensual',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.8, 124
);

-- 2. Midnight Jasmine
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000002',
  'Midnight Jasmine',
  'midnight-jasmine',
  'Intoxicating jasmine enveloped in the mystery of midnight.',
  'There is a moment when the night deepens and the jasmine blooms most intensely. Midnight Jasmine captures that exact hour — when inhibitions fade and true desires emerge. Indian jasmine grandiflorum weaves through dark chocolate and smoky incense, creating a fragrance that is at once seductive and sophisticated. For the woman who knows the power of presence.',
  'c1000000-0000-0000-0000-000000000001',
  3499, NULL,
  'KH-MJ-002',
  35, 'active', true, true,
  'Night-Blooming Jasmine, Mandarin, Black Currant',
  'Jasmine Grandiflorum, Tuberose, Dark Chocolate',
  'Smoky Incense, Sandalwood, Tonka Bean',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Jasminum Grandiflorum Extract, Santalum Album Oil',
  '100ml', '100ml EDP',
  'bold-magnetic',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.9, 89
);

-- 3. Silk & Saffron
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000003',
  'Silk & Saffron',
  'silk-and-saffron',
  'The golden warmth of saffron draped in liquid silk.',
  'Inspired by the golden hour in Rajasthan, Silk & Saffron is luxury distilled into a bottle. Precious Kashmiri saffron threads intertwine with creamy sandalwood and iris, creating a fragrance that feels like silk against skin. Neither too sweet nor too sharp — it exists in perfect balance, much like the woman who wears it.',
  'c1000000-0000-0000-0000-000000000001',
  4299, 4999,
  'KH-SS-003',
  25, 'active', true, false,
  'Kashmiri Saffron, Cardamom, Pear',
  'Iris, Sandalwood, Rose Absolute',
  'Cashmere Musk, Amber, Cedarwood',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Crocus Sativus Extract, Santalum Album Oil, Iris Pallida Extract',
  '100ml', '100ml EDP',
  'elegant-timeless',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.7, 67
);

-- 4. Petal Whisper
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000004',
  'Petal Whisper',
  'petal-whisper',
  'Soft florals that speak in gentle, unforgettable whispers.',
  'Some fragrances announce themselves. Petal Whisper simply stays. A delicate conversation between peony and lily of the valley, softened by powdery iris and a breath of cotton musk. It is the scent of a handwritten letter, of a moment of quiet intimacy. For the woman whose gentleness is her greatest strength.',
  'c1000000-0000-0000-0000-000000000001',
  2499, NULL,
  'KH-PW-004',
  60, 'active', true, true,
  'Peony, Lily of the Valley, Lychee',
  'Iris, Magnolia, White Tea',
  'Cotton Musk, Sheer Woods, Skin Accord',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Paeonia Lactiflora Extract, Iris Pallida Extract',
  '50ml', '50ml EDP',
  'soft-romantic',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.6, 156
);

-- 5. Amber Nocturne
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000005',
  'Amber Nocturne',
  'amber-nocturne',
  'Deep amber and spices for nights that deserve to be remembered.',
  'When the sun sets and the city lights ignite, Amber Nocturne awakens. A deeply sensual composition built around liquid amber, enriched with cinnamon bark and black orchid. It is bold without being brash, warm without being heavy. The scent of a woman who turns heads not because she tries, but because she simply is.',
  'c1000000-0000-0000-0000-000000000001',
  3799, 4499,
  'KH-AN-005',
  30, 'active', false, true,
  'Cinnamon Bark, Plum, Pink Pepper',
  'Black Orchid, Amber, Praline',
  'Benzoin, Patchouli, Vanilla Absolute',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Cinnamomum Zeylanicum Extract, Vanilla Planifolia Extract',
  '100ml', '100ml EDP',
  'dark-sensual',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.8, 92
);

-- 6. Citrine Breeze
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000006',
  'Citrine Breeze',
  'citrine-breeze',
  'Sun-kissed citrus and white florals for effortless days.',
  'Like the first breath of morning air in a garden of citrus trees, Citrine Breeze is pure, radiant energy. Italian bergamot and yuzu sparkle over neroli and white freesia, settling into a clean base of blonde woods and sea salt. It is the fragrance equivalent of sunlight — effortless, warm, and undeniably alive.',
  'c1000000-0000-0000-0000-000000000001',
  1999, 2499,
  'KH-CB-006',
  80, 'active', false, false,
  'Bergamot, Yuzu, Green Apple',
  'Neroli, White Freesia, Jasmine Water',
  'Blonde Woods, Sea Salt, White Musk',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Citrus Bergamia Oil, Citrus Junos Extract',
  '50ml', '50ml EDP',
  'fresh-effortless',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.5, 203
);

-- 7. Rosewood Reverie
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000007',
  'Rosewood Reverie',
  'rosewood-reverie',
  'Where the elegance of rose meets the depth of precious woods.',
  'Rosewood Reverie is a meditation on beauty and time. Centifolia rose, harvested at dawn in Grasse, is cradled by rare rosewood and cedar. A touch of frankincense adds spiritual depth, while a base of vetiver grounds the composition with quiet sophistication. This is a fragrance for contemplation, for the woman who finds beauty in stillness.',
  'c1000000-0000-0000-0000-000000000001',
  3299, NULL,
  'KH-RR-007',
  40, 'active', false, false,
  'Centifolia Rose, Blackberry, Davana',
  'Rosewood, Frankincense, Orris',
  'Vetiver, Cedarwood, Labdanum',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Rosa Centifolia Extract, Aniba Rosaeodora Oil',
  '100ml', '100ml EDP',
  'elegant-timeless',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.7, 45
);

-- 8. Moonlit Oud
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000008',
  'Moonlit Oud',
  'moonlit-oud',
  'Precious oud bathed in silver moonlight and mystery.',
  'In the silence of a moonlit night, when the world feels vast and intimate at once, Moonlit Oud unfolds its story. Rare Cambodian oud, tempered by the softness of Bulgarian rose and the coolness of violet leaf, creates a fragrance of extraordinary depth. The dry down of silver birch and musk is like a whispered secret. Our most luxurious composition.',
  'c1000000-0000-0000-0000-000000000001',
  5999, 6999,
  'KH-MO-008',
  15, 'active', true, false,
  'Violet Leaf, Elemi, Angelica',
  'Cambodian Oud, Bulgarian Rose, Saffron',
  'Silver Birch, White Musk, Ambrette',
  'Alcohol Denat., Parfum (Fragrance), Aqua, Aquilaria Crassna Oil, Rosa Damascena Oil',
  '50ml', '50ml Extrait de Parfum',
  'bold-magnetic',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.9, 38
);

-- 9. Sunlit Garden (Body Mist)
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000009',
  'Sunlit Garden',
  'sunlit-garden',
  'A refreshing body mist of dewy florals and sun-warmed skin.',
  'Capture the feeling of wandering through a garden at golden hour with Sunlit Garden body mist. Light, refreshing, and utterly joyful — with dewy peony, sweet pea, and a hint of warm vanilla. Perfect for layering with your favourite KUHUDE eau de parfum, or wearing alone when you want something light and beautiful.',
  'c1000000-0000-0000-0000-000000000002',
  899, 1199,
  'KH-SG-009',
  100, 'active', false, true,
  'Sweet Pea, Dewy Peony, Grapefruit',
  'White Rose, Green Tea, Lily',
  'Warm Vanilla, Soft Musk, Cedar',
  'Alcohol Denat., Aqua, Parfum (Fragrance), Paeonia Lactiflora Extract',
  '150ml', '150ml Body Mist',
  'fresh-effortless',
  'Free shipping on orders above ₹999. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.4, 287
);

-- 10. Signature Gift Set
INSERT INTO products (id, name, slug, short_description, description, category_id, price, compare_at_price, sku, inventory_count, status, is_featured, is_bestseller, fragrance_top_notes, fragrance_heart_notes, fragrance_base_notes, ingredients, weight, size, mood, shipping_info, return_info, rating_avg, rating_count)
VALUES (
  'p1000000-0000-0000-0000-000000000010',
  'The Memory Collection',
  'the-memory-collection',
  'A curated gift set of our three most unforgettable fragrances.',
  'The Memory Collection brings together three of KUHUDE''s most beloved fragrances in an exquisitely crafted gift box. Featuring Velvet Memoir, Petal Whisper, and Citrine Breeze — this set captures every mood, every moment, every memory. Whether for yourself or someone unforgettable, this collection is the ultimate expression of the KUHUDE experience.',
  'c1000000-0000-0000-0000-000000000004',
  5999, 7497,
  'KH-MC-010',
  20, 'active', true, true,
  'Rose, Bergamot, Peony',
  'Oud, Jasmine, Freesia',
  'Amber, Musk, Sandalwood',
  'See individual products for full ingredient lists.',
  '3 x 30ml', 'Gift Set (3 x 30ml EDP)',
  'elegant-timeless',
  'Free shipping. Gift-wrapped. Delivered in 3-5 business days.',
  '15-day hassle-free returns on unused products.',
  4.9, 76
);

-- ============================================================================
-- PRODUCT IMAGES (placeholder URLs - replace with actual Supabase Storage URLs)
-- ============================================================================
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  ('p1000000-0000-0000-0000-000000000001', '/images/products/velvet-memoir-1.jpg', 'Velvet Memoir Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000002', '/images/products/midnight-jasmine-1.jpg', 'Midnight Jasmine Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000003', '/images/products/silk-saffron-1.jpg', 'Silk & Saffron Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000004', '/images/products/petal-whisper-1.jpg', 'Petal Whisper Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000005', '/images/products/amber-nocturne-1.jpg', 'Amber Nocturne Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000006', '/images/products/citrine-breeze-1.jpg', 'Citrine Breeze Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000007', '/images/products/rosewood-reverie-1.jpg', 'Rosewood Reverie Eau de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000008', '/images/products/moonlit-oud-1.jpg', 'Moonlit Oud Extrait de Parfum', 0, true),
  ('p1000000-0000-0000-0000-000000000009', '/images/products/sunlit-garden-1.jpg', 'Sunlit Garden Body Mist', 0, true),
  ('p1000000-0000-0000-0000-000000000010', '/images/products/memory-collection-1.jpg', 'The Memory Collection Gift Set', 0, true);

-- ============================================================================
-- PRODUCT VARIANTS (sizes)
-- ============================================================================
INSERT INTO product_variants (product_id, name, sku, price, compare_at_price, inventory_count, sort_order) VALUES
  ('p1000000-0000-0000-0000-000000000001', '30ml', 'KH-VM-001-30', 1499, 1999, 30, 0),
  ('p1000000-0000-0000-0000-000000000001', '50ml', 'KH-VM-001-50', 2299, 2999, 25, 1),
  ('p1000000-0000-0000-0000-000000000001', '100ml', 'KH-VM-001-100', 2999, 3999, 50, 2),
  ('p1000000-0000-0000-0000-000000000002', '50ml', 'KH-MJ-002-50', 2499, NULL, 20, 0),
  ('p1000000-0000-0000-0000-000000000002', '100ml', 'KH-MJ-002-100', 3499, NULL, 35, 1),
  ('p1000000-0000-0000-0000-000000000003', '50ml', 'KH-SS-003-50', 2799, 3299, 15, 0),
  ('p1000000-0000-0000-0000-000000000003', '100ml', 'KH-SS-003-100', 4299, 4999, 25, 1);

-- ============================================================================
-- SAMPLE REVIEWS
-- ============================================================================
-- Note: Reviews reference auth.users. In production, these would be created by actual users.
-- For demo purposes, we'll skip inserting reviews here and let them be created through the app.

-- ============================================================================
-- HOMEPAGE CONTENT
-- ============================================================================
INSERT INTO homepage_content (section, title, subtitle, content, is_active, sort_order) VALUES
  ('hero', 'Born to Remember.', 'Fragrance made to become a memory.', '{"cta_primary": "Shop the Collection", "cta_secondary": "Discover Your Scent"}', true, 1),
  ('featured', 'Made to Linger.', 'Our most unforgettable creations.', NULL, true, 2),
  ('mood', 'How do you want to be remembered?', 'Every mood has a scent. Find yours.', NULL, true, 3),
  ('story', NULL, NULL, '{"paragraphs": ["Some moments disappear.", "Some stay with you.", "KUHUDE was created for the moments that deserve to linger — the first impression, the late-night conversation, the person you can''t forget.", "Because the best fragrance isn''t simply noticed.", "It''s remembered."]}', true, 4),
  ('bestsellers', 'Most Loved.', 'The fragrances our community reaches for again and again.', NULL, true, 5),
  ('newsletter', 'Stay unforgettable.', 'Be the first to discover new scents and exclusive offers.', NULL, true, 6);
