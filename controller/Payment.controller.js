import { async } from "q";
import AppError from "../utils/appError";
import Razorpay from "razorpay";
import subscriptions from "razorpay/dist/types/subscriptions";

export const getRazorpayApiKey = async(req,res,next)=>{

try {
    res.status(200).json({
     success: true,
     message:'Rajorpay API Key',
     key: process.env.RAZORPAY_API_KEY_ID
    }
    )
    
} catch (e) {
    return next(
        new AppError(e.message  ,500)
    )
    
}

}

export const buySuscription = async (req,res,next)=>{
    try {
        const {id}=req.user;
        const user=await User.findById(id);
        if(!user){
            return next(
                new AppError('Unathorized ,please login' , 500)
            )
        
        }
        if(user.role === 'ADMIN'){
            return next(
                new AppError("admin cannot purchase a subscription",400)

            )
        }
        const subscription = await razorpay.subscription.create({
            plan_id:process.env.RAZORPAY_PLAN_ID,
            customer_notify:1
        });
        //update user model with suscription
        user.subscription.id=subscription.id;
        user.subscription.status=subscription.status;
        await user.save();

        res.status(200).json({
            success:true,
            message:'Subscribes Successfully'
        })
        
    } catch (e) {
        return next(
            new AppError(e.message,500)
        )
        
    }

}


export const verifySuscription = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const user = await User.findById(id);
        if(!user){
            return next(
                new AppError('unauthorize ,please login',500)
        )
        }
        const {
            razorpay_payment_id,razorpay_subscription_id
        } =req.body;
        const generatedSignature =crypto
        .createHmac('sha256',process.RAZORPAY_SECRET)
        .UPDATE(`${RAZORPAY_PAYMENT_ID}| ${razorpay_subscription_id}`)

        if(generatedSignature !== razorpay_signature){
            return next(
                new AppError('The payment not verified , please try again',500)

            )
        }
        // record payment details in payment collection
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
        })
        //update user record with subscription status 
        user.subscription.status='active';
        await user.save();
        res.status(200).json({
            sucess: true,
            message:'payment verified successfully'
        })
        
    } catch (e) {
        return next(
            new AppError(e.message,500)
        )
    }

}
export const cancleSuscription=async(req,res,next)=>{
    try {const {id}=req.user;
    const user = await User.findById(id);
    if(!user){
        return next(
            new AppError('Unauthorize , please login ',500)
        )
    }
    if(user.role =='ADMIN'){
        return next(
            new AppError('Admin cannot cancle the suscription',403)
        )
    }
    const razorpay_suscriptionId = user.subscription.id
    const subscription = await razorpay_suscription.cancle(
        subscriptionId
    )
    user.subscription.status =subscription.status;
    await user.save();
    res.status(200).json({
        success: true,
        message:'Subscription Canclled',
    })
        
    } catch (e) {
        return next(
            new AppError(e.message,500)
        )
    }
}
export const getAllPayments = async(req,res,next)=>{
    try { 
        const {count}= req.query;
        const subscription =await razorpay.subscription.all({
            count:count ||10,
        })
        res.status(200).json({
            success:true,
            message:'All payment',
            payment: subscriptions
        })
        
    } catch (e) {
        return next(
            new AppError(e.message,500)
        )
        
    }
}