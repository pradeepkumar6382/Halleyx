const express= require('express');
const app = express();
const routes=require('./Routes/Routes');
const cors = require('cors');
app.use(cors());
const db = require('./Routes/dbconnection');
app.use(express.json());
const path = require('path');


app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/', routes);

