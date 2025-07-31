const jwt=require('jsonwebtoken');
const secretkey="Pradeep123@halleyx";

const generateToken=(user)=>{
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, secretkey, {
        expiresIn: '1h' 
    });     
};

module.exports = generateToken;