const User = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
  }
  
  const login = async (req, res) => {
    const { email, password } = req.body
  
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare password
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
  }
  

const getAllUsers = async(req, res) => {
    const user = await User.find({})
    res.status(StatusCodes.OK).json({user, nbHits:user.length})
}
const getSingleUser = async(req, res) => {
    const {id: userId} = req.params
    const user = await User.findOne({_id: userId})
    if(!user){
        throw new BadRequestError(`No user with id ${userId} exist`)
    }
    res.status(StatusCodes.OK).json({user})
}
const updateUser = async(req, res) => {
    const {id: userId} = req.params
    const {name, email, password} = req.body
    if(!name || !email || !password){
        throw new BadRequestError('Please provide name, email or password')
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const tempUser = {name, email, password: hashPassword}

    const user = await User.findOneAndUpdate({_id: userId},{...tempUser}, {
        new: true,
        runValidators: true
    })
    if(!user){
        throw new BadRequestError(`No user with id ${userId} exist`)
    }
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}
const deleteUser = async(req, res) => {
    const {id: userId} = req.params
    const user = await User.findOneAndDelete({_id: userId})
    if(!user){
        throw new BadRequestError(`No user with id ${userId} exist`)
    }
    res.status(StatusCodes.OK).send('User deleted')
}

module.exports = { register, login, getAllUsers, getSingleUser, updateUser, deleteUser }