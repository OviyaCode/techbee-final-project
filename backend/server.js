const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const { errorHandler } = require('./middleware/errorMiddleware')

const app = express();

//read urlencoded and json data
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const corsOptions = {
  origin: 'http://127.0.0.1:3000',
  credentials: true, // Enable credentials (cookies) in cross-origin requests
};

app.use(cors(corsOptions));


//quiz-cat route
app.use('/api/quizcat', require('./routes/quizRoute'))
//user route
app.use('/api/users', require('./routes/userRoute'))
//questions route
app.use('/api/questions', require('./routes/questionRoute'))
//submission route
app.use('/api/submissions', require('./routes/submissionRoute'));
//result route
app.use('/api/results', require('./routes/resultRoute'));
//mail service route
// app.use('/api/forgot-password', require('./routes/mailRoute'));
//middleware
app.use(errorHandler)

//connect to db
connectDB();

//checking
app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

//start server
app.listen(port, () => {
    
    console.log(`Server started on port ${port}`);
})