const {  AppError } = require('../utils/appError');
const  User=require('../models/user.model')
const cloudinary=require('cloudinary');
const crypto=require('crypto')

const { fstat } = require('fs');
const { async } = require('q');
const cookieOptions={
    secure:true,
    maxAge: 7*24*60*60*1000,
    httpOnly:true
}
const register= async(req , res,next)=>{
    const {fullname,email,password}=req.body;

    if(!fullname || !email || !password){
        return next(new AppError('All fields are require', 400))
    }
    const userExists =await User.findOne({email});
  if(userExists){
    return next(new AppError('Email already exist', 400))
  }
  const user= await User.create({
  fullName,
  email,
  password,
  avatar:{
    public_id:email,
    secure_url:"http://res.cloudinary.com/deowwx5id"
  }
  })
  if(!User){
    return next(new AppError('User registration fails please try again', 400))
  }// TODO: upload user picture
  console.log('File details >',JSON.stringify(req.file));
  if(req.file){
    try {const result=await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms',
        width:250,
        height:250,
        gravity:'faces',
        crops:'fill'

    })
    if(result){
        user.avatar.public_id=result.public_id
        user.avatar.secure_url=result.secure_url

        // file from local server
       fs.rm(`uplod/${req.file.filename}`);
    }
        
    } catch (e) {
        return next(new AppError(e.message||'File not uploaded ,please try again', 500))
        
    }
  }
  await user.save();
  //TODO: set jwt token in cookie
  res.password=undefined
   res.status(200).json({
    success:true,
    message:"User registered successfully",
    user
   })
}





const login =async(req , res,next)=>{
    const {emal,password}=req.body
    if(!emal||!password){
        return next(new AppError('All fields are require', 400))
    }
    const user=await User.findOne({email}).select('+password')
    if(!user|| !user.comparePassword(password)){// TODO
        return next(new AppError('Email or password doesnot matched', 400))
    }
    const token= await user.generateJWTToken();
    user.password =undefined
    res.cookie('token',token,cookieOptions);
    res.status(201).json({
        sucess:true,
        message:'User register successfully',
        user
    })
}



const logout =(req , res)=>{
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'user logged out successfully'
    })

}
const getProfile =(req , res)=>{
    const userId=User.findById(req.user.id);
    res.status(200).json({
        sucess:true,
        message:'User details'
    })


}
const forgotPassword = async(req,res,next)=>{
const {email}=req.body
if(!email){
    return next(
        new AppError('Email is required',400)
    )
} const user=await User.findOne({email});
if(!user){
    return next(
        new AppError('Email not register',400)
    )

}const resetToken =await user.generatePasswordToken()
await user.save();
const resetPasswordUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
const subject='Reset Password';
const message=`You can reset your password by clicking<a href=${resetPasswordUrl}target="_blank">Reset your password</a>\nif the above link doses not work for some </a>`;
console.log(resetPasswordUrl)
try {//TODO: Create sendEmail
    await sendEmail(email,subject,message);
    res.status.json({
        success:true,
        message:`Reset password token has been sent to${email} successfully `
    })
    
} catch (e) {
    user.forgotPasswordExpiry=undefined;
    user.forgotPassword=undefined;
    await user.save();
    return next(new AppError(e.message,500))
}
}
const resetPassword=async (req,res,next)=>{
    const {resetToken}=req.params;
    const{password}=req.body;


    const forgotPasswordToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    const user=await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    })
if(!user){
    return next(
        new AppError('Token is incalid or explained, plese try again',400)
    )
}
user.password=password
user.forgotPasswordExpiry=undefined
user.forgotPasswordToken=undefined
await user.save();
res.status(200).json({
    success:true,
    message:"password changed successfully"
})

}


const changePassword = async function(req,res,next){
    const {oldPassword,newPassword}=req.body;
    const {id}=req.user;
    if(!oldPassword ||  !newPassword){
        return next(
           new AppError('All fields are mandatory',400)
        )
    }
    const user=await User.findById(id).select('+password');
    if(!user){
        return next(
            new AppError('User does not exist',400)
        )
    }
    const isPasswordValid= await user.comparePassword(password);
    if(!isPasswordValid){
        return next(
            new AppError('Invalid old password',400)
        )
        user.password=newPassword;
        await user.save();
        user.password=undefined
        res.status(200).json({
            success:true,
            message:'Password changed successfully!'
        })

    }



}
const updateUser = async function(req,res,next){
const {fullName}=req.body;
const {id}=req.user;
const user=await User.findById(id);
if(!user){
    return next(
        new AppError('User doesnot exist',400)
    )
}
if(req.fullName){
    user.fullName=fullName;
}
if(req.file){
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    
        
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms',
            width:250,
            height:250,
            gravity:'faces',
            crops:'fill'
    
        })
    

    
    if(result){
        user.avatar.public_id=result.public_id
        user.avatar.secure_url=result.secure_url

        // file from local server
       fs.rm(`uplod/${req.file.filename}`);
    }
}
await user.save();
res.status(200).json({
    success:true,
    message:'User details updated successfully'
})
}

    



module.exports={
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser 

}