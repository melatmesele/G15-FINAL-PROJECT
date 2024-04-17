const express = require('express');
const User = require('../../models/auth/user.model');
const { Model } = require('sequelize');
const UserProfile = require('../../models/auth/profile.model');

// Import necessary 
// Define route for creating a profile
const createProfile  = async (req, res) =>  {
    const{ id} = req.params;
    const { 
        university, 
        linkdien,
         github, 
         phoneNo,
          telegramUsername, 
          gender,
           department, 
           shortbio,
           photo,

             } = req.body;
    try {
    const user = await User.findOne({where: {id: id}});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
    const fullName = user.fullName
    const email = user.email
    const userId = user.userId
    const role = user.role

    const profile = await UserProfile.create({
        fullName,
        email,
        userId,
        university,
        linkdien,
        github,
        phoneNo,
        telegramUsername,
        gender,
        department,
        shortbio,
        photo,
        role
    });
        

    return res.status(201).json({message: "Profile created successfully", profile});

    } catch (error) {
        return res.status(500).json({error: error});
    }
}

const getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user
            = await User.findOne({where: {userId: id}});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const profile = await UserProfile.findOne({where: {userId: id}});

        if(!profile){
            return res.status(404).json({message: "Profile not found"});
        }


        return res.status(200).json({profile});
    }
    catch (error) {
        return res.status(500).json({error: error});
    }
}

const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { university, linkedin, github, phoneNo, telegramUsername,gender,shortBio,photo,department} = req.body; 
    
    try {
        const
        user = await User.findOne({where: {userId: id}});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const profile = await UserProfile.findOne({where: {userId: id}});
        if(!profile){
            return res.status(404).json({message: "Profile not found"});
        }
        profile.university = university;
        profile.linkedin = linkedin;
        profile.github = github;
        profile.phoneNo = phoneNo;
        profile.telegramUsername = telegramUsername;
     
        profile.phpoto = photo;
        profile.depqartment = department;
        profile.shortBio = shortBio;
        profile.gender = gender;

        
        await profile.save();
        return res.status(200).json({message: "Profile updated successfully", profile});
       
        
    }
    catch (error) {
        return res.status(500).json({error: error});
    }
}

module.exports = {createProfile, getProfile, updateProfile};