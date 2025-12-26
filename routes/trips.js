// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [GET] /trips/search
// search trips with filters
// ------------------------------
router.get('/search', async (req, res) => {

    const start = req.query.start; 
    const end = req.query.end;  
    const date = req.query.date;
    const time = req.query.time;

    let whereClause = {
      TripStatus: 'Scheduled'
    };

    if (start) {
      whereClause.StartLocation = { contains: start };
    }
    if (end) {
      whereClause.EndLocation = { contains: end };
    }

    if (date) {
      if (time) {
        // Search by date and Time +/- 30 min
        const targetDateTime = new Date(`${date}T${time}`);
        const minTime = new Date(targetDateTime.getTime() - 30 * 60000); 
        const maxTime = new Date(targetDateTime.getTime() + 30 * 60000); 
        whereClause.DepartureTime = {
          gte: minTime, // greater than or equal 
          lte: maxTime // less than or equal
        };
      } else {
        // Search by day
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(searchDate.getDate() + 1);
        
        whereClause.DepartureTime = {
          gte: searchDate,
          lt: nextDay
        };
      }
    }

    let trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        user: { 
          select: { 
            FirstName: true, 
            LastName: true, 
            ProfilePicture: true 
          } 
        },
        car: { 
          select: { 
            Brand: true,
            Model: true,
            Color: true 
          }
        },
      },
      orderBy: { DepartureTime: 'asc' }
    });

    res.json(trips);
});

// ------------------------------
// [Get] trips
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
// [Get] /trips/:id
// Details of a specific trip
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
          Email: true,
          ProfilePicture: true 
        } 
      },
      car: true
    }
  });

  if (!trip) 
    {
      return res.status(404).json({ 
         message: `Trip with ID ${TripID} not found.`
         });
    } 

  res.json(trip);
});

// ------------------------------
// [Post] Trips
// ------------------------------
router.post('/', async (req, res) => {
  const DriverID = req.body.DriverID;
  const CarID = req.body.CarID;
  const StartLocation = req.body.StartLocation;
  const EndLocation = req.body.EndLocation;
  const DepartureTime = req.body.DepartureTime;
  const Price = req.body.Price;
  const SeatsOffered = req.body.SeatsOffered;
  const SeatsBooked = req.body.SeatsBooked;

  const newTrip = await prisma.trip.create({
    data: {
      DriverID: parseInt(DriverID),
      CarID: parseInt(CarID),
      StartLocation,
      EndLocation,
      DepartureTime: new Date(DepartureTime),
      Price: parseFloat(Price),
      SeatsOffered: parseInt(SeatsOffered),
      SeatsBooked: parseInt(SeatsBooked || 0),
      TripStatus: "Scheduled",
    }
  });
  res.json(newTrip);
});

// ------------------------------
// [Put] Trips
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
  const SeatsBooked = req.body.SeatsBooked;
  const TripStatus = req.body.TripStatus;


  const dataToUpdate = {};
  //Not to lose data
  if (DriverID) dataToUpdate.DriverID = parseInt(DriverID);
  if (CarID) dataToUpdate.CarID = parseInt(CarID);
  if (StartLocation) dataToUpdate.StartLocation = StartLocation;
  if (EndLocation) dataToUpdate.EndLocation = EndLocation;
  if (DepartureTime) dataToUpdate.DepartureTime = new Date(DepartureTime);
  if (Price) dataToUpdate.Price = parseFloat(Price);
  if (SeatsOffered) dataToUpdate.SeatsOffered = parseInt(SeatsOffered);
  if (SeatsBooked !== undefined) dataToUpdate.SeatsBooked = parseInt(SeatsBooked);
  if (TripStatus) dataToUpdate.TripStatus = TripStatus;
    
  const updatedTrip = await prisma.trip.update({
      where: { TripID: TripID },
      data: dataToUpdate,
    });
  res.json(updatedTrip);
  
});

// ------------------------------
// [Delete] trips
// ------------------------------
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