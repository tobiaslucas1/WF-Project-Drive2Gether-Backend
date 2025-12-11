// ------------------------------
// Import Packages
// ------------------------------
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();
// ------------------------------
// [GET] /messages/:TripID
//  return array of messages for a specific trip
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
            // Dit is de 'if'-check die u vroeg om te gebruiken!
            return res.status(404).json({
                status: "Error",
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
      return  res.json({
        status: "Error",
        message: "Mandatory field missing"
      });
    }
    res.json(newMessage);
        

})


// ------------------------------
// [Delete] messages
// return boolean (true or false)
//-------------------------------


module.exports = router;