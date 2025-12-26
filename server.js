// ------------------------------
// imports 
// ------------------------------

const  express = require ('express')
const  cors = require ('cors')
const path = require('path'); 
const app = express();

app.use(express.json());
app.use(cors());

console.log("Api is running!")
// ------------------------------
// routes (endpoints)
// ------------------------------
const bookingsRouter = require('./routes/booking');
const carsRouter = require('./routes/cars');
const messagesRouter = require('./routes/messages');
const reviewsRouter = require('./routes/reviews');
const tripsRouter = require('./routes/trips');
const userRouter = require('./routes/users');

// ------------------------------
// use routes
// ------------------------------
app.use('/bookings', bookingsRouter);
app.use('/cars', carsRouter);
app.use('/messages', messagesRouter);
app.use('/reviews', reviewsRouter);
app.use('/trips', tripsRouter);
app.use('/users', userRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// __dirname:  Directory Name 
// express.static all files work jpg, png , pdf , ...
app.listen(3000)
