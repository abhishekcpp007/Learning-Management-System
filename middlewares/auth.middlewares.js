const { async } = require('q');
const AppError=require('../utils/appError') 

const isLoggedIn=function(req,res,next){
    const{token}=req.cookies;
    if(!token){
        return next(new AppError('Unauthenticated,plese login',401))
    }
    const tokenDetails=jwt.verify(token,process.env.JWT_SECRET)
    if(!tokenDetails){
        return next(new AppError('Unauthenticated,plese login',401))
    }
    req.user=tokenDetails;
    next();
  }

const authorizedRoles=(...roles)=>(req,res,next)=>{
const currentRole=req.user.roles
if(roles.includes(currentRole)){
  return next(
    new AppError('you do not have permission to acess route',403)
  )
}
  next();
}
 const  authorizedSuscriber= async(req,,res,next)=>{
 const subscriptionStatus= req.user.subscription.status;
 const currentRole =req.user.roles;
 if(currentRole=='ADMIN' && subscriptionStatus !=='active')
 return next(
new AppError('Please subscribe to access this route',403)
 )
 
  next()
 }
 
  module.exports={
    isLoggedIn,
    authorizedRoles,
    authorizedSuscriber
  }
