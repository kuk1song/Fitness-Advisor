import express from 'express';
import User from  '../models/User.js';

const userRoutes = express.Router();

userRoutes.get('/user', async (req, res) => {
    const { name = null, email = null } = req.query;

    try {
        const data = await User.findOne({ $or: [
            { name }, { email }
        ]});
        res.header("Content-Type", "application/json")
            .status(200).json({ message : "Successfully retrieve data!", data });
    }
    catch (e) {
        res.status(500).json({ message : "Server error. Please try again later." })
    }
})


export default userRoutes;