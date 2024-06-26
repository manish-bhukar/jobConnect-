const express = require('express');
const {saveUserProfile}=require('../Controller/ProfileController.js');
const { protect } = require('../middleware/auth.js');
const router = express.Router();


router.route('/profile').post(protect,saveUserProfile);
module.exports = router;