// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ------------------------------
// [GET] /reviews
// return array of reviews
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
              select: { 
                FirstName: true,
                LastName: true 
            }
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
// Create a new review
// ------------------------------
router.post('/', async (req, res) => {
    const ReviewerID = req.body.ReviewerID;
    const ReviewedID = req.body.ReviewedID;
    const Rating = req.body.Rating;
    const Comment = req.body.Comment;
    const TripID = req.body.TripID;
    const ReviewType = req.body.ReviewType;

  if (!ReviewerID || !ReviewedID || !Rating || !TripID) {
      return res.status(400).json({
          message: "Vul alle verplichte velden in (ReviewerID, ReviewedID, Rating, TripID).",
      });
  }
  const trip = await prisma.trip.findUnique({
  where: { TripID: parseInt(TripID) }
  });
  if (!trip) {
      return res.status(404).json({
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