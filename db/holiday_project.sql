-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.2
-- Generation Time: Sep 04, 2018 at 12:31 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `holiday_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `cab_booking_master`
--

CREATE TABLE `cab_booking_master` (
  `ID` int(11) NOT NULL,
  `Cab_Vin` varchar(255) NOT NULL,
  `Cus_Name` varchar(255) NOT NULL,
  `Cus_Contact` varchar(255) NOT NULL,
  `Cus_Location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `cab_details_master`
--

CREATE TABLE `cab_details_master` (
  `ID` int(11) NOT NULL,
  `Cab_Name` varchar(255) NOT NULL,
  `Cab_Vin` varchar(255) NOT NULL,
  `Cab_Driver` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cab_details_master`
--

INSERT INTO `cab_details_master` (`ID`, `Cab_Name`, `Cab_Vin`, `Cab_Driver`) VALUES
(1, 'Swift Desire', 'DL 93C 0931', 'Jyotirmoy Nath'),
(2, 'Volvo', 'DL 3C 4432', 'Jyotirmoy'),
(3, 'Volkeswagon', 'DL 1C 4334', 'Jyotirmoy Nath');

-- --------------------------------------------------------

--
-- Table structure for table `cab_location_master`
--

CREATE TABLE `cab_location_master` (
  `ID` int(11) NOT NULL,
  `Cab_Vin` varchar(255) NOT NULL,
  `Cab_location` varchar(255) NOT NULL,
  `Cab_Available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cab_booking_master`
--
ALTER TABLE `cab_booking_master`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `cab_details_master`
--
ALTER TABLE `cab_details_master`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `cab_location_master`
--
ALTER TABLE `cab_location_master`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cab_booking_master`
--
ALTER TABLE `cab_booking_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `cab_details_master`
--
ALTER TABLE `cab_details_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `cab_location_master`
--
ALTER TABLE `cab_location_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
