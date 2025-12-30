const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors'); // הוגדר פה - פעם אחת בלבד!
const connectDB = require('./config/db');

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());   
app.use(cors());           // הופעל פה - וזה מספיק!
app.use(morgan('dev'));    
app.use(express.static('public')); 

// Routes
app.use('/api/users', userRouter);     
app.use('/api/products', productRouter); 
app.use('/api/orders', orderRouter);     

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