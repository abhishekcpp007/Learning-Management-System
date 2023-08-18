const {Schema,model}=require('mongoose');
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto=require('crypto')
const { async } = require('q');
const { stringify } = require('querystring');

const userSchema=new Schema({
  fullName:{
    type:String,
    required:[true,"user name is required"],
    minLength:[2,"name must be at-leat 2 character"],
    maxLength:[50,"name must be less than 50 characters"],
    lowercase:true,
    trim:true

  } ,
  email:{
    type:String,
    required:[true,"email is required"],
    unique:true,
    lowercase:true,
    match:[
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"Please fill in valid email address",
    ]


  } ,
  password:{
    type:String,
    required:[true,"password is requirede"],
    minLength:[8,"password must be more than 8 character"],
    select:false,
    unique:true,

  },
  role:{
    type:String,
    enum:['USER','ADMIN'],
    default:'USER'

  },
  avatar:{
    public_id:{
        type:String
    },
    secure_url:{
        type:String
    }
  },
  forgotPasswordToken:String,
  forgotPasswordExpiry:Date,
  subscription:{
  id:String,
  status:String
  }
  
},
{
    timestamps:true
  })
  userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
      return next();
    }
    this.password= await bcrypt.hash(this.password,10)
  })
userSchema.methods={
  comparePassword:async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword,this.password)
  },
  generateJWTToken: function(){
    return this.jwt.sign(
      {
        id: this._id,role: this.role, email:this.email,subscription:this.subscription},
       process.env.JWT_SECRET,
       {
        expiresIn:process.env.JWT_EXPIRY
       }
      
    )
  },
  generatePasswordToken: async function(){
    const resetToken=crypto.randomBytes(20).toString('hex')
    this.forgotPasswordToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    this.forgotPasswordExpiry=Date.now()+15*60*1000;
    return resetToken;
  }
}
  const User=model('User',userSchema);

  module.exports=User;