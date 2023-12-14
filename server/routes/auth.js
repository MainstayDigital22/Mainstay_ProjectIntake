const jwt = require('jsonwebtoken')
let User = require('../schemas/user');
const authRouter = require('express').Router();
async function auth(req,permID){ //authenticate API request
    
    try{
    const token = String(req?.headers?.authorization?.replace('Bearer ', ''));
    if(!token){return}
    const decoded = jwt.verify(token, process.env.SECRET);
    if(!decoded){return}
    
    user = await User.findOne({username:decoded.username})
    if(user.permission>permID){ //if the permission is not high enough
      return
    }
    return 1}
    catch{return}
  }
  authRouter.route('/authlevel/:token').get(async (req, res) => {
    try{
      const token = String(req?.params?.token);
      if(!token){res.status(400).json('Token Error')}
      const decoded = jwt.verify(token, process.env.SECRET);
      if(!decoded){"Decoding Error"}
      user = await User.findOne({username:decoded.username})
      res.json({perm:user.permission})}
      catch(err){res.status(400).json('Error: ' + err)}
  });
module.exports={auth,authRouter};