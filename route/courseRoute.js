const {Router}=require('express')
const{getAllCourses, deleteCourse, createCourse, updateCourse, addLeactureToCourseById}=require('../controller/course.controller.js');
const { isLoggedIn, authorizedRoles, authorizedSuscriber } = require('../middlewares/auth.middlewares.js');
const { update } = require('lodash');
const upload = require('../middlewares/multerConfig.js');
const router=Router();

router 
    .route('/:courseId')
    .get(getAllCourses)
    .post( isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse);

    router
    .route('/:courseid')
    .get(isLoggedIn ,
        authorizedSuscriber,getLeacturesByCourseId)
    .put( isLoggedIn,updateCourse)
    .delete( isLoggedIn,authorizedRoles('ADMIN'),deleteCourse)
    .post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('leacture'),
        addLeactureToCourseById
   )
    ;
    
    
    module.exports=router;