import {useEffect, useState } from "react";
import server from "../Authentication/Server";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/Auth";

const AdminNavbar=({Halleyx,Highlight})=>{
  const {logout}=useAuth()
   console.log("Navbar component rendered")
    const userid=localStorage.getItem('userid')
    const navigate=useNavigate();

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-3 shadow-md border-b border-gray-300 bg-white">  <div className="w-28">
    <img src={Halleyx} alt="Halleyx Logo" className="object-contain w-full h-auto" />
  </div>

  <div className="flex gap-8 text-gray-700 text-md font-medium items-center">
  <nav className={Highlight==='Admin dashboard'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer":'hover:text-red-600 transition duration-300 cursor-pointer'} onClick={() =>{navigate('/admindashboard')}}>
    Admin Dashboard
  </nav>

  <nav className={Highlight==='Admin products'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer flex items-center gap-1" : "hover:text-red-600 transition duration-300 cursor-pointer flex items-center gap-1"} onClick={() => navigate('/adminproducts')}>
    Products
  </nav>

  <nav className={Highlight==='Admin customer'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer flex items-center gap-1" : "hover:text-red-600 transition duration-300 cursor-pointer flex items-center gap-1"} onClick={() => navigate('/admincustomers')}>
    Customers
  </nav>

  <nav className={Highlight==='Admin orders'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer flex items-center gap-1" : "hover:text-red-600 transition duration-300 cursor-pointer flex items-center gap-1"} onClick={() => navigate('/adminorders')}>
    Orders
  </nav>

  <nav className={Highlight==='Admin profile'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer flex items-center gap-1" : "hover:text-red-600 transition duration-300 cursor-pointer flex items-center gap-1"} onClick={() => navigate('/adminprofile')}>
    Settings
  </nav>
    <nav className="hover:text-gray-600 hover:scale-110 hover:shadow-xl transition duration-300 cursor-pointer border border-red-400 bg-red-500 px-2 py-2 rounded-xl text-white" onClick={() => logout()}>
    Logout
  </nav>
</div>

</div>
    )
}

export default AdminNavbar;