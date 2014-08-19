-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 18, 2014 at 03:00 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ratingsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `openmrs_uuid` varchar(500) NOT NULL,
  `location_id` varchar(500) NOT NULL,
  `comment` varchar(500) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`openmrs_uuid`, `location_id`, `comment`, `timestamp`, `name`) VALUES
('2', '3', 'great place', '2014-06-11 05:28:01', 'Garippa Haroun'),
('2', '3', 'good place', '2014-06-11 05:28:36', 'Garippa Haroun'),
('4', '5', 'not bad', '2014-06-11 05:37:32', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ab66fd35758f9eab714280fd0d20dbcb6e09d545', 'Nice place', '2014-06-11 06:09:56', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ab66fd35758f9eab714280fd0d20dbcb6e09d545', 'Nice place', '2014-06-11 06:09:56', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'Such a horrible place!', '2014-06-11 08:16:49', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'Such a horrible place!', '2014-06-11 08:16:49', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'double check!', '2014-06-11 08:20:32', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'double check!', '2014-06-11 08:20:32', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'test comment', '2014-06-11 08:26:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'test comment', '2014-06-11 08:26:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'Test comment 2', '2014-06-11 08:30:28', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'Test comment 2', '2014-06-11 08:30:28', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd29c6958b776b5a8d8b3ec7bc0eb9764cf08407e', 'this place is good', '2014-06-11 12:41:41', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd29c6958b776b5a8d8b3ec7bc0eb9764cf08407e', 'this place is good', '2014-06-11 12:41:41', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '9d9a510ff8f1cf1ae716df6a0ea2d1273db5e635', 'testing 1....', '2014-06-11 12:47:17', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '9d9a510ff8f1cf1ae716df6a0ea2d1273db5e635', 'testing 1....', '2014-06-11 12:47:18', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '6e14c7fdfd3240616e6db4f50b2be45ce71d705b', 'Good pharmacy', '2014-06-11 13:09:13', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '6e14c7fdfd3240616e6db4f50b2be45ce71d705b', 'Good pharmacy', '2014-06-11 13:09:13', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 'best place ', '2014-06-11 13:14:01', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 'best place ', '2014-06-11 13:14:01', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 'like', '2014-06-11 13:19:28', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 'like', '2014-06-11 13:19:28', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 'Nice', '2014-06-11 15:16:39', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 'Nice', '2014-06-11 15:16:40', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a72490595db5855335570bf664339c63131db41f', 'Nice place', '2014-06-11 19:35:42', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a72490595db5855335570bf664339c63131db41f', 'Nice place', '2014-06-11 19:35:43', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '987f12744adde77f056d5d8d283364dfd91e3e83', 'Phone test', '2014-06-13 14:46:07', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '222a59a8d2a6bd338d7808576817b2406b791d12', '', '2014-06-13 14:46:47', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'test for white spaces', '2014-06-13 14:57:44', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'test for white spaces', '2014-06-13 14:57:44', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd45bdcf5c27863a50db7d747fd9d11bc14f6cf3e', 'Spacr test', '2014-06-13 15:48:33', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'Not bad', '2014-06-13 16:00:49', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'Not bad', '2014-06-13 16:00:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'test1', '2014-06-21 21:15:54', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'test1', '2014-06-21 21:15:54', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'my comment', '2014-06-21 21:27:33', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 'my comment', '2014-06-21 21:27:34', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a8e7b848eb8a3df50e0753ef4728022637af766f', 'My comment', '2014-06-21 21:27:49', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a8e7b848eb8a3df50e0753ef4728022637af766f', 'My comment', '2014-06-21 21:27:49', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a72490595db5855335570bf664339c63131db41f', 'Great', '2014-06-21 21:39:02', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ab66fd35758f9eab714280fd0d20dbcb6e09d545', 'Good', '2014-06-22 10:53:34', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '11390ab809723920d2f422a23ada7b32ec785421', 'Nice place', '2014-06-22 12:21:59', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '4cbe9e7f10f9e49639a4e322af4247b881c9c7b2', 'Good', '2014-06-23 09:47:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '4cbe9e7f10f9e49639a4e322af4247b881c9c7b2', 'Good', '2014-06-23 09:47:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd9676fe0e00a66392749f7dc4a82e77c29f2e27f', 'Good', '2014-06-23 10:38:58', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd9676fe0e00a66392749f7dc4a82e77c29f2e27f', 'Good', '2014-06-23 10:38:58', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'cbe343b8f0fb259440884028b0f23ec3dc235bea', 'Good', '2014-06-23 10:54:20', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'cbe343b8f0fb259440884028b0f23ec3dc235bea', 'Good', '2014-06-23 10:54:20', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'cbe343b8f0fb259440884028b0f23ec3dc235bea', 'test comment', '2014-06-23 11:21:44', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'cbe343b8f0fb259440884028b0f23ec3dc235bea', 'test comment', '2014-06-23 11:21:44', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '18a85046b64dc9849bf361b1adc084affd769cbc', 'test comment', '2014-06-23 12:18:00', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '18a85046b64dc9849bf361b1adc084affd769cbc', 'test comment', '2014-06-23 12:18:00', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'e2ca070847bd700fc179c421c8509f6538993bae', 'Great', '2014-06-23 17:18:02', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 'test after new design', '2014-07-14 20:14:59', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 'test after new design', '2014-07-14 20:14:59', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 'test 2 after new design', '2014-07-14 20:19:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 'test 2 after new design', '2014-07-14 20:19:50', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 'test 3after new design', '2014-07-14 20:20:34', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 'test 3after new design', '2014-07-14 20:20:34', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 'test 1 ', '2014-07-14 20:21:53', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 'test 1 ', '2014-07-14 20:21:54', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'bd98ba481af389100d0120403ebad34da33b8a84', 'Phone test after new design', '2014-07-15 06:47:15', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'dad230ae96142ca4bb13586bafb6d64b24367a8b', 'Great', '2014-07-16 07:49:18', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 'test 2', '2014-07-18 15:52:52', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 'test 2', '2014-07-18 15:52:52', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 'my test 1', '2014-07-19 12:16:48', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 'my test 1', '2014-07-19 12:16:48', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJR4UDFBVZ4joRP_xY2MRgJaE', 'test after converting to place_id', '2014-07-20 05:55:30', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJR4UDFBVZ4joRP_xY2MRgJaE', 'test after converting to place_id', '2014-07-20 05:55:30', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJQXQ2tj9Z4joRwbS3V9gKssE', 'Great place', '2014-08-09 11:37:44', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJQXQ2tj9Z4joRwbS3V9gKssE', 'Great place', '2014-08-09 11:37:44', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJe3T_MrhI4joROrMSBKGgBak', 'Great place', '2014-08-11 12:00:15', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJQXQ2tj9Z4joRwbS3V9gKssE', 'Like the place :)', '2014-08-14 16:37:55', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJQXQ2tj9Z4joRwbS3V9gKssE', 'Like the place :)', '2014-08-14 16:37:55', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJR4UDFBVZ4joRP_xY2MRgJaE', 'Great place', '2014-08-17 08:31:03', 'Garippa Haroun'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJe3T_MrhI4joROrMSBKGgBak', 'Good service', '2014-08-17 22:32:17', 'Garippa Haroun');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `openmrs_uuid` varchar(500) NOT NULL,
  `location_id` varchar(500) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`openmrs_uuid`,`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`openmrs_uuid`, `location_id`, `status`, `timestamp`) VALUES
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '', 0, '2014-07-19 08:31:00'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '11390ab809723920d2f422a23ada7b32ec785421', 1, '2014-06-22 12:21:47'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '18a85046b64dc9849bf361b1adc084affd769cbc', 0, '2014-06-23 12:18:26'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '1ab0be0ac9f2b2c68491748d0b65e27c92512807', 0, '2014-06-11 19:34:01'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '222a59a8d2a6bd338d7808576817b2406b791d12', 1, '2014-06-13 14:46:34'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '2748ac2cb041c139ccbb59501d63d765ca0481b4', 1, '2014-06-11 19:36:25'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '4cbe9e7f10f9e49639a4e322af4247b881c9c7b2', 1, '2014-06-13 16:39:19'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '6e14c7fdfd3240616e6db4f50b2be45ce71d705b', 1, '2014-06-11 13:06:15'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '8f91f36edf442717340da17ad65e9b9a1304284f', 0, '2014-06-13 16:00:43'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '987f12744adde77f056d5d8d283364dfd91e3e83', 0, '2014-06-13 14:44:52'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', '9d9a510ff8f1cf1ae716df6a0ea2d1273db5e635', 1, '2014-06-11 12:47:39'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a4e91b4f12921eed2a7561b352a485fd71ac01d4', 0, '2014-07-14 19:35:01'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a72490595db5855335570bf664339c63131db41f', 1, '2014-06-11 19:35:03'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'a8e7b848eb8a3df50e0753ef4728022637af766f', 0, '2014-06-21 21:28:02'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ab66fd35758f9eab714280fd0d20dbcb6e09d545', 1, '2014-06-22 10:52:54'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'b5d0844f7a0d8ff7330c16ba0bd4cddf4b71407f', 0, '2014-07-14 20:01:57'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ca58580e3b096ce3082638b3914d322ca33f3156', 0, '2014-06-11 15:09:46'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'cbe343b8f0fb259440884028b0f23ec3dc235bea', 0, '2014-06-23 10:54:43'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJ86yu3ZRI4joRqzxXH15pKLE', 1, '2014-08-17 22:53:21'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJDwIT6JRI4joRNHZzOVOv-FQ', 1, '2014-08-17 22:53:19'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJe3T_MrhI4joROrMSBKGgBak', 1, '2014-08-11 11:59:41'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJHd6M1AlZ4joR_C1aEyAA3rw', 1, '2014-07-21 18:02:33'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJQXQ2tj9Z4joRwbS3V9gKssE', 1, '2014-07-22 05:25:24'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJR4UDFBVZ4joRP_xY2MRgJaE', 1, '2014-07-20 05:55:53'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJuQ_0khRZ4joRH_l0EcqJzS4', 0, '2014-07-20 06:06:05'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ChIJZbcPb5hI4joR-ODYKUQ4TUc', 1, '2014-08-17 15:02:46'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd45bdcf5c27863a50db7d747fd9d11bc14f6cf3e', 0, '2014-06-13 15:48:40'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'd9676fe0e00a66392749f7dc4a82e77c29f2e27f', 1, '2014-06-23 10:38:32'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'e2ca070847bd700fc179c421c8509f6538993bae', 1, '2014-06-23 17:18:08'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f4c3ca9a639642653dcd3d6968a8aff6e723da50', 0, '2014-06-11 12:55:20'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f56df4e2a3177dbab596727084d89be7c9f40174', 1, '2014-06-11 13:00:16'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'f8b7d4a2896dabd9860b98845cf2a4e3925431be', 0, '2014-07-19 10:03:20'),
('0f23054a-e2ec-ca54-0b6f-a29dd52ac628', 'ffd0ebc3411498c1ff0a996a9f6ee53268eba654', 1, '2014-06-13 15:01:09'),
('1', '1', 1, '2014-06-11 05:20:43'),
('1', '2', 1, '2014-06-11 05:20:43'),
('2', '1', 1, '2014-06-11 05:29:59'),
('2', '3', 0, '2014-06-11 05:26:05');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
