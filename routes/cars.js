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
    include: {
      user: true
    }
  });
  res.json(cars);
});

// ------------------------------
// [Post] cars
// return created car 
// ------------------------------
router.post('/', async (req, res) => {
  const { Model, Brand, LicensePlate, Color, DriverLicenseImage, IdentityCardImage, DriverID } = req.body;
  
  // Check if car with this license plate already exists
  const checkCarExists = await prisma.car.findMany({
    where: {
      LicensePlate: LicensePlate
    }
  });
  
  if (checkCarExists.length > 0) {
    res.json({
      "status": "car with this license plate already exists"
    });
  } else {
    const newCar = await prisma.car.create({
      data: {
        Model,
        Brand,
        LicensePlate,
        Color,
        DriverLicenseImage,
        IdentityCardImage,
        DriverID
      }
    });
    res.json(newCar);
  }
});

// ------------------------------
// [Put] Cars
// return updated car object
// ------------------------------
router.put('/:id', async (req, res) => {
  let carId = req.params.id;
  let { Model, Brand, LicensePlate, Color, DriverLicenseImage, IdentityCardImage } = req.body;
  
  let updatedCar = await prisma.car.update({
    where: {
      ID: parseInt(carId)
    },
    data: {
      Model,
      Brand,
      LicensePlate,
      Color,
      DriverLicenseImage,
      IdentityCardImage
    }
  });
  
  res.json(updatedCar);
});

router.delete('/:id', async (req, res) => {
  const carId = req.params.id;
  
  const deletedCar = await prisma.car.delete({
    where: {
      ID: parseInt(carId)
    }
  });
  
  res.send(deletedCar);
});

module.exports = router;