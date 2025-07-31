const db = require('../Routes/dbconnection');

const orderSchema = new db.Schema({
  userid: { type: Number, required: true },
  Productid: { type: Number, required: true },
  orderid: { type: Number, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  img: { type: String },
  orderstatus: { type: String,default:"Shipped" },
  quantity: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: Number, default: 1 },
  addline1: { type: String, required: true },
  addline2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  country: { type: String, required: true },
  phone: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, dbName: 'halleyx', collection: 'Orders' });

orderSchema.pre('save', async function (next) { 
  let array=['Shipped','Processing','Completed']
   let random=Math.floor(Math.random() * array.length);
   let randomstatus = array[random];
  try {
    const lastOrder = await this.constructor.findOne().sort({ orderid: -1 }).limit(1);
    this.orderid = lastOrder && lastOrder.orderid ? lastOrder.orderid + 1 : 1;
    const now = new Date();
    this.createdAt = this.createdAt || now; 
    this.orderstatus=randomstatus;
    this.updatedAt = now;
    next();
  } catch (err) {
    console.error("Error generating orderid:", err);
    next(err);
  }
});

orderSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});


module.exports = db.model('Order', orderSchema);
