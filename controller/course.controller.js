import AppError from "../utils/appError.js";
import Course from "../models/course.js"; // Import the Course model (assuming this is defined in a separate file)
import { async } from "q";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
const cloudinary=require('cloudinary');
const fs=require('fs/promises')

export const getAllCourse = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select('-lectures'); // Corrected spelling
    res.status(200).json({
      success: true,
      message: 'All courses',
      courses,
    });
  } catch (e) {
    return next(
      new AppError(e.message, 500)
    );
  }
};

export const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { courseid } = req.params; // Correct parameter name: courseId
    const course = await Course.findById(courseid); // Use the correct parameter name
    if (!course) {
      return next(
        new AppError('Invalid course id', 400)
      );
    }
    res.status(200).json({
      success: true,
      message: 'Course lecture fetched successfully', // Corrected spelling
    });
  } catch (e) {
    return next(
      new AppError(e.message, 400)
    )
  }
}

export const createCourse = async (req,res,next)=>{
try {
    const {title,description,category,createdBy}=req.body;
    if(!title || !decription || !category || !createdBy){
        return next( new AppError('All fields are required',400))
    }
    const course= await Course.create({
        title,
        decription,
        category,
        createdBy,
        thumbnail:{
            public_id:"Dummy",
            secure_url:"dUMMY"
            }
    })
    if(req.file){
        const result =await cloudinary.v2.upload(req.file.path, {
            folder: 'lms'
        })
        if(result){
            course.thumbnail.public_id=result.public_id;
            course.thumbnail.secure_url=result.secure_url;
        }
        fs.rm(_`uploads/${req.file.filename}`);
    }
    await course.save();
    res.status(200).json({
        success:true,
        message:'course created successfully',
        course
    })
    
} catch (e) {
    return next(
        new AppError(e.message,500)
    )
    
}

};

export const updateCourse = async (req,res,next)=>{

  
  try {const {courseId}=req.params;
  const course =await Course.findByIdAndUpdate(
    courseId,
    {
      $set: req.body
    },
    {
      runValidators: true
    }
  )
  if(!course){
    return next(
      new AppError('Course does not exisr',400)
    )
  }
  res.status(200).json({
    success: true,
    message: 'course updated successfully',
    course
  })
    
  } catch (e) {
    
    return next(
      new AppError(e.message,500)
  )
  }

};
export const deleteCourse = async (req,res,next)=>{
  try {
    const {courseId}=req.params;
    const course =await Course.findById(courseId);
    if(!course){
      return next(
        new AppError('course does not exist with given id',500)
    )

    }
    await Course.findByIdAndDelete(courseId);
    res.status(200).json({
      success: true,
      message: 'course deleted successfully'
    })
    
  } catch (e) {
    return next(
      new AppError(e.message,500)
  )
    
  }

};
export const addLeactureToCourseById= async(req,res,next)=>{
  try {
    const {title, description} = req.body;
    const {courseId} = req.params
    if(!title || !description){
      return next(
        new AppError('All field  are required',500)
      )
    }
    const course=await Course.findById(courseId);
    if(!course){

      return next(
        new AppError('Course not exist',500)
      )
    }
    const leactureData = {
      title,
      description,
      leacture:{}
    }
    if(req.file){
      const result= await cloudinary.v2.uploader.upload(req.file.path,{
        folder: 'lms',
      })
      if(result){
       leactureData.leacture.public_id =result.public_id; 
       leactureData.leacture.secure_url=result.secure_url
      }
      fs.rm(`uploads/${req.file.filename}`);
    }
    course.leacture.push(leactureData)
    course.numbersOfLeactures = course.leacture.length;
    await course.save();
    res.status(200).json({
      success: true,
      message: 'Leacture added sucessfully',
      course
    })


    }

   catch (e) {
    return next(
      new AppError(e.message,500)
  )
    
  }
}


