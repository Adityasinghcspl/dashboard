const express = require('express');
const app = express()
const cors = require('cors');
const dotenv = require('dotenv').config()
const employeeRoutes = require('./routes/employeeRoutes')
const connectDb = require('./model/MongodbConnection')
const {errorHandler} = require('./middleware/errorHandler')

const port = process.env.PORT || 3000

app.use(express.json())// this is a middle ware to the pass the data client side to server side
app.use(cors());
app.use("/", employeeRoutes);

connectDb()
app.use(errorHandler)
 
app.listen(port,()=>{
    console.log(`Server is running port ${port}`)
})