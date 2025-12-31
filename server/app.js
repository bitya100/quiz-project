const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// ייבוא הראוטרים
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const quizRoutes = require('./routes/quizRoutes'); // הוספנו פה!

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());   
app.use(cors());           
app.use(morgan('dev'));    
app.use(express.static('public')); 

// Routes - חשוב שהם יהיו לפני ה-Error Handlers
app.use('/api/users', userRouter);     
app.use('/api/products', productRouter); 
app.use('/api/orders', orderRouter);     
app.use('/api/quizzes', quizRoutes); // הנתיב של החידונים הועבר לפה

// Error Handlers
app.use((req, res, next) => {
    const error = new Error('הנתיב המבוקש לא נמצא');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || 'שגיאת שרת פנימית'
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});