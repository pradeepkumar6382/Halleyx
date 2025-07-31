const db=require('../Routes/dbconnection')
const bcrypt = require('bcrypt');

const userSchema=new db.Schema({
    userid: {type:Number,unique:true},
    firstname: { type: String, required: true },
    lastname:{type: String},
    email: { type: String, required: true, unique: true },      
    password: { type: String, required: true },
    role: { type: String, default: 'Customer' }, 
    Block:{ type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status:{type:Number,default:1},
}, { timestamps: true,dbName: 'halleyx', collection: 'Users' });

userSchema.pre('save', async function(next) { 
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
   try { 
        const lastUser = await this.constructor.findOne().sort({ userid: -1 }).limit(1);

        if (lastUser && lastUser.userid) {
            this.userid = lastUser.userid + 1;
        } else {
            this.userid = 1;
        }
    } catch (err) {
        console.error("Error assigning userid:", err);
        return next(err); 
    }
    next();
});

userSchema.methods.comparePassword = async function(passwordinput) {
    return await bcrypt.compare(passwordinput, this.password);
};

userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() }); 
    next();
});

module.exports=db.model('User',userSchema)