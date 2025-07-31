const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Pradeep6382:Pradeep123%40@cluster0.3ncvr.mongodb.net/Halleyx', {
    useNewUrlParser: true,  
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});



module.exports = mongoose;