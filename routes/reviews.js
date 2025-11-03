// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// ------------------------------
// [Get] reviews
// return array of reviews
// ------------------------------

// ------------------------------
// [Post] reviews
// return id  (id kan ook 0 zijn -> niet gelukt)
// ------------------------------

// ------------------------------
// [Put] reviews
// return 
// ------------------------------

// ------------------------------
// [Delete] reviews
// return boolean (true or false)
//-------------------------------


module.exports = router;