import express from 'express'
import { deleteUser, getUserDetails, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { getUserListings } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/test', test)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUserDetails)

export default router;