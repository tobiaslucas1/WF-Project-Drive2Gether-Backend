// PUT NEEDS TO BE FIXED 
// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [GET] /trips/search
// Zoek trips op basis van start en eind locatie
// ------------------------------
router.get('/search', async (req, res) => {
    const { start, end } = req.query;

    try {
        const trips = await prisma.trip.findMany({
            where: {
                TripStatus: 'Scheduled',
                // contains = delen vd naam
                ...(start && {
                    StartLocation: {
                        contains: start
                    }
                }),
                // Filter op eindlocatie 
                ...(end && {
                    EndLocation: {
                        contains: end
                    }
                })
            },
            include: {
                user: { 
                    select: { FirstName: true, LastName: true }
                },
                car: {
                    select: { Brand: true, Model: true, Color: true }
                }
            },
            orderBy: {
                DepartureTime: 'asc' 
            }
        });

        res.json(trips);

    } catch (error) {
        console.error("Fout bij zoeken trips:", error);
        res.status(500).json({ status: "Server error" });
    }
});

// ------------------------------
// [Get] trips
// return array of trips
// ------------------------------
router.get('/', async (req, res) => {
  const trips = await prisma.trip.findMany({
    select: {
      TripID: true,
      DriverID: true,
      CarID: true,
      StartLocation: true,
      EndLocation: true,
      DepartureTime: true,
      Price: true,
      SeatsBooked: true,
      SeatsOffered: true,
      TripStatus: true,
    }
  })
  res.json(trips);
})


// ------------------------------
// [Get]  /trips/:id
// return details of a specific trip
// ------------------------------
router.get('/:id', async (req, res) => {
  const TripID = parseInt(req.params.id);

  const trip = await prisma.trip.findUnique({
    where: {TripID},
    include: {
        user: { 
            select: { 
                FirstName: true, 
                LastName: true,
                PhoneNumber: true, 
                Email: true     
            } 
        },
        car: true
    }
    
  });

  if (!trip) 
    {
      return res.json({ 
        status: "Error",
         message: `Trip with ID ${TripID} not found.`
         });
    } 

  res.json(trip);
});


// ------------------------------
// [Post] Trips
// return created trip 
// Payment method still needs to be added 
// ------------------------------
router.post('/', async (req, res) => {
  const DriverID = req.body.DriverID;
  const CarID = req.body.CarID;
  const StartLocation = req.body.StartLocation;
  const EndLocation = req.body.EndLocation;
  const DepartureTime = req.body.DepartureTime;
  const Price = req.body.Price;
  const SeatsOffered = req.body.SeatsOffered;
  const SeatsBooked = req.body.SeatsBooked || 0; // default is 0 
  const TripStatus = req.body.TripStatus;


  const newTrip = await prisma.trip.create({
    data: {
      DriverID: parseInt(DriverID),
      CarID: parseInt(CarID),
      StartLocation,
      EndLocation,
      DepartureTime: new Date(DepartureTime),
      Price: parseFloat(Price),
      SeatsOffered: parseInt(SeatsOffered),
      SeatsBooked: parseInt(SeatsBooked),
      TripStatus: "Scheduled",
    }
  });
  
  res.json(newTrip);
});


// ------------------------------
// [Put] Trips
// Update trip
// DOESNT WORK !!!!!!!!!! 
// I think Because of Foreign Keys
// ------------------------------
router.put('/:id', async (req, res) => {
  const TripID = parseInt(req.params.id);

  const DriverID = req.body.DriverID;
  const CarID = req.body.CarID;
  const StartLocation = req.body.StartLocation;
  const EndLocation = req.body.EndLocation;
  const DepartureTime = req.body.DepartureTime;
  const Price = req.body.Price;
  const SeatsOffered = req.body.SeatsOffered;
  const SeatsBooked = req.body.SeatsBooked || 0; // default is 0 
  const TripStatus = req.body.TripStatus;  

  const updatedTrip = await prisma.trip.update({
    where: {
      TripID: TripID
    },
    data: {
      DriverID: parseInt(DriverID),
      CarID: parseInt(CarID),
      StartLocation,
      EndLocation,
      DepartureTime: new Date(DepartureTime),
      Price: parseFloat(Price),
      SeatsOffered: parseInt(SeatsOffered),
      SeatsBooked: parseInt(SeatsBooked),
      TripStatus,
    },
  });
  
  res.json(updatedTrip);
});

// ------------------------------
// [Delete] trips
// Deletes/Cancelles a trip
//-------------------------------
router.delete('/:id', async (req, res) => {
  const TripID = req.params.id;
  
  const deletedTrip = await prisma.trip.delete({
    where: {
      TripID: parseInt(TripID)
    }
  });
  
  res.send(deletedTrip);
});




module.exports = router;