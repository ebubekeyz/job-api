const express = require('express')
const router = express.Router()
 
const {register, login, getAllUsers, getSingleUser, updateUser, deleteUser} = require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/').get(getAllUsers)
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser)


module.exports = router