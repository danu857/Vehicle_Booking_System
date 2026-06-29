CREATE DATABASE VehicleServiceBooking;

USE VehicleServiceBooking;

CREATE TABLE Users
(
    UserId VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Address VARCHAR(200),
    Password VARCHAR(100) NOT NULL,
    Role VARCHAR(20) NOT NULL
);
drop table Bookings

CREATE TABLE Bookings
(
    BookingId VARCHAR(20) PRIMARY KEY,
    UserId VARCHAR(20),
    CustomerName VARCHAR(100),
    Service VARCHAR(100),
    VehicleNumber VARCHAR(20),
    VehicleType VARCHAR(20),
    BookingDate DATETIME,
    Amount INT,
    Status VARCHAR(20),
    RejectReason VARCHAR(200),
    SuggestedDate DATE,
    SuggestedTime TIME,
    FOREIGN KEY(UserId)
    REFERENCES Users(UserId)
);

INSERT INTO Users VALUES
('VS001',NULL,'support@vehicleservice.com',NULL,NULL,'support123','support'),
('U001','Danusree K S','danu@gmail.com','9877766612','Nehru Nagar, Coimbatore','@Danu123','customer'),
('U002','Devasree K','deva@gmail.com','9876543210','Nehru Nagar, Coimbatore','Deva123','customer'),
('U003','Hari','hari@gmail.com','6543217890','Kovilmedu, Coimbatore','@Hari123','customer'),
('U004','Sindhu','sindhu@gmail.com','9087654321','Kavundampalayam, Coimbatore','@Sindhu123','customer'),
('U005','Mano','mano@gmail.com','9087654321','Perur, Coimbatore','@Mano123','customer');

INSERT INTO Bookings VALUES
('B001','U001','Danusree K S','Car Wash','TN37A6673','Car','2026-06-28 11:30',700,'Rejected','Slot not available','2026-06-28','17:00'),
('B002','U002','Devasree K','Brake Service','TN37A4430','Bike','2026-06-29 17:30',1200,'Completed','',NULL,NULL),
('B003','U003','Hari','General Service','TN37A7366','Bike','2026-07-02 20:30',1500,'Accepted','',NULL,NULL),
('B004','U004','Sindhu','Wheel Alignment','TN37B1706','Car','2026-07-01 16:30',800,'Pending','',NULL,NULL),
('B005','U005','Mano','Car Wash','TN37A6677','Car','2026-07-06 18:30',700,'Pending','',NULL,NULL);

--1. Display all records
SELECT * FROM Bookings;

--2. Display active records
SELECT * FROM Bookings WHERE Status IN ('Pending','Accepted');

--3. Display inactive records
SELECT * FROM Bookings WHERE Status IN ('Completed','Rejected');

--4. Search by name
SELECT * FROM Bookings WHERE CustomerName LIKE '%Mano%';

--5. Count total records
SELECT COUNT(*) AS TotalBookings FROM Bookings;

--6. Count records by status
SELECT Status,COUNT(*) AS Total FROM Bookings GROUP BY Status;

--7. Display recently added records
SELECT * FROM Bookings ORDER BY BookingDate DESC;

--8. Display records within date range
SELECT * FROM Bookings WHERE BookingDate BETWEEN '2026-06-25' AND '2026-07-05';

--9. Display top 5 records
SELECT TOP 5 * FROM Bookings;

--10. Display summary report

SELECT COUNT(*) AS TotalBookings,
SUM(CASE WHEN Status='Pending' THEN 1 ELSE 0 END) AS Pending,
SUM(CASE WHEN Status='Accepted' THEN 1 ELSE 0 END) AS Accepted,
SUM(CASE WHEN Status='Completed' THEN 1 ELSE 0 END) AS Completed,
SUM(CASE WHEN Status='Rejected' THEN 1 ELSE 0 END) AS Rejected,
SUM(CAST(Amount AS INT)) AS TotalRevenue
FROM Bookings;


---VIEWS----

CREATE VIEW ActiveBookings AS
SELECT * FROM Bookings WHERE Status IN ('Pending','Accepted');

SELECT * FROM ActiveBookings;



CREATE VIEW BookingHistory AS
SELECT * FROM Bookings WHERE Status IN ('Completed','Rejected');

SELECT * FROM BookingHistory;


CREATE VIEW CustomerDetails
AS
SELECT UserId,Name,Email,Phone,Address FROM Users
WHERE Role='customer';

SELECT * FROM CustomerDetails;

CREATE VIEW BookingSummary
AS
SELECT COUNT(*) AS TotalBookings,
SUM(CASE WHEN Status='Pending' THEN 1 ELSE 0 END) AS Pending,
SUM(CASE WHEN Status='Accepted' THEN 1 ELSE 0 END) AS Accepted,
SUM(CASE WHEN Status='Completed' THEN 1 ELSE 0 END) AS Completed,
SUM(CASE WHEN Status='Rejected' THEN 1 ELSE 0 END) AS Rejected
FROM Bookings;

SELECT * FROM BookingSummary;


---INDEX---

CREATE INDEX INDEX_CustomerName ON Bookings(CustomerName);

CREATE INDEX INDEX_VehicleNumber ON Bookings(VehicleNumber);

CREATE INDEX INDEX_Status ON Bookings(Status);

CREATE INDEX INDEX_BookingDate ON Bookings(BookingDate);