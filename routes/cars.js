// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();


// ------------------------------
// [Get] cars
// return array of cars 
// ------------------------------
router.get('/', async (req, res) => {
  const cars = await prisma.car.findMany({
    select: {
      CarID: true,
      Model: true,
      Brand: true,
      LicensePlate: true,
      Color: true,
      Seats: true,
      OwnerID: true
    }
  });
  res.json(cars);
});

// ------------------------------
// [Post] cars
// return created car 
// ------------------------------
router.post('/', async (req, res) => {
  
  const Model = req.body.Model;
  const Brand = req.body.Brand;
  const LicensePlate = req.body.LicensePlate;
  const Color = req.body.Color;
  const Seats = req.body.Seats;
  const OwnerID = req.body.OwnerID;

  const checkCarExists = await prisma.car.findMany({
    where: {
      LicensePlate: LicensePlate
    }
  });
  
  if (checkCarExists.length > 0) {
    return res.status(400).json({
      message: "Een auto met dit kenteken bestaat al."
    });
  } else {
    const newCar = await prisma.car.create({
      data: {
        Model,
        Brand,
        LicensePlate,
        Seats: parseInt(Seats), 
        Color,
        OwnerID: parseInt(OwnerID),
      }
    });
    res.json(newCar);
  }
});

// ------------------------------
// [Put] Cars
// return updated car 
// ------------------------------
router.put('/:id', async (req, res) => {
  const CarID = req.params.id;
  const Model = req.body.Model;
  const Brand = req.body.Brand;
  const LicensePlate = req.body.LicensePlate;
  const Color = req.body.Color;
  const Seats = req.body.Seats;
  
  const updatedCar = await prisma.car.update({
    where: {
      CarID: parseInt(CarID)
    },
    data: {
      Model,
      Brand,
      LicensePlate,
      Color,
      Seats,
      }
  });
  
  res.json(updatedCar);
});


// --------------------------------------------------------
// [DELETE] /cars/:id
// Delets a car.
// --------------------------------------------------------
router.delete('/:id', async (req, res) => {
  const carId = req.params.id;
  
  const deletedCar = await prisma.car.delete({
    where: {
      CarID: parseInt(carId)
    }
  });
  
  res.send(deletedCar);
});

module.exports = router;