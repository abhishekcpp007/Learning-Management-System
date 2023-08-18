const { from } = require("core-js/core/array");

const {model,Schema} =require('mongoose')
const courseSchema=new Schema({
    title:{
        trpe:String,
        required:[true,'Title is required'],
        minLength:[8,'Title must be at least 8 characters'],
        maxLength:[59,'Title should be less than 60 characters'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Title is required'],
        minLength:[8,'Title must be at least 8 characters'],
        maxLength:[200,'Title should be less than 60 characters'],
        trim:true
    },
    category:{
       type:String,
       required:[true,'Caegory is required']
    },
    thumbnail:{
        public_id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required: true
        },
        leactures:String,
        description:String,
        leactures:{
            public_id:{
                type:String,
                required: true
            },
            secure_url:{
                type:String,
                required: true
            }
        }
    },
    numberOfLeactures:{
        type:Number,
        default: 0
    },
    createdBy:{
        type:String
    }
},{
    timestamps:true

})
const Course=new model('Course',courseSchema);

module.exports=Course;