const db=require('../Routes/dbconnection');

const productSchema = new db.Schema({
    name: { type: String, required: true }, 
    description: { type: String, required: true },
    price: { type: Number, required: true },    
    category: { type: String, required: true },
    img: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    Productid:{type:Number,unique:true},
    stockquantity:{type:Number,default:1},
    status:{type:Number,default:1}
});

productSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastProduct = await this.constructor.findOne().sort({ Productid: -1 }).limit(1);
            this.Productid = lastProduct ? lastProduct.Productid + 1 : 1;
        } catch (err) {
            console.error("Error assigning Productid:", err);
            return next(err);
        }
    }
    this.updatedAt = new Date();
    next();
}); 

productSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = db.model('Product', productSchema);