const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan')
const cors = require("cors")
const colors = require("colors");
const PORT = process.env.PORT || 8080;
const connectDB=require('./config/db')

// ********************
dotenv.config();
connectDB();
// *********************//
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))


// test routes
app.use('/api/v1/test', require("./Routes/testRoutes"));
app.use('/api/v1/auth', require('./Routes/authRoutes')); //login and register and current-user


// create-inventory
app.use('/api/v1/inventory', require("./Routes/inventoryRoutes"));


// always in bottom 
app.listen(PORT, () => {
    console.log('server is running')
})