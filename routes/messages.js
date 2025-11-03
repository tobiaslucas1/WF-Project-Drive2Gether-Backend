// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();
// ------------------------------
// [Get] messages
// return array of reviews
// ------------------------------

// ------------------------------
// [Post] messages
// return id  (id kan ook 0 zijn -> niet gelukt)
// ------------------------------

// ------------------------------
// [Delete] messages
// return boolean (true or false)
//-------------------------------


module.exports = router;