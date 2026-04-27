require('dotenv').config()
const express = require('express')
const Router = express.Router()
const Contact = require('../models/Contact')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:'dqphp0ptd',
    api_key:'653149651464325',
    api_secret:'8dkB0Wa3CvYEVSF7nZIwiE26CdA'
})

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

Router.post('/add-contact',async(req,res)=>{
    try {
        console.log(req.files)
        // console.log(req.headers.authorization.split(" ")[1])
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        //console.log(tokenData)
        const uploadResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        console.log(uploadResult)

        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            gender:req.body.gender,
            userId:tokenData.userId,
            imageId:uploadResult.public_id,
            imageUrl:uploadResult.secure_url
        })
        
        const newData = await newContact.save()
        res.status(200).json({
            result:newData
        })

    }
   catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

//get all contacts
Router.get('/all-contact',async(req,res)=>{
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const allContact = await Contact.find({userId:tokenData.userId}).select("_id fullName email phone address gender userId imageId imageUrl").populate('userId','fullName phone')
        res.status(200).json({
            contacts:allContact
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
      try
    {
        // console.log(req.params.id)
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const id = req.params.id
        // const data = await Contact.findById(id).select("_id fullName email phone address gender userId")
        const data = await Contact.find({_id:req.params.id,userId:tokenData.userId})
        return res.status(200).json({
            contact:data.length>0 ? data[0] : {}
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
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
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
//update api
Router.put('/update/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)

        const IDContact = await Contact.findById(req.params.id)
        if (!IDContact)
        {
            return res.status(500).json({
                msg: 'no contacts exists with this id'
            })
        }
        if (IDContact.userId != tokenData.userId) {
            return res.status(500).json({
                msg: "you dont have accesss to this data"
            })
        }
        const newContact = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            gender: req.body.gender,
            userId: tokenData.userId
        }
        if (req.files) 
        {
        await cloudinary.uploader.destroy(IDContact.imageId)
        const uploadedresult = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        newContact['imageId'] = uploadedresult.public_id
        newContact['imageUrl'] = uploadedresult.secure_url
        }
        else
        {
        newContact['imageId'] = IDContact.imageId
        newContact['imageUrl'] = IDContact.imageUrl
        }
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, newContact, { new: true })
        
        res.status(200).json({
            msg : 'data updated',
            data : updatedContact
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})


//delete api
Router.delete('/:id',async(req,res)=>{
    try {
        //  const token = req.headers.authorization.split(" ")[1]
        // const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        // await Contact.deleteOne({_id:req.params.id})
        // res.status(200).json({
        //     msg:'contact deleted'
        // })
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token,process.env.SEC_KEY)
        const contact =await Contact.findById(req.params.id)
        if(contact.userId != tokenData.userId)
        {
            return res.status(500).json({
                error:'invalid user'
            })
        }

        await cloudinary.uploader.destroy(contact.imageId)
        await Contact.deleteOne({_id:req.params.id,userId:tokenData.userId})
        res.status(200).json({
            msg:'data deleted'
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
    try
    {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = await jwt.verify(token, process.env.SEC_KEY)
        //userID = tokenData.userId
        const contacts = await Contact.find({userId : tokenData.userId, gender : req.params.gender})
        contacts.forEach(async (contact) =>{
            await cloudinary.uploader.destroy(contact.imageId)
        })
        const result = await Contact.deleteMany({gender:req.params.gender,userId:tokenData.userId})
        res.status(200).json({
            msg:`${result.deletedCount} contacts of the ${req.params.gender} gender is deleted`
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router

