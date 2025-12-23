const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// ------------------------------
// [POST] /bookings
// Maak een nieuwe reservering
// ------------------------------
router.post('/', async (req, res) => {
    const { TripID, PassengerID } = req.body;

    if (!TripID || !PassengerID) {
        return res.status(400).json({ status: "Error", message: "TripID en PassengerID zijn verplicht." });
    }

    const trip = await prisma.trip.findUnique({
        where: { TripID: parseInt(TripID) }
    });

    if (trip.SeatsBooked >= trip.SeatsOffered) {
        return res.status(400).json({ message: "Deze rit zit vol." });
    }

    const existingBooking = await prisma.passengerbooking.findUnique({
        where: {
            TripID_PassengerID: {
                TripID: parseInt(TripID),
                PassengerID: parseInt(PassengerID)
            }
        }
    });

    if (existingBooking) {
        return res.status(400).json({ message: "Je hebt deze rit al geboekt!" });
    }

    await prisma.$transaction([
        prisma.passengerbooking.create({
            data: {
                TripID: parseInt(TripID),
                PassengerID: parseInt(PassengerID),
                SeatsRequested: 1,
                BookingStatus: 'Confirmed' 
            }
        }),
        prisma.trip.update({
            where: { TripID: parseInt(TripID) },
            data: {
                SeatsBooked: {
                    increment: 1 
                }
            }
        })
    ]);

    res.json({ status: "Success"});
    
});

module.exports = router;