const express=require('express')
const router=express.Router()
const {isLoggedIn}=require('../middlewares/auth.middlewares')


// creating the various route that i am required
const {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser 
}=require('./../controller/user.controller')
const upload = require('../middlewares/multerConfig')


router.post('/register',upload.single('avatar'),register)
router.post('/login',login)
router.get('/logout', logout)
router.get('/me',isLoggedIn, getProfile);
router.post('reset',forgotPassword)
router.post('/reset/:resetToken',resetPassword)
router.post('/change-password', isLoggedIn,changePassword)
router.put('/update',isLoggedIn,upload.single('avatar',updateUser ))






 module.exports=router


