const express = require('express');
const { loginController, registerController, currentController } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

//routes
//REGISTER || POST
router.post('/register', registerController);


//LOGIN || POST
router.post('/login', loginController);

//GET CURRENT USER || GET
router.get('/current-user',authMiddleware,currentController);
module.exports = router;