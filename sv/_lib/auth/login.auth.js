/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  InshaAllah  */
import { User } from "../../models/User.js";
import bcrypt from 'bcryptjs'
 


export const loginApiFunc =async (req, res) => {
  let {password,  email } = req.body ; 
  if (!password) return res.json({error:'password is not define'})
  if (!email) return res.json({error:'email is not  define'})
  if (email.trim().length < 5 || email.trim().length > 36) return res.json({error:'email is not valid'});
  if (password.trim().length < 4 || password.trim().length > 20) return res.json({error:'email is not valid'});
  if (!email.toString().includes('@')) return res.json({error:'email is not valid'})
  try {
    let user = await User.findOne({email})
    if (!user) return res.json({error : 'not user info match ,Please Create an account'});
    let passwordMatch = await bcrypt.compareSync(password,user.password)
    if (!passwordMatch) return res.json({error : 'password not match ,Please Create a give the correct'});
    jwt.sign({email, pin: generatePin(67896)},  secret, {})
    res.cookie({sameSite : false,  expires : new Date( Date.now() + (60 *60 *24 *30))})
  } catch (e) {
    console.log(e)
  }
}
