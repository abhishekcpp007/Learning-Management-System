const { from } = require("core-js/core/array");

import {Router} from 'express';
import router, { route } from './courseRoute';
import{buySuscription,cancleSuscription,getAllPayments,getRazorpayApiKey} from 'razorpay'
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middlewares';
router
.route('/razorpay_key')
.get(isLoggedIn,
    getRazorpayApiKey);


router
.router('/suscribe')
.post(buySuscription);

router.route('/verify')
.post(isLoggedIn,
    verifySuscription)

router
.route('/unsuscribe')
.post(isLoggedIn,
    cancleSuscription)


router
.route('/')
.get(isLoggedIn,
    authorizedRoles('ADMIN'),
    getAllPayments);

export default router;

