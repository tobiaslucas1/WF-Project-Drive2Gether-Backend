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
  const users = await prisma.user.findMany();
  res.json(users);
});

// ------------------------------
// [Post] users 
// ------------------------------
router.post('/', async (req, res) => {
  const { FirstName, LastName, Age, PhoneNumber, Email, Address, Picture, Password, Role } = req.body;
  
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
        Age,
        PhoneNumber,
        Email,
        Address,
        Picture,
        Password,
        Role
      }
    });
    res.json(newUser);
  }
});

// ------------------------------
// [Put] users 
// ------------------------------
router.put('/:id', async (req, res) => {
  let userId = req.params.id;
  let { FirstName, LastName, Age, PhoneNumber, Email, Address, Picture, Password, Role } = req.body;
  
  let updatedUser = await prisma.user.update({
    where: {
      ID: parseInt(userId)
    },
    data: {
      FirstName,
      LastName,
      Age,
      PhoneNumber,
      Email,
      Address,
      Picture,
      Password,
      Role
    }
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
      ID: parseInt(userId)
    }
  });
  
  res.send(deletedUser);
});


module.exports = router;