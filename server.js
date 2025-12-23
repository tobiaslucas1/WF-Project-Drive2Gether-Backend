// import from node_modules
const  express = require ('express')
const  cors = require ('cors')

// functie.express() in een variabele zetten
//daarna extra settings toevoegen
const app = express();

app.use(express.json());
app.use(cors());

console.log("Api is running!")

//endpoints
const carsRouter = require('./routes/cars');
const messagesRouter = require('./routes/messages');
const reviewsRouter = require('./routes/reviews');
const tripsRouter = require('./routes/trips');
const userRouter = require('./routes/users');

app.use('/cars', carsRouter);
app.use('/messages', messagesRouter);
app.use('/reviews', reviewsRouter);
app.use('/trips', tripsRouter);
app.use('/users', userRouter);



app.listen(3000)
