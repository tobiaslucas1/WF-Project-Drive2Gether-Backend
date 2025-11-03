// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [Get] trips
// return array of trips
// ------------------------------
router.get('/', async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: {
      car: {
        include: {
          user: true
        }
      },
      tripPassenger: {
        include: {
          user: true
        }
      }
    }
  });
  res.json(trips);
});

// ------------------------------
// [Post] Trips
// return created trip 
// ------------------------------
router.post('/', async (req, res) => {
  const { DeparturePlace, DepartureTime, ArrivalPlace, Price, PaymentMethod, CarID } = req.body;
  
  const newTrip = await prisma.trip.create({
    data: {
      DeparturePlace,
      DepartureTime: new Date(DepartureTime),
      ArrivalPlace,
      Price,
      PaymentMethod,
      CarID
    }
  });
  
  res.json(newTrip);
});


// ------------------------------
// [Put] Trips
// return updated trip 
// ------------------------------
router.put('/:id', async (req, res) => {
  let tripId = req.params.id;
  let { DeparturePlace, DepartureTime, ArrivalPlace, Price, PaymentMethod } = req.body;
  
  let updatedTrip = await prisma.trip.update({
    where: {
      ID: parseInt(tripId)
    },
    data: {
      DeparturePlace,
      DepartureTime: new Date(DepartureTime),
      ArrivalPlace,
      Price,
      PaymentMethod
    }
  });
  
  res.json(updatedTrip);
});

// ------------------------------
// [Delete] trips
// return boolean (true or false)
//-------------------------------
router.delete('/:id', async (req, res) => {
  const tripId = req.params.id;
  
  const deletedTrip = await prisma.trip.delete({
    where: {
      ID: parseInt(tripId)
    }
  });
  
  res.send(deletedTrip);
});

// ------------------------------
// [Post] Book Passenger on Trip
// return created booking
// ------------------------------
router.post('/:tripId/:passengerId/book', async (req, res) => {
  const { tripId, passengerId } = req.params;
  const { Status } = req.body;

  const booking = await prisma.tripPassenger.create({
    data: {
      TripID: parseInt(tripId),
      PassengerID: parseInt(passengerId),
      Status: Status || 'Pending'
    }
  });

  res.json(booking);
});


module.exports = router;