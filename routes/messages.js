// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();

// ------------------------------
// [GET] /messages/trip/:TripID
//  get messages for a specific trip
// ------------------------------
router.get('/trip/:TripID', async (req, res) => {
  const TripID = parseInt(req.params.TripID);
  
  const messages = await prisma.message.findMany({
    where: { TripID: TripID },
    select: {
        MessageID: true,
        SenderID: true,
        ReceiverID: true,
        Content: true,
        IsRead: true,
        TripID: true,
        user_message_SenderIDTouser: {
            select: {
                FirstName: true,
                LastName: true
            }
        }
    },
    orderBy: {
        MessageID: 'asc' 
    }
  });
  
  res.json(messages);
});

// --------------------------------------------------------
// [GET] messages
// return array of messages
// --------------------------------------------------------
router.get('/', async (req, res) => {
  const messages = await prisma.message.findMany({
    select: {
        MessageID: true,
        SenderID: true,
        ReceiverID: true,
        Content: true,
        IsRead: true,
        TripID: true,
    }
  });
  res.json(messages);
});


// ------------------------------
// [Post] messages
// return created message
// ------------------------------
router.post('/', async (req, res) => {
  
  const SenderID = req.body.SenderID;
  const ReceiverID =  req.body.ReceiverID;
  const TripID = req.body.TripID;
  const Content = req.body.Content;
  const senderInt = parseInt(SenderID);
  const receiverInt = parseInt(ReceiverID);
  const tripInt = parseInt(TripID);

  const trip = await prisma.trip.findUnique({
            where: { TripID: TripID }
        });
        
  if (!trip) {
      return res.status(400).json({
          message: `Trip with ID ${TripID} not found.`,
      });
  }

  const newMessage = await prisma.message.create({
      data: {
          SenderID: senderInt,
          ReceiverID: receiverInt,
          Content: Content,
          TripID: tripInt,
          IsRead: false,
        }
        
    });

    
    
    if(!SenderID || !ReceiverID || !TripID || !Content){
      return res.status(400).json({
        message: "Mandatory field missing"
      });
    }
    res.json(newMessage);
        

})




module.exports = router;