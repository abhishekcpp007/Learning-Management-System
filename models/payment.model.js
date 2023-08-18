import {Schema, model,schema} from "mongoose"
const paymentSchema=new Schema({
payment_id:{
    type:String,
    required:true 
},
razorpay_suscription_id:{
    type:String,
    required:true
},
razorpay_signature:{
    type :String,
    required:String
}
})
const Payment =model('Payment',paymentSchema);
export default  Payment;