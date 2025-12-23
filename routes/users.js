// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [Get] users
// return array of users
// ------------------------------
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { // never return password
      UserID: true,
      FirstName: true,
      LastName: true,
      Email: true,
      DateOfBirth: true,
      PhoneNumber: true,
      Address: true,
      CreatedAt: true,
    }
  });
  res.json(users);
});


// ------------------------------
// [Post] users 
// Register a new user
// ------------------------------
router.post('/', async (req, res) => {
  
  const FirstName = req.body.FirstName;
  const LastName = req.body.LastName;
  const DateOfBirth = req.body.DateOfBirth;
  const PasswordHash = req.body.PasswordHash;
  const PhoneNumber = req.body.PhoneNumber;
  const Address = req.body.Address;
  const Email = req.body.Email;

  // Check if user with this email already exists
  const checkUserExists = await prisma.user.findMany({
    where: {
      Email: Email
    }
  });
  

  if (checkUserExists.length > 0) {
    res.json({
      "status": "user with this email already exists"
    });
  } else {
    const newUser = await prisma.user.create({
      data: {
        FirstName,
        LastName,
        DateOfBirth: new Date(DateOfBirth),
        PhoneNumber,
        Email,
        Address,
        PasswordHash
      },
      select:{ // Never Returns the Password
        UserID: true,
        FirstName: true,
        Email:true,
        CreatedAt:true,
      }
    });
    res.json(newUser);
  }
});


// ------------------------------
// [Put] users 
// ------------------------------
router.put('/:id', async (req, res) => {
  const userId = req.params.id;

  const FirstName = req.body.FirstName;
  const LastName = req.body.LastName;
  const DateOfBirth = req.body.DateOfBirth;
  const PasswordHash = req.body.PasswordHash;
  const PhoneNumber = req.body.PhoneNumber;
  const Address = req.body.Address;
  const Email = req.body.Email;
  
  const updatedUser = await prisma.user.update({
    where: {
      UserID: parseInt(userId)
    },
    data: {
      FirstName,
      LastName,
      DateOfBirth: new Date(DateOfBirth),
      PhoneNumber,
      Email,
      Address
    },
  });
  
  res.json(updatedUser);
});

// ------------------------------
// [Delete] users
// ------------------------------
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  
  const deletedUser = await prisma.user.delete({
    where: {
      UserID: parseInt(userId)
    }
  });
  
  res.send(deletedUser);
});


// -----------------------------------
// LOGIN ROUTE 
// URL: POST /users/login
// -----------------------------------
router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  
  // search user
  const user = await prisma.user.findUnique({
    where: { Email: Email }
  });
  
  // Check data 
  if (!Email || !Password) {
    return res.status(400).json({ status: "Vul e-mail en wachtwoord in" });
  }
  if (!user || user.PasswordHash !== Password) {
    return res.status(401).json({ status: "E-mail of wachtwoord onjuist" });
  }
  
  // login
  res.json({
    status: "success",
    user: {
      UserID: user.UserID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      Address: user.Address
    }
  });
  
});


module.exports = router;