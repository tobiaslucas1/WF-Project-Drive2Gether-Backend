// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ------------------------------
// [Get] passengers of trips
// return array trip-passenger bookings
// ------------------------------
router.get('/', async (req, res) => {
  const bookings = await prisma.tripPassenger.findMany({
    include: {
      user: true,
      trip: true
    }
  });
  res.json(bookings);
});



// ------------------------------
// [Get] passengers for a trip
// return array of passengers for a trip
// ------------------------------
router.get('/trip/:tripId', async (req, res) => {
  const tripId = req.params.tripId;
  
  const passengers = await prisma.tripPassenger.findMany({
    where: {
      TripID: parseInt(tripId)
    },
    include: {
      user: true
    }
  });
  
  res.json(passengers);
});

// ------------------------------
// [Get] Trips for a Passenger
// return array of trips
// ------------------------------
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  const trips = await prisma.tripPassenger.findMany({
    where: {
      PassengerID: parseInt(userId)
    },
    include: {
      trip: {
        include: {
          car: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });
  
  res.json(trips);
});

// ------------------------------
// [Put] Update Booking Status
// return updated booking
// ------------------------------
router.put('/:tripId/:passengerId', async (req, res) => {
  const tripId = req.params.tripId;
  const passengerId = req.params.passengerId;
  const { Status } = req.body;
  
  const updatedBooking = await prisma.tripPassenger.update({
    where: {
      TripID_PassengerID: {
        TripID: parseInt(tripId),
        PassengerID: parseInt(passengerId)
      }
    },
    data: {
      Status
    }
  });
  
  res.json(updatedBooking);
});

// ------------------------------
// [Delete] Cancel Booking
// deletes the booking for that passenger on that trip
// return deleted booking
// ------------------------------
router.delete('/:tripId/:passengerId', async (req, res) => {
  const tripId = req.params.tripId;
  const passengerId = req.params.passengerId;
  
  const deletedBooking = await prisma.tripPassenger.delete({
    where: {
      TripID_PassengerID: {
        TripID: parseInt(tripId),
        PassengerID: parseInt(passengerId)
      }
    }
  });
  
  res.send(deletedBooking);
});





module.exports = router;