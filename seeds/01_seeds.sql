INSERT INTO users (name, email, password)
VALUES ('Kris', 'kris@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Hans', 'hans@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('John', 'john@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'title message', 'description message', 'thumbnail photo url', 'cover photo url', 20, 6, 4, 8, 'country', 'street', 'city', 'province', 'post code'),
(2, 'title message', 'description message', 'thumbnail photo url', 'cover photo url', 20, 6, 6, 7, 'country', 'street', 'city', 'province', 'post code'),
(3, 'title message', 'description message', 'thumbnail photo url', 'cover photo url', 20, 0, 5, 6, 'country', 'street', 'city', 'province', 'post code');


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 3, 3),
('2019-01-04', '2019-02-01', 1, 1),
('2021-10-01', '2021-10-14', 2, 2);

INSERT INTO property_reviews (property_id, guest_id, reservation_id, rating, message)
VALUES (1, 1, 1, 3, 'message'),
(1, 1, 1, 1, 'message'),
(1, 1, 1, 1, 'message');