const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')

//signup api
// Router.post('/addContact',(req,res)=>{
//     res.status(200).json({
//         msg : 'addContact response'
//     })
// })

// //login api
// Router.get('/getcontact',(req,res)=>{
//     res.status(200).json({
//         msg : 'Edit contact response'
//     })

// Router.post('/add-contact',(req,res)=>{
//    //console.log(req.body)
// const newContact = new Contact({
//     fullName:req.body.name,
//     email:req.body.person_email,
//     phone:req.body.person_phone,
//     address:req.body.add
// })

// newContact.save()
// .then((result)=>{
//     console.log('data saved')
//     res.status(200).json({
//         msg:'data saved'
//     })
// })
// .catch((err)=>{
//     console.log(err)
//     res.status(500).json({
//         error:'something is wrong'
//     })
// })

Router.post('/add-contact',(req,res)=>{
//    console.log(req.body)
const newContact = new Contact({
    fullName:req.body.fullName,
    email:req.body.person_email,
    phone:req.body.person_phone,
    address:req.body.address,
    gender:req.body.gender
})

newContact.save()
.then((result)=>{
    console.log('data saved')
    res.status(200).json({
        msg:'data saved'
    })
})
.catch((err)=>{
    console.log(err)
    res.status(500).json({
        error:'something is wrong'
    })
})

})

//get all contacts
Router.get('/all-contact',async (req,res)=>{
    try {
        const allcontacts = await Contact.find()
        res.status(200).json({
            contacts:allcontacts
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

// get contact by id route
Router.get('/contactById/:id',async(req, res) => {
    try{
        const id= req.params.id
        const data = await Contact.findById(id).select("_id fullName email Phone address gender")
        res.status(200).json({
            contact:data
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
    // console.log(req.params.id)
})

//get contact by gender
Router.get('/gender/:g',async(req,res)=>{
    try{
        const contact = await Contact.find({gender:req.params.g})
        res.status(200).json({
            contact:contact
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

//delete api
Router.delete('/:id',async(req,res)=>{
    try {
        await Contact.deleteOne({_id:req.params.id})
        res.status(200).json({
            msg:'contact deleted'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

//delete many contact
Router.delete('/byGender/:gender',async(req,res)=>{
    try{
        await Contact.deleteMany({gender:req.params.gender})
req.status(200).json({
    msg:'contacts deleted'
})
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router

