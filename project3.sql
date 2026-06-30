-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: יוני 30, 2026 בזמן 02:32 PM
-- גרסת שרת: 8.4.9
-- PHP Version: 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project3`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `UserID` int NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Regular','Admin','Manager') NOT NULL DEFAULT 'Regular'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `LastName`, `Email`, `Password`, `Role`) VALUES
(1, 'Yam', 'Cohen', 'yam.cohen@example.com', '$2b$10$abc123hashedpassword1', 'Admin'),
(2, 'Noa', 'Levi', 'noa.levi@example.com', '$2b$10$abc123hashedpassword2', 'Regular'),
(3, 'Daniel', 'Mizrahi', 'daniel.mizrahi@example.com', '$2b$10$abc123hashedpassword3', 'Regular'),
(4, 'Shira', 'Peretz', 'shira.peretz@example.com', '$2b$10$abc123hashedpassword4', 'Regular'),
(5, 'Eitan', 'Biton', 'eitan.biton@example.com', '$2b$10$abc123hashedpassword5', 'Admin'),
(6, 'Maya', 'Azoulay', 'maya.azoulay@example.com', '$2b$10$abc123hashedpassword6', 'Regular'),
(7, 'Test', 'Manager', 'manager_20260630171425@test.com', '$2b$10$dl6KI.vD7aMrJnCUktfABeGGhtDYoe.nzo..q2ley08owodmTGyau', 'Manager'),
(8, 'Test', 'Manager', 'manager2_20260630171454@test.com', '$2b$10$g5GZanQirpKv1iol4skhfe2VJPrd29B.noNl7LHCnJ6q51QEMJKii', 'Manager'),
(9, 'zohar', 'barda', 'zohar.barda10@gmail.com', '$2b$10$JiabNgQjg8PQ4ri1y24J.u0Ybk7rwtqEaVOVIVBcQJr3YTdsMZnke', 'Regular'),
(10, 'Zohar', 'Admin', 'admin@project3.local', '$2b$10$xogW.IaL3U.N/ArZwIDUg.6r22CQj6EESedJDYlJqO9qt3Q2ShiQ.', 'Admin');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `Vacations`
--

CREATE TABLE `Vacations` (
  `VacationID` int NOT NULL,
  `Destination` varchar(100) NOT NULL,
  `Description` text NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `ImageFileName` varchar(255) DEFAULT NULL,
  `CreatedByUserID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- הוצאת מידע עבור טבלה `Vacations`
--

INSERT INTO `Vacations` (`VacationID`, `Destination`, `Description`, `StartDate`, `EndDate`, `Price`, `ImageFileName`, `CreatedByUserID`) VALUES
(1, 'Paris, France', 'טיול רומנטי בעיר האורות עם ביקור במגדל אייפל ומוזיאון הלובר', '2026-07-10', '2026-07-17', 1899.99, 'paris.jpg', 1),
(2, 'Rome, Italy', 'חופשה קסומה ברומא עם סיור בקולוסיאום, הוותיקן ומזרקת טרווי', '2026-08-05', '2026-08-12', 1599.50, 'rome.jpg', 1),
(4, 'London, England', 'טיול עירוני בלונדון עם ביקור בביג בן, ארמון בקינגהאם ולונדון איי', '2026-09-01', '2026-09-08', 1750.00, 'london.jpg', 1),
(5, 'New York, USA', 'חופשה בעיר שלא ישנה לעולם עם טיימס סקוור, סנטרל פארק ופסל החירות', '2026-10-10', '2026-10-18', 2499.99, 'newyork.jpg', 1),
(6, 'Tokyo, Japan', 'מסע תרבותי ביפן עם ביקור בטוקיו, שיבויה, מקדשים ואוכל מסורתי', '2026-11-03', '2026-11-12', 3299.00, 'tokyo.jpg', 1),
(7, 'Bangkok, Thailand', 'חופשה טרופית בתאילנד עם שווקים, מקדשים וחיי לילה', '2026-12-01', '2026-12-10', 1399.99, 'bangkok.jpg', 2),
(8, 'Dubai, UAE', 'נופש יוקרתי בדובאי עם קניות, בורג׳ חליפה וספארי במדבר', '2027-01-15', '2027-01-22', 1999.00, 'dubai.jpg', 2),
(9, 'Athens, Greece', 'חופשה ים תיכונית עם ביקור באקרופוליס ואיי יוון', '2026-08-15', '2026-08-22', 1299.00, 'athens.jpg', 3),
(10, 'Amsterdam, Netherlands', 'טיול רגוע עם תעלות העיר, מוזיאונים ואווירה אירופאית מיוחדת', '2026-09-20', '2026-09-27', 1499.99, 'amsterdam.jpg', 5),
(11, 'Berlin, Germany', 'חופשה אורבנית עם חיי לילה, היסטוריה ותרבות מודרנית', '2026-10-01', '2026-10-07', 1350.00, 'berlin.jpg', 4),
(12, 'Prague, Czech Republic', 'טיול קסום בפראג עם גשר קארל, העיר העתיקה וטירות מרהיבות', '2026-12-20', '2026-12-27', 1199.50, 'prague.jpg', 6),
(25, 'Paris', 'City break', '2026-08-10', '2026-08-15', 1299.99, NULL, 7);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `vacation_likes`
--

CREATE TABLE `vacation_likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `vacation_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- הוצאת מידע עבור טבלה `vacation_likes`
--

INSERT INTO `vacation_likes` (`id`, `user_id`, `vacation_id`, `created_at`) VALUES
(1, 7, 25, '2026-06-30 14:14:26'),
(3, 9, 1, '2026-06-30 14:24:53'),
(5, 9, 2, '2026-06-30 14:24:59'),
(6, 9, 4, '2026-06-30 14:25:01'),
(7, 9, 9, '2026-06-30 14:25:02');

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `Email_2` (`Email`);

--
-- אינדקסים לטבלה `Vacations`
--
ALTER TABLE `Vacations`
  ADD PRIMARY KEY (`VacationID`),
  ADD KEY `CreatedByUserID` (`CreatedByUserID`);

--
-- אינדקסים לטבלה `vacation_likes`
--
ALTER TABLE `vacation_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_vacation` (`user_id`,`vacation_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Vacations`
--
ALTER TABLE `Vacations`
  MODIFY `VacationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `vacation_likes`
--
ALTER TABLE `vacation_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- הגבלות לטבלאות שהוצאו
--

--
-- הגבלות לטבלה `Vacations`
--
ALTER TABLE `Vacations`
  ADD CONSTRAINT `vacations_ibfk_1` FOREIGN KEY (`CreatedByUserID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
