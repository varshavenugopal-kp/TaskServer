import jwt from 'jsonwebtoken'
export const userAuth = (req, res, next) => {
    try {
        console.log("mmmmm");
        
      let token=req.headers.token
      let JWT=process.env.JWT_KEY
      if(token){
        token=token.toString()
        let decode=jwt.verify(token,JWT) 
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const isTokenExpired = decode.exp < currentTimestamp;
        if (isTokenExpired) {
            res.json({ message: 'expired' })
        } else {
            next()
        }
      }else {
        res.json({ message: 'unauthorized' })
    }
    }
    catch (err) {
        console.log(err);

    }
}