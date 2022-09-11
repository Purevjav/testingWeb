const express = require('express');
// const mysql = require('mysql')
// const db = require('./models1');
const errorHandler = require("./middleware/error");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
var cors = require('cors')
app.use(cors())

const fileUpload = require('express-fileupload');
app.use(fileUpload());
var Color = require('colors');


const dotenv = require('dotenv');

//route оруулж ирэх
const myRouter = require("./routes/index.js");

dotenv.config({path:'./config/config.env'})
app.use("/data", myRouter);

//аппын тохиргоог ачааллах процесс руу ачааллах
process.env
app.use(bodyParser.urlencoded({ extended:true }))

app.use(bodyParser.json())
app.use(errorHandler);

app.use("/public",express.static("./public"));

const connectDB = require('./config/db');
connectDB();

const server = app.listen(process.env.PORT, function(){
  console.log(`Backend ${process.env.PORT} порт дээр ажиллаа`.rainbow);
 
})

process.on('unhandledRejection', (err, promise) =>{
  console.log(`адпаа гарлаа app.js -ын process.on-д ${err.message}`);
  server.close(() =>{
    process.exit(0);
  }) 
})