-- CreateTable
CREATE TABLE `meetingmember` (
    `MeetingMemberID` INTEGER NOT NULL AUTO_INCREMENT,
    `MeetingID` INTEGER NOT NULL,
    `StaffID` INTEGER NOT NULL,
    `IsPresent` BOOLEAN NULL DEFAULT false,
    `Remarks` VARCHAR(255) NULL,
    `Created` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Modified` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_meeting`(`MeetingID`),
    INDEX `fk_staff`(`StaffID`),
    PRIMARY KEY (`MeetingMemberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetings` (
    `MeetingID` INTEGER NOT NULL AUTO_INCREMENT,
    `MeetingDate` DATETIME(0) NOT NULL,
    `MeetingTypeID` INTEGER NOT NULL,
    `MeetingDescription` VARCHAR(255) NULL,
    `DocumentPath` VARCHAR(255) NULL,
    `Created` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Modified` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `IsCancelled` BOOLEAN NULL DEFAULT false,
    `CancellationDateTime` DATETIME(0) NULL,
    `CancellationReason` VARCHAR(255) NULL,

    INDEX `fk_meeting_type`(`MeetingTypeID`),
    PRIMARY KEY (`MeetingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetingtype` (
    `MeetingTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `MeetingTypeName` VARCHAR(100) NOT NULL,
    `Remarks` VARCHAR(255) NULL,
    `Created` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Modified` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`MeetingTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff` (
    `StaffID` INTEGER NOT NULL AUTO_INCREMENT,
    `StaffName` VARCHAR(100) NOT NULL,
    `MobileNo` VARCHAR(15) NULL,
    `EmailAddress` VARCHAR(100) NULL,
    `Remarks` VARCHAR(255) NULL,
    `Created` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Modified` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`StaffID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ModifiedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meetingmember` ADD CONSTRAINT `fk_meeting` FOREIGN KEY (`MeetingID`) REFERENCES `meetings`(`MeetingID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `meetingmember` ADD CONSTRAINT `fk_staff` FOREIGN KEY (`StaffID`) REFERENCES `staff`(`StaffID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `meetings` ADD CONSTRAINT `fk_meeting_type` FOREIGN KEY (`MeetingTypeID`) REFERENCES `meetingtype`(`MeetingTypeID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
