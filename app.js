require('dotenv').config();
const express = require('express')
const app = express()
// app.get('/student', (req, res) => {
//     //console.log('student ka get request aaya hai')
//     res.status(200).json({
//         student :[
//     { id: 1, name: "Rahul", admissionNo: 101 },
//     { id: 2, name: "Amit", admissionNo: 102 },
//     { id: 3, name: "Neha", admissionNo: 103 },
//     { id: 4, name: "Priya", admissionNo: 104 },
//     { id: 5, name: "Rohit", admissionNo: 105 },
//     { id: 6, name: "Anjali", admissionNo: 106 },
//     { id: 7, name: "Suresh", admissionNo: 107 }]
//         })

//     })
const contactRoute = require('./Routes/contact')
const userRoute = require('./Routes/user')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload')

// mongoose.connect('mongodb+srv://balram:balram1@sbs.ifuxome.mongodb.net/?appName=SBS')
// .then(() => {
//     console.log('MongoDB connected successfully with database')
// })
// .catch(err => {
    
//     console.log('something is wrong')
//     console.log(err)
// })


const connectWithDatabase = async()=>{
    try{
        await  mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB connected successfully with database')
    } catch (err) {
        console.log('something is wrong')
        console.log(err)

    }
}
connectWithDatabase()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/user',userRoute)
app.use('/contact',contactRoute)

module.exports = app