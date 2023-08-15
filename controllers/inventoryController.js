const mongoose = require("mongoose");
const inventorySchema = require("../models/inventorySchema");
const userSchema = require("../models/userSchema");


// createInventory ***************
const createInventory = async (req, res) => {
    try {
        const { email } = req.body;
        //validation
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User Not Found");
        }

        if (req.body.inventoryType == "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            //calculate Blood Quanitity
            const totalInOfRequestedBlood = await inventorySchema.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "in",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            //calculate OUT Blood Quanitity

            const totalOutOfRequestedBloodGroup = await inventorySchema.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & Out Calc
            const availableQuanityOfBloodGroup = totalIn - totalOut;
            //quantity validation
            if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }
        // save
        const inventory = new inventorySchema(req.body);
        await inventory.save();

        return res.send({
            success: true,
            message: "New blood record added !",
            inventory
        })
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in create Inventory",
            error
        })
    }
}
// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventorySchema.find({ organisation: req.body.userId })
            .populate("donar")
            .populate("hospital")
            .sort({ createdAt: -1 });
        return res.send({
            success: true,
            message: "get all records successfully !",
            inventory
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: true,
            message: "Error in get Inventory !",
            error
        })
    }

}

// GET Hospital BLOOD RECORS************
// const getInventoryHospitalController = async (req, res) => {
//     try {
//         const inventory = await inventoryModel
//             .find(req.body.filters)
//             .populate("donar")
//             .populate("hospital")
//             .populate("organisation")
//             .sort({ createdAt: -1 });
//         return res.status(200).send({
//             success: true,
//             messaage: "get hospital comsumer records successfully",
//             inventory,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "Error In Get consumer Inventory",
//             error,
//         });
//     }
// };

// GET BLOOD RECORD OF 3************
// const getRecentInventoryController = async (req, res) => {
//     try {
//         const inventory = await inventoryModel
//             .find({
//                 organisation: req.body.userId,
//             })
//             .limit(3)
//             .sort({ createdAt: -1 });
//         return res.status(200).send({
//             success: true,
//             message: "recent Invenotry Data",
//             inventory,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "Error In Recent Inventory API",
//             error,
//         });
//     }
// };

// GET DONAR RECORD
const getDonarsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //find donars
        const donorId = await inventorySchema.distinct("donar", {
            organisation,
        });
        // console.log(donorId);
        const donars = await userSchema.find({ _id: { $in: donorId } });

        return res.status(200).send({
            success: true,
            message: "Donar Record Fetched Successfully",
            donars,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Donar records",
            error,
        });
    }
}

// *******
// const getHospitalController = async (req, res) => {
//     try {
//         const organisation = req.body.userId;
//         //GET HOSPITAL ID
//         const hospitalId = await inventoryModel.distinct("hospital", {
//             organisation,
//         });
//         //FIND HOSPITAL
//         const hospitals = await userModel.find({
//             _id: { $in: hospitalId },
//         });
//         return res.status(200).send({
//             success: true,
//             message: "Hospitals Data Fetched Successfully",
//             hospitals,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "Error In get Hospital API",
//             error,
//         });
//     }
// };

// GET ORG PROFILES
// const getOrgnaisationController = async (req, res) => {
//     try {
//         const donar = req.body.userId;
//         const orgId = await inventoryModel.distinct("organisation", { donar });
//         //find org
//         const organisations = await userModel.find({
//             _id: { $in: orgId },
//         });
//         return res.status(200).send({
//             success: true,
//             message: "Org Data Fetched Successfully",
//             organisations,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "Error In ORG API",
//             error,
//         });
//     }
// };
// // GET ORG for Hospital
// const getOrgnaisationForHospitalController = async (req, res) => {
//     try {
//         const hospital = req.body.userId;
//         const orgId = await inventoryModel.distinct("organisation", { hospital });
//         //find org
//         const organisations = await userModel.find({
//             _id: { $in: orgId },
//         });
//         return res.status(200).send({
//             success: true,
//             message: "Hospital Org Data Fetched Successfully",
//             organisations,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "Error In Hospital ORG API",
//             error,
//         });
//     }
// };
module.exports = { createInventory, getInventoryController, getDonarsController };