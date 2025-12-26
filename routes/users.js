// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');  

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      const userId = req.params.id;
      const ext = path.extname(file.originalname);
      cb(null, `user-${userId}-${Date.now()}${ext}`); // Name of Picture user-ID-Date.(jpg/img/png)
  }
});

const upload = multer({ storage: storage });

// ------------------------------
// [Get] users/:id
// ------------------------------
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: { UserID: parseInt(id) }
  });
  if (!user) 
  {
    return res.status(404).json({ message: "Gebruiker niet gevonden" });
  }
  res.json(user);
});

// ------------------------------
// [Get] users (All)
// ------------------------------
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { 
      UserID: true, 
      FirstName: true, 
      LastName: true, 
      Email: true,
      DateOfBirth: true, 
      PhoneNumber: true, 
      Address: true, 
      CreatedAt: true,
      ProfilePicture: true, 
      car: true 
    }
  });
  res.json(users);
});

// ------------------------------
// [Post] users (Register)
// ------------------------------
router.post('/', async (req, res) => {
  const FirstName = req.body.FirstName;
  const LastName = req.body.LastName;
  const DateOfBirth = req.body.DateOfBirth; 
  const PhoneNumber = req.body.PhoneNumber;
  const Email = req.body.Email;
  const Address = req.body.Address;
  const PasswordHash = req.body.PasswordHash;
  const Car = req.body.Car;

  const checkUserExists = await prisma.user.findUnique({ where: { Email: Email } });
  if (checkUserExists)
  {
    return res.status(400).json({ "status": "User with this email already exists" });
  }
  
  const newUser = await prisma.user.create({
    data: {
      FirstName, 
      LastName, 
      DateOfBirth: new Date(DateOfBirth),
      PhoneNumber, 
      Email, 
      Address, 
      PasswordHash,
      car: Car ? {
        create: {
          Brand: Car.Brand, 
          Model: Car.Model, 
          LicensePlate: Car.LicensePlate,
          Seats: parseInt(Car.Seats), 
          Color: Car.Color, 
          isVerified: false
        }
      } : undefined 
    },
    include: { car: true }
  });
  res.json(newUser);
  
});

// ------------------------------
// [Post] /users/:id/upload-photo 
// ------------------------------
// Save the picture in the map /uploads
router.post('/:id/upload-photo', upload.single('profileImage'), async (req, res) => { 
    const userId = parseInt(req.params.id);

    if (!req.file) {
      return res.status(400).json({ message: "Geen bestand geselecteerd" });
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`; 

    
    const updatedUser = await prisma.user.update({
      where: { UserID: userId },
      data: { ProfilePicture: imageUrl }
    })
    res.json({
      message: "Foto succesvol opgeslagen",
      user: updatedUser
    });
   
});

// ------------------------------
// [Put] users (Update)
// ------------------------------
router.put('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const PhoneNumber = req.body.PhoneNumber;
  const Email = req.body.Email;
  const Password = req.body.Password;
  
  let dataToUpdate = { 
    PhoneNumber, 
    Email 
  };

  if (Password) dataToUpdate.PasswordHash = Password;
  
  const updatedUser = await prisma.user.update({
    where: { UserID: userId },
    data: dataToUpdate,
  });
  res.json(updatedUser);
 
});

// ------------------------------
// [Delete] users 
// ------------------------------
router.delete('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  await prisma.passengerbooking.deleteMany({ where: { PassengerID: userId } });
  await prisma.car.deleteMany({ where: { OwnerID: userId } });
  const deletedUser = await prisma.user.delete({
    where: { UserID: userId }
  });
  
  res.json({ message: "Account succesvol verwijderd", user: deletedUser });


});

// ------------------------------
// [Post] Login
// ------------------------------
router.post('/login', async (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;
  const user = await prisma.user.findUnique({ where: { Email: Email } });
  
  if (!Email || !Password) return res.status(400).json({ status: "Vul e-mail en wachtwoord in" });
  if (!user || user.PasswordHash !== Password) return res.status(401).json({ status: "E-mail of wachtwoord onjuist" });
  
  res.json({
    status: "success",
    user: {
      UserID: user.UserID, 
      FirstName: user.FirstName, 
      LastName: user.LastName,
      Email: user.Email, 
      Address: user.Address, 
      ProfilePicture: user.ProfilePicture
    }
  });
});

module.exports = router;