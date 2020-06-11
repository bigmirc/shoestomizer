
const express = require("express")
const User = require('../models/user')


class UsersRepo {
    constructor(){
    }

    findUserByEmail(email){
        return User.findOne({email:email})
    }
}

module.exports = UsersRepo