-- Seed data for trips table
-- This will create approximately 30 days worth of trip data with realistic variations

-- Insert test trips data for the last 30 days
INSERT INTO trips (
  kilometers_driven,
  diesel_liters_used,
  diesel_cost,
  maintenance_cost,
  profit_margin_percentage,
  profit_amount,
  grand_total,
  created_at,
  user_id
) VALUES 
-- Day 1 (30 days ago) - 3 trips
(150.5, 18.2, 546.00, 120.00, 15.0, 99.90, 765.90, NOW() - INTERVAL '30 days' + INTERVAL '8 hours', 1),
(220.0, 26.4, 792.00, 180.00, 18.0, 175.32, 1147.32, NOW() - INTERVAL '30 days' + INTERVAL '14 hours', 1),
(95.0, 11.4, 342.00, 85.00, 12.0, 51.28, 478.28, NOW() - INTERVAL '30 days' + INTERVAL '19 hours', 1),

-- Day 2 (29 days ago) - 2 trips
(180.0, 21.6, 648.00, 140.00, 16.0, 126.21, 914.21, NOW() - INTERVAL '29 days' + INTERVAL '9 hours', 1),
(310.0, 37.2, 1116.00, 250.00, 20.0, 273.20, 1639.20, NOW() - INTERVAL '29 days' + INTERVAL '15 hours', 1),

-- Day 3 (28 days ago) - 4 trips
(125.0, 15.0, 450.00, 100.00, 14.0, 77.00, 627.00, NOW() - INTERVAL '28 days' + INTERVAL '7 hours', 1),
(200.0, 24.0, 720.00, 160.00, 17.0, 149.60, 1029.60, NOW() - INTERVAL '28 days' + INTERVAL '11 hours', 1),
(85.0, 10.2, 306.00, 75.00, 11.0, 41.91, 422.91, NOW() - INTERVAL '28 days' + INTERVAL '16 hours', 1),
(275.0, 33.0, 990.00, 220.00, 19.0, 229.90, 1439.90, NOW() - INTERVAL '28 days' + INTERVAL '20 hours', 1),

-- Day 4 (27 days ago) - 1 trip
(165.0, 19.8, 594.00, 130.00, 15.5, 112.27, 836.27, NOW() - INTERVAL '27 days' + INTERVAL '10 hours', 1),

-- Day 5 (26 days ago) - 3 trips
(240.0, 28.8, 864.00, 190.00, 18.5, 195.09, 1249.09, NOW() - INTERVAL '26 days' + INTERVAL '8 hours', 1),
(110.0, 13.2, 396.00, 90.00, 13.0, 63.18, 549.18, NOW() - INTERVAL '26 days' + INTERVAL '13 hours', 1),
(190.0, 22.8, 684.00, 150.00, 16.5, 137.61, 971.61, NOW() - INTERVAL '26 days' + INTERVAL '18 hours', 1),

-- Day 6 (25 days ago) - 2 trips
(320.0, 38.4, 1152.00, 260.00, 21.0, 296.52, 1708.52, NOW() - INTERVAL '25 days' + INTERVAL '9 hours', 1),
(75.0, 9.0, 270.00, 65.00, 10.0, 33.50, 368.50, NOW() - INTERVAL '25 days' + INTERVAL '17 hours', 1),

-- Day 7 (24 days ago) - 5 trips (busy day)
(145.0, 17.4, 522.00, 115.00, 14.5, 92.37, 729.37, NOW() - INTERVAL '24 days' + INTERVAL '7 hours', 1),
(205.0, 24.6, 738.00, 165.00, 17.5, 158.03, 1061.03, NOW() - INTERVAL '24 days' + INTERVAL '10 hours', 1),
(95.0, 11.4, 342.00, 85.00, 12.5, 53.38, 480.38, NOW() - INTERVAL '24 days' + INTERVAL '14 hours', 1),
(285.0, 34.2, 1026.00, 230.00, 19.5, 244.86, 1500.86, NOW() - INTERVAL '24 days' + INTERVAL '16 hours', 1),
(120.0, 14.4, 432.00, 95.00, 13.5, 71.15, 598.15, NOW() - INTERVAL '24 days' + INTERVAL '19 hours', 1),

-- Day 8 (23 days ago) - 3 trips
(175.0, 21.0, 630.00, 135.00, 16.0, 122.40, 887.40, NOW() - INTERVAL '23 days' + INTERVAL '8 hours', 1),
(250.0, 30.0, 900.00, 200.00, 18.0, 198.00, 1298.00, NOW() - INTERVAL '23 days' + INTERVAL '15 hours', 1),
(65.0, 7.8, 234.00, 55.00, 9.0, 26.01, 315.01, NOW() - INTERVAL '23 days' + INTERVAL '20 hours', 1),

-- Day 9 (22 days ago) - 2 trips
(195.0, 23.4, 702.00, 155.00, 17.0, 145.69, 1002.69, NOW() - INTERVAL '22 days' + INTERVAL '9 hours', 1),
(135.0, 16.2, 486.00, 105.00, 14.0, 82.74, 673.74, NOW() - INTERVAL '22 days' + INTERVAL '16 hours', 1),

-- Day 10 (21 days ago) - 4 trips
(300.0, 36.0, 1080.00, 240.00, 20.5, 270.60, 1590.60, NOW() - INTERVAL '21 days' + INTERVAL '7 hours', 1),
(85.0, 10.2, 306.00, 75.00, 11.5, 43.82, 424.82, NOW() - INTERVAL '21 days' + INTERVAL '12 hours', 1),
(225.0, 27.0, 810.00, 180.00, 18.5, 183.15, 1173.15, NOW() - INTERVAL '21 days' + INTERVAL '15 hours', 1),
(105.0, 12.6, 378.00, 90.00, 12.0, 56.16, 524.16, NOW() - INTERVAL '21 days' + INTERVAL '18 hours', 1),

-- Day 11 (20 days ago) - 1 trip
(160.0, 19.2, 576.00, 125.00, 15.0, 105.15, 806.15, NOW() - INTERVAL '20 days' + INTERVAL '11 hours', 1),

-- Day 12 (19 days ago) - 3 trips
(210.0, 25.2, 756.00, 170.00, 17.5, 162.05, 1088.05, NOW() - INTERVAL '19 days' + INTERVAL '8 hours', 1),
(90.0, 10.8, 324.00, 80.00, 11.0, 44.44, 448.44, NOW() - INTERVAL '19 days' + INTERVAL '14 hours', 1),
(270.0, 32.4, 972.00, 215.00, 19.0, 225.23, 1412.23, NOW() - INTERVAL '19 days' + INTERVAL '17 hours', 1),

-- Day 13 (18 days ago) - 2 trips
(155.0, 18.6, 558.00, 120.00, 15.5, 105.09, 783.09, NOW() - INTERVAL '18 days' + INTERVAL '10 hours', 1),
(330.0, 39.6, 1188.00, 265.00, 21.5, 312.25, 1765.25, NOW() - INTERVAL '18 days' + INTERVAL '16 hours', 1),

-- Day 14 (17 days ago) - 6 trips (very busy day)
(125.0, 15.0, 450.00, 100.00, 14.0, 77.00, 627.00, NOW() - INTERVAL '17 days' + INTERVAL '6 hours', 1),
(185.0, 22.2, 666.00, 145.00, 16.5, 133.82, 944.82, NOW() - INTERVAL '17 days' + INTERVAL '9 hours', 1),
(95.0, 11.4, 342.00, 85.00, 12.0, 51.28, 478.28, NOW() - INTERVAL '17 days' + INTERVAL '12 hours', 1),
(245.0, 29.4, 882.00, 195.00, 18.0, 193.86, 1270.86, NOW() - INTERVAL '17 days' + INTERVAL '14 hours', 1),
(110.0, 13.2, 396.00, 90.00, 13.0, 63.18, 549.18, NOW() - INTERVAL '17 days' + INTERVAL '17 hours', 1),
(290.0, 34.8, 1044.00, 235.00, 19.5, 249.46, 1528.46, NOW() - INTERVAL '17 days' + INTERVAL '20 hours', 1),

-- Day 15 (16 days ago) - 3 trips
(140.0, 16.8, 504.00, 110.00, 14.5, 89.03, 703.03, NOW() - INTERVAL '16 days' + INTERVAL '8 hours', 1),
(220.0, 26.4, 792.00, 175.00, 17.0, 164.39, 1131.39, NOW() - INTERVAL '16 days' + INTERVAL '13 hours', 1),
(75.0, 9.0, 270.00, 65.00, 10.0, 33.50, 368.50, NOW() - INTERVAL '16 days' + INTERVAL '19 hours', 1),

-- Day 16 (15 days ago) - 2 trips
(190.0, 22.8, 684.00, 150.00, 16.0, 133.44, 967.44, NOW() - INTERVAL '15 days' + INTERVAL '9 hours', 1),
(315.0, 37.8, 1134.00, 255.00, 20.0, 277.80, 1666.80, NOW() - INTERVAL '15 days' + INTERVAL '15 hours', 1),

-- Day 17 (14 days ago) - 4 trips
(165.0, 19.8, 594.00, 130.00, 15.0, 108.60, 832.60, NOW() - INTERVAL '14 days' + INTERVAL '7 hours', 1),
(100.0, 12.0, 360.00, 85.00, 12.5, 55.63, 500.63, NOW() - INTERVAL '14 days' + INTERVAL '11 hours', 1),
(255.0, 30.6, 918.00, 205.00, 18.5, 207.73, 1330.73, NOW() - INTERVAL '14 days' + INTERVAL '16 hours', 1),
(80.0, 9.6, 288.00, 70.00, 10.5, 37.59, 395.59, NOW() - INTERVAL '14 days' + INTERVAL '18 hours', 1),

-- Day 18 (13 days ago) - 1 trip
(235.0, 28.2, 846.00, 185.00, 17.5, 180.43, 1211.43, NOW() - INTERVAL '13 days' + INTERVAL '12 hours', 1),

-- Day 19 (12 days ago) - 3 trips
(130.0, 15.6, 468.00, 105.00, 14.0, 80.22, 653.22, NOW() - INTERVAL '12 days' + INTERVAL '8 hours', 1),
(200.0, 24.0, 720.00, 160.00, 17.0, 149.60, 1029.60, NOW() - INTERVAL '12 days' + INTERVAL '14 hours', 1),
(280.0, 33.6, 1008.00, 225.00, 19.0, 234.27, 1467.27, NOW() - INTERVAL '12 days' + INTERVAL '17 hours', 1),

-- Day 20 (11 days ago) - 2 trips
(170.0, 20.4, 612.00, 135.00, 16.0, 119.52, 866.52, NOW() - INTERVAL '11 days' + INTERVAL '10 hours', 1),
(115.0, 13.8, 414.00, 95.00, 13.0, 66.17, 575.17, NOW() - INTERVAL '11 days' + INTERVAL '16 hours', 1),

-- Day 21 (10 days ago) - 5 trips
(145.0, 17.4, 522.00, 115.00, 14.5, 92.37, 729.37, NOW() - INTERVAL '10 days' + INTERVAL '7 hours', 1),
(205.0, 24.6, 738.00, 165.00, 17.0, 153.51, 1056.51, NOW() - INTERVAL '10 days' + INTERVAL '10 hours', 1),
(85.0, 10.2, 306.00, 75.00, 11.0, 41.91, 422.91, NOW() - INTERVAL '10 days' + INTERVAL '13 hours', 1),
(260.0, 31.2, 936.00, 210.00, 18.5, 211.96, 1357.96, NOW() - INTERVAL '10 days' + INTERVAL '16 hours', 1),
(125.0, 15.0, 450.00, 100.00, 14.0, 77.00, 627.00, NOW() - INTERVAL '10 days' + INTERVAL '19 hours', 1),

-- Day 22 (9 days ago) - 3 trips
(185.0, 22.2, 666.00, 145.00, 16.5, 133.82, 944.82, NOW() - INTERVAL '9 days' + INTERVAL '8 hours', 1),
(95.0, 11.4, 342.00, 85.00, 12.0, 51.28, 478.28, NOW() - INTERVAL '9 days' + INTERVAL '15 hours', 1),
(305.0, 36.6, 1098.00, 245.00, 20.0, 268.60, 1611.60, NOW() - INTERVAL '9 days' + INTERVAL '18 hours', 1),

-- Day 23 (8 days ago) - 2 trips
(150.0, 18.0, 540.00, 120.00, 15.0, 99.00, 759.00, NOW() - INTERVAL '8 days' + INTERVAL '9 hours', 1),
(225.0, 27.0, 810.00, 180.00, 17.5, 173.25, 1163.25, NOW() - INTERVAL '8 days' + INTERVAL '14 hours', 1),

-- Day 24 (7 days ago) - 4 trips
(110.0, 13.2, 396.00, 90.00, 13.0, 63.18, 549.18, NOW() - INTERVAL '7 days' + INTERVAL '7 hours', 1),
(175.0, 21.0, 630.00, 135.00, 16.0, 122.40, 887.40, NOW() - INTERVAL '7 days' + INTERVAL '11 hours', 1),
(290.0, 34.8, 1044.00, 235.00, 19.0, 242.77, 1521.77, NOW() - INTERVAL '7 days' + INTERVAL '15 hours', 1),
(70.0, 8.4, 252.00, 60.00, 9.5, 29.64, 341.64, NOW() - INTERVAL '7 days' + INTERVAL '18 hours', 1),

-- Day 25 (6 days ago) - 1 trip
(240.0, 28.8, 864.00, 190.00, 18.0, 189.72, 1243.72, NOW() - INTERVAL '6 days' + INTERVAL '12 hours', 1),

-- Day 26 (5 days ago) - 3 trips
(155.0, 18.6, 558.00, 120.00, 15.5, 105.09, 783.09, NOW() - INTERVAL '5 days' + INTERVAL '8 hours', 1),
(195.0, 23.4, 702.00, 155.00, 17.0, 145.69, 1002.69, NOW() - INTERVAL '5 days' + INTERVAL '13 hours', 1),
(275.0, 33.0, 990.00, 220.00, 19.0, 229.90, 1439.90, NOW() - INTERVAL '5 days' + INTERVAL '17 hours', 1),

-- Day 27 (4 days ago) - 2 trips
(135.0, 16.2, 486.00, 105.00, 14.0, 82.74, 673.74, NOW() - INTERVAL '4 days' + INTERVAL '10 hours', 1),
(320.0, 38.4, 1152.00, 260.00, 21.0, 296.52, 1708.52, NOW() - INTERVAL '4 days' + INTERVAL '16 hours', 1),

-- Day 28 (3 days ago) - 6 trips (weekend busy day)
(120.0, 14.4, 432.00, 95.00, 13.5, 71.15, 598.15, NOW() - INTERVAL '3 days' + INTERVAL '6 hours', 1),
(180.0, 21.6, 648.00, 140.00, 16.0, 126.21, 914.21, NOW() - INTERVAL '3 days' + INTERVAL '9 hours', 1),
(90.0, 10.8, 324.00, 80.00, 11.0, 44.44, 448.44, NOW() - INTERVAL '3 days' + INTERVAL '12 hours', 1),
(250.0, 30.0, 900.00, 200.00, 18.0, 198.00, 1298.00, NOW() - INTERVAL '3 days' + INTERVAL '14 hours', 1),
(105.0, 12.6, 378.00, 90.00, 12.0, 56.16, 524.16, NOW() - INTERVAL '3 days' + INTERVAL '17 hours', 1),
(295.0, 35.4, 1062.00, 240.00, 19.5, 253.89, 1555.89, NOW() - INTERVAL '3 days' + INTERVAL '20 hours', 1),

-- Day 29 (2 days ago) - 3 trips
(165.0, 19.8, 594.00, 130.00, 15.0, 108.60, 832.60, NOW() - INTERVAL '2 days' + INTERVAL '8 hours', 1),
(210.0, 25.2, 756.00, 170.00, 17.0, 157.42, 1083.42, NOW() - INTERVAL '2 days' + INTERVAL '14 hours', 1),
(85.0, 10.2, 306.00, 75.00, 11.0, 41.91, 422.91, NOW() - INTERVAL '2 days' + INTERVAL '18 hours', 1),

-- Day 30 (yesterday) - 4 trips
(140.0, 16.8, 504.00, 110.00, 14.5, 89.03, 703.03, NOW() - INTERVAL '1 day' + INTERVAL '7 hours', 1),
(230.0, 27.6, 828.00, 185.00, 18.0, 182.34, 1195.34, NOW() - INTERVAL '1 day' + INTERVAL '11 hours', 1),
(100.0, 12.0, 360.00, 85.00, 12.5, 55.63, 500.63, NOW() - INTERVAL '1 day' + INTERVAL '15 hours', 1),
(285.0, 34.2, 1026.00, 230.00, 19.0, 238.94, 1494.94, NOW() - INTERVAL '1 day' + INTERVAL '19 hours', 1),

-- Today - 2 trips
(175.0, 21.0, 630.00, 135.00, 16.0, 122.40, 887.40, NOW() - INTERVAL '6 hours', 1),
(265.0, 31.8, 954.00, 215.00, 18.5, 216.32, 1385.32, NOW() - INTERVAL '2 hours', 1);

-- Summary: 
-- Total trips: 95 trips over 30 days
-- Average: ~3.2 trips per day
-- Variety in trip lengths, costs, and profit margins
-- Realistic business patterns with busier and slower days