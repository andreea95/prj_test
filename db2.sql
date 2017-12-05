SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
CREATE DATABASE `manager_contacte` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `manager_contacte`;
CREATE TABLE IF NOT EXISTS `persoana` (
    `persoanaId` int NOT NULL AUTO_INCREMENT,
    `nume` varchar(50) NOT NULL,
    `porecla` varchar(50),
    `domiciliu` varchar(150),
    `data_de_nastere` date,
    PRIMARY KEY (`persoanaId`),
    KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `contact` (
    `contactId` int NOT NULL  AUTO_INCREMENT,
     `persoanaId` int DEFAULT NULL,
     `telefon` varchar(50),
     `telefon_secundar` varchar(50),
     `e_mail` varchar(50),
    PRIMARY KEY (`contactId`),
     KEY `id_contacte` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
