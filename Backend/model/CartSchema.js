const db = require('../Routes/dbconnection');

const cartSchema = new db.Schema({
    userid: { type: Number, required: true }, 
    Productid: { type: Number, required: true },
    cartid: { type: Number,unique:true},
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    img: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },  
    status: { type: Number, default: 1 }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, dbName: 'halleyx', collection: 'Carts' });

cartSchema.pre('save',async function(next) {
     const lastcart = await this.constructor.findOne().sort({ cartid: -1 }).limit(1);
    this.cartid = lastcart ? lastcart.cartid + 1 : 1;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    next();
});

cartSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = db.model('Cart', cartSchema);
