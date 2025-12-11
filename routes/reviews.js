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
router.get('/', async (req, res) => {
  const reviews = await prisma.review.findMany({
    select: {
        ReviewID: true,
        ReviewerID: true,
        ReviewedID: true,
        Rating: true,
        Comment: true,
    }
  });
  res.json(reviews);
});

// ------------------------------
// [Get] reviews
// return reviews for a specific user
// ------------------------------

router.get('/user/:ReviewedID', async (req, res) => {
    const ReviewedID = parseInt(req.params.ReviewedID);
    const reviews = await prisma.review.findMany({
        where: { ReviewedID: ReviewedID },
        select: {
            ReviewID: true,
            ReviewerID: true,
            ReviewedID: true,
            Rating: true,
            Comment: true,
        }
    });
    res.json(reviews);
}
);


// ------------------------------
// [Post] reviews
// return created review
// ------------------------------
router.post('/', async (req, res) => {
  const ReviewerID = req.body.ReviewerID;
  const ReviewedUserID =  req.body.ReviewedUserID;
  const Rating = req.body.Rating;
  const Comment = req.body.Comment;
  const TripID = req.body.TripID;

  // Convert to integers
  const reviewerInt = parseInt(ReviewerID);
  const reviewedInt = parseInt(ReviewedUserID);
  const ratingInt = parseInt(Rating);
  const tripIDInt = parseInt(TripID);

  const trip = await prisma.trip.findUnique({
            where: { TripID: TripID }
        });


    if (!trip) {
        return res.json({
            status: "Error",
            message: `Trip with ID ${TripID} not found.`,
        });
    }   
    const newReview = await prisma.review.create({
      data: {
        ReviewerID: reviewerInt,
        ReviewedID: ReviewedUserID,
        Rating: ratingInt,
        Comment: Comment,
        TripID: tripIDInt,
      }
    });
    
    if(!ReviewerID || !ReviewedUserID || !Rating || !TripID){
        return  res.json({
            status: "Error",
            message: "Missing required fields.",
        });
    }
    
  

  res.json(newReview);
});


module.exports = router;