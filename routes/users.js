// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [Get] users/:id
// ------------------------------
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { UserID: parseInt(id) }
    });
    if (!user) return res.status(404).json({ message: "Gebruiker niet gevonden" });
    res.json(user);
});

// ------------------------------
// [Get] users (All)
// ------------------------------
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { 
      UserID: true, FirstName: true, LastName: true, Email: true,
      DateOfBirth: true, PhoneNumber: true, Address: true, CreatedAt: true,
      car: true 
    }
  });
  res.json(users);
});

// ------------------------------
// [Post] users (Register)
// ------------------------------
router.post('/', async (req, res) => {
  const { FirstName, LastName, DateOfBirth, PasswordHash, PhoneNumber, Address, Email, Car } = req.body;

  const checkUserExists = await prisma.user.findUnique({ where: { Email: Email } });
  if (checkUserExists) return res.status(400).json({ "status": "User with this email already exists" });

  try {
    const newUser = await prisma.user.create({
      data: {
        FirstName, LastName, DateOfBirth: new Date(DateOfBirth),
        PhoneNumber, Email, Address, PasswordHash,
        car: Car ? {
          create: {
            Brand: Car.Brand, Model: Car.Model, LicensePlate: Car.LicensePlate,
            Seats: parseInt(Car.Seats), Color: Car.Color, isVerified: false
          }
        } : undefined 
      },
      include: { car: true }
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ status: "Er ging iets mis bij het opslaan.", error: error.message });
  }
});

// ------------------------------
// [Put] users (Update)
// ------------------------------
router.put('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { PhoneNumber, Email, Password } = req.body;
  
  // Let op: We updaten hier NIET FirstName, LastName of Address omdat jij dat niet wilt.
  let dataToUpdate = { PhoneNumber, Email };

  if (Password) dataToUpdate.PasswordHash = Password;
  
  try {
      const updatedUser = await prisma.user.update({
        where: { UserID: userId },
        data: dataToUpdate,
      });
      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ status: "Error updating user", error: error.message });
  }
});

// ------------------------------
// [Delete] users (Account verwijderen)
// ------------------------------
router.delete('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    // 1. Verwijder eerst gekoppelde data om database fouten te voorkomen
    
    // Verwijder boekingen van deze persoon
    await prisma.passengerbooking.deleteMany({ where: { PassengerID: userId } });
    
    // Verwijder auto's van deze persoon
    await prisma.car.deleteMany({ where: { OwnerID: userId } });

    // 2. Verwijder nu de gebruiker zelf
    const deletedUser = await prisma.user.delete({
      where: { UserID: userId }
    });
    
    res.json({ message: "Account succesvol verwijderd", user: deletedUser });

  } catch (error) {
    console.error("Delete error:", error);
    // Als het nog steeds mislukt (bijv. omdat ze nog driver zijn van een actieve rit)
    res.status(500).json({ 
        message: "Kon account niet verwijderen. Zorg dat je geen openstaande ritten hebt als chauffeur.",
        error: error.message 
    });
  }
});

// ------------------------------
// [Post] Login
// ------------------------------
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  const user = await prisma.user.findUnique({ where: { Email: Email } });
  
  if (!Email || !Password) return res.status(400).json({ status: "Vul e-mail en wachtwoord in" });
  if (!user || user.PasswordHash !== Password) return res.status(401).json({ status: "E-mail of wachtwoord onjuist" });
  
  res.json({
    status: "success",
    user: {
      UserID: user.UserID, FirstName: user.FirstName, LastName: user.LastName,
      Email: user.Email, Address: user.Address
    }
  });
});

module.exports = router;