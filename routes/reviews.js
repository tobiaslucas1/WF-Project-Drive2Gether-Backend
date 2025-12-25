// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ------------------------------
// [GET] /reviews
// Haal alle reviews op
// ------------------------------
router.get('/', async (req, res) => {
  const reviews = await prisma.review.findMany();
  res.json(reviews);
   
});

// ------------------------------
// [GET] /reviews/user/:userId
// get reviews for a specific user and sort by newest
// ------------------------------
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  const reviews = await prisma.review.findMany({
      where: { ReviewedID: userId },
      include: {
          user_review_ReviewerIDTouser: {
              select: { FirstName: true, LastName: true }
          }
      },
      orderBy: {
          ReviewID: 'desc'
      }
  });
  res.json(reviews);
    
});

// ------------------------------
// [POST] /reviews
// Maak een nieuwe review aan
// ------------------------------
router.post('/', async (req, res) => {
  const { ReviewerID, ReviewedID, Rating, Comment, TripID, ReviewType } = req.body;
  if (!ReviewerID || !ReviewedID || !Rating || !TripID) {
      return res.status(400).json({
          status: "Error",
          message: "Vul alle verplichte velden in (ReviewerID, ReviewedID, Rating, TripID).",
      });
  }
  const trip = await prisma.trip.findUnique({
  where: { TripID: parseInt(TripID) }
  });
  if (!trip) {
      return res.status(404).json({
          status: "Error",
          message: `Trip met ID ${TripID} niet gevonden.`,
      });
  }
  const newReview = await prisma.review.create({
      data: {
          ReviewerID: parseInt(ReviewerID),
          ReviewedID: parseInt(ReviewedID),
          Rating: parseInt(Rating),
          Comment: Comment || "",
          TripID: parseInt(TripID),
          ReviewType: ReviewType || 'Driver' 
      }
  });
  res.json(newReview);
  
});

module.exports = router;