const express = require('express');
const { createInventory, getInventoryController, getDonarsController } = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


//routes***********************

// ADD INVENTORY || POST
router.post('/create-inventory',authMiddleware, createInventory);

//GET ALL BLOOD RECORDS
router.get('/get-inventory', authMiddleware, getInventoryController)

//GET RECENT BLOOD RECORDS*******************
// router.get(
//     "/get-recent-inventory",
//     authMiddelware,
//     getRecentInventoryController
//   );

//GET HOSPITAL BLOOD RECORDS**************
// router.post(
//     "/get-inventory-hospital",
//     authMiddelware,
//     getInventoryHospitalController
//   );

//GET DONAR RECORDS*******************
router.get('/get-donar', authMiddleware, getDonarsController)

//GET HOSPITAL RECORDS***************
// router.get("/get-hospitals", authMiddelware, getHospitalController);

//GET orgnaisation RECORDS****************
// router.get("/get-orgnaisation", authMiddelware, getOrgnaisationController);

//GET orgnaisation RECORDS****************
// router.get(
//   "/get-orgnaisation-for-hospital",
//   authMiddelware,
//   getOrgnaisationForHospitalController
// );


module.exports = router;