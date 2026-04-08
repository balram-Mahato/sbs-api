const express = require('express')
const Router = express.Router()

//signup api
Router.post('/signup',(req,res)=>{
    res.status(200).json({
        msg : 'Signup response'
    })
})

//login api
Router.post('/login',(req,res)=>{
    res.status(200).json({
        msg : 'Login response'
    })
})

module.exports = Router