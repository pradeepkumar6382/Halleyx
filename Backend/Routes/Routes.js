const express = require('express');
const router = express.Router();
const User = require('../model/usermodel');
const jwttoken = require('../Routes/Auth'); 
const Product = require('../model/Productschema');
const Cart = require('../model/CartSchema');
const axios = require('axios');
const Order=require('../model/OrderSchema'); 
const bcrypt = require('bcrypt');
const multer = require('multer');
const Productschema = require('../model/Productschema');
const OrderSchema = require('../model/OrderSchema');


// const seeddata = async () => {
//     try {
//         await Product.deleteMany();
//         console.log(' Old products deleted');

//         const response = await axios.get('https://fakestoreapiserver.reactbd.org/api/products?page=1&perPage=50');
//         const result = await response.data.data;
//         console.log('Products fetched from API', result);
//         const mappedProducts = result.map((p,index) => ({
//             Productid:p._id || index + 1, 
//             name: p.title,
//             description: p.description,
//             price: p.price,
//             category: p.category,
//             img: p.image,
//             status:1,
//         }));
//         console.log('Products mapped from API', mappedProducts);

//         await Product.insertMany(mappedProducts);
//         console.log('Seed 50 products from API');
        

//     } catch (err) {
//         console.error(' Error seeding data:', err);

//     }
// };

// seeddata();

router.post('/register', async(req, res) => {
   console.log(req.body,"hi");
   const {firstname,lastname,email,password}=req.body;
   const salt = await bcrypt.genSalt(10);
   const passwordhash = await bcrypt.hash(password, salt);
    const user = new User({ firstname:firstname,lastname:lastname, email, password:passwordhash });
    await user.save();
   res.status(200).json("Saved successfully")
});

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const user = await User.find({ email });
        console.log(user)
        if(user[0] && user[0].role==='admin') return res.json({ message: "Login successful", user: user[0],token: jwttoken(user[0]) });
        if (user.length > 0) {  
            console.log(user)
            const isMatch =await bcrypt.compare(password, user[0].password)
            console.log(isMatch)
            if (isMatch) {
                res.json({ message: "Login successful", user: user[0],token: jwttoken(user[0]) });
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }} catch (error) {
        console.error("Error during login:", error);    
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/products', async(req, res) => {
    try {   
       const { limit } = req.body;
       const skip=(limit-1)*9;
       console.log(skip,"skip");
        if (!limit || limit < 1) {
            return res.status(400).json({ message: "Invalid limit parameter" });
        }
       const products = await Product.find().skip(skip).limit(9);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/addtocart', async(req, res) => {
    console.log(req.body,"add to cart");
    const data = req.body;
    delete data._id;
    delete data.status;
    const newcart=new Cart({
        ...data
    }); 
    await newcart.save()
    console.log("Product added to cart successfully");
    if (!newcart) {
        return res.status(500).json({ message: "Failed to add product to cart" });
    }else {
        console.log("Product added to cart successfully");
        console.log(newcart,"new cart");
        const count= await Cart.countDocuments({ userid: data.userid });
        console.log(count,"count");
        return res.status(200).json({ message: "Product added to cart successfully", cart: count });
    }
})

router.post('/cartcount', async(req, res) => {
    console.log(req.body,"cart count")
    const { userid } = req.body;
    try {
        const count = await Cart.countDocuments({ userid,status:1});
        console.log(count,"count");
        res.json({ count });
    } catch (error) {
        console.error("Error fetching cart count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/cartdata',async(req, res) => {
    console.log(req.body,"cart data");
    const { userid } = req.body;
    try {
        const cartData = await Cart.find({ userid ,status:1});
        console.log(cartData,"cart data");
        if (cartData.length > 0) {
            res.json(cartData);
        } else {
            res.status(404).json({ message: "No items in cart" });
        }
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/addtoorder',async(req,res)=>{
   const orderdata=req.body
   const {Productid}=req.body
   const {quantity}=req.body
   const Product=await Productschema.findOne({Productid})
   if(Product.stockquantity <quantity){return res.status(200).json({message: "Out of stock" });}
   const stockupdate=await Productschema.findOneAndUpdate({Productid},{$set:{stockquantity:Product.stockquantity-quantity}})
   delete orderdata._id;
   const orders=new Order({
    ...orderdata
   })
   await orders.save()
   if(orders){
    console.log("Order placed successfully");
    res.status(200).json({ message: "Order placed successfully" });
    }else{
    console.log("Failed to place order");
    res.status(500).json({ message: "Failed to place order" });
    }
})

router.post('/cartupdate', async (req, res) => {
    console.log(req.body,"cart update");
  const { cartid,status,quantity,Productid,userid} = req.body;

  try {

    const cart = await Cart.findOneAndUpdate(
      { cartid: cartid },
      { status: 0 }, 
      { new: true }
    );
   delete _id;
    if (cart) {
        console.log(cart)
      console.log("Cart updated successfully");
        const cartData = await Cart.find({ userid ,status:1});
      res.status(200).json({ message: "Cart updated successfully", cartData });
    } else {
      console.log("Cart not found");
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (err) {
    console.error("Failed to update cart", err);
    res.status(500).json({ message: "Failed to update cart", error: err });
  }
});

router.post('/getorders', async (req, res) => {
    console.log(req.body,"get order");
    const { userid } = req.body;
    try {
        const orders = await Order.find({ userid });
        if (orders.length > 0) {
            console.log(orders,"orders");
            res.json(orders);
        } else {
            res.status(404).json({ message: "No orders found" });
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
);

router.post('/getuser', async (req, res) => {
    const { userid } = req.body;

    try {
        const data = await User.findOne({ userid, status: 1 });
        console.log(data, "fetch data");
        res.status(200).json(data);  
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/changepassword', async (req, res) => {
    console.log("hii frpom here")
  const { userid, current, newPassword, confirm } = req.body;
console.log(req.body)
  try {
    const user = await User.findOne({ userid, status: 1 });
    if (!user) return res.status(404).json({ message: "User not found" });
   console.log(user)
     const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {console.log("Current password is incorrect"); return res.status(401).json({ message: "Current password is incorrect" });}

     if (newPassword !== confirm) {
        console.log("New passwords do not match")
      return res.status(400).json({ message: "New passwords do not match" });
    }

     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    console.log("Password updated successfully")
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/userupdate', async (req, res) => {
  const { firstname, lastname, email, userid } = req.body;

  try {
    const userupdate = await User.findOneAndUpdate(
      { userid },
      { $set: { firstname, lastname, email } },
      { new: true }
    );
    if (!userupdate) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated",
      updatedUser: userupdate
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/productsearch', async (req, res) => {
  try {
    console.log(req.body);
    const { product } = req.body;

    const products = await Product.find({
      name: { $regex:product, $options: 'i' }
    });
 console.log(products)
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/fetchadmindashboardcount', async (req, res) => {
  try {
    const Totalproducts = await Product.countDocuments({status:1});
    const TotalCustomers = await User.countDocuments();

    const Ordershipped = await Order.find({ orderstatus: 'Shipped' });
    const orderprocessing = await Order.countDocuments({ orderstatus: 'Processing' });
    const orderpending = await Order.countDocuments({ orderstatus: 'Pending' });

    res.status(200).json({
      Totalproducts,
      TotalCustomers,
      Orders: {
        shipped: Ordershipped.length,
        Processing: orderprocessing,
        pending: orderpending
      }
    })} catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/getproducts',async(req,res)=>{
  console.log(req.body)
    const products=await Product.find({status:1})
    if(products) return res.status(200).json(products)
      return res.status(404).json("Failed to fetch data")
})

router.post('/productupdate', async (req, res) => {
  try {
    console.log("Incoming update:", req.body);

    const { Productid,_id, ...updateData } = req.body;  

    const updatedProduct = await Product.findOneAndUpdate(
      { Productid },                     
      { $set: updateData },          
      { new: true }     
    );

    console.log("Updated product:", updatedProduct);

    res.status(200).json({ success: true, updatedProduct });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});
router.post('/deleteproduct',async(req,res)=>{
  const {Productid}=req.body
  try{
      const result=await Product.findOneAndUpdate({Productid},{$set:{status:0}})
      res.status(200).json(result)
  }catch(err){
          res.json(500).json({success:false,message:err})
  }
  
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.post('/uploadimage', upload.single('image'), (req, res) => {
  console.log(req.body,"image")
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file uploaded" });
  const imageUrl = `/Uploads/${file.filename}`;
  console.log(req.protocol,req.get('Host'))
  console.log(imageUrl)
  res.json({ imageUrl }); 
});

router.post('/addnewproduct',async(req,res)=>{
  console.log(req.body)
  const Newproduct=new Product({...req.body});
    await Newproduct.save()
    if(Newproduct)return res.status(200).json("Successfully added")
    return res.status(500).json('failed to share data')
})


router.post('/getcustomers',async(req,res)=>{
  const Customers=await User.find({role:'Customer'})
  console.log(Customers)
  const result=Customers.reduce((acc,curr)=>{
    acc.push({firstname:curr.firstname,lastname:curr.lastname,email:curr.email,status:curr.status,Block:curr.Block,userid:curr.userid})
    return acc
  },[])
  res.status(200).json(result)
})

router.post('/updatecustomer', async (req, res) => {
  try {
    const { userid, ...updateFields } = req.body;

    if (!userid) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedCustomer = await User.findOneAndUpdate(
      { userid },
      { $set: updateFields },
      { new: true } 
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'User not found' });
    }
 res.status(200).json({ message: 'Customer updated successfully', data: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/blockupdatecustomer',async(req,res)=>{
  console.log(req.body)
  const {Block,userid}=req.body
  const data=await User.findOneAndUpdate({userid},{$set:{Block}},{new: true} )
  if(data){
    res.status(200).json('Successfullyupdated')
  }else{
    res.status(400)
  }
})

router.post('/impersonate', async (req, res) => {
  try {
    const { email } = req.body;

     const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwttoken(user); 
    return res.json({ message: "Impersonation successful", user, token });

  } catch (err) {
    console.error('Error in impersonation:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/searchcustomer', async (req, res) => {
  try {
    const { search } = req.body;

    const Customers = await User.find({
      role: 'Customer',
      $or: [
        { firstname: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    });

    const result = Customers.map(curr => ({
      firstname: curr.firstname,
      lastname: curr.lastname,
      email: curr.email,
      status: curr.status,
      Block: curr.Block,
      userid: curr.userid
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/getallorders', async (req, res) => {
  try {
    console.log(req.body);

    const orders = await OrderSchema.find({});
    console.log(orders);

    const result = await Promise.all(
      orders.map(async (curr) => {
        const user = await User.findOne({ userid: curr.userid });
        return {
          ...curr._doc,  
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/fetchviewdatas',async(req,res)=>{
  console.log(req.body)
   const {userid}=req.body
   const orderdatas=await OrderSchema.find({userid})
   if(orderdatas){
    res.status(200).json(orderdatas)
   }else{
    res.status(409).json("Failed to fetch")
   }
})

router.post('/orderupdate', async (req, res) => {
  console.log("fsasdf",req.body,"gfas")
  const { orderid,_id, ...updatefields } = req.body;
  const result= await OrderSchema.findOneAndUpdate({orderid},{$set:updatefields})
  if(result){
    res.status(200).json("Updated successfully")
  }else{
    res.status(500).json("Failed")
  }
});


module.exports = router;