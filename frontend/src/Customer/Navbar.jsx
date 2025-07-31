import {useEffect, useState } from "react";
import server from "../Authentication/Server";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/Auth";

const Navbar=({Halleyx,Highlight})=>{
  console.log("Navbar component rendered")
    const userid=localStorage.getItem('userid')
    const [cartcount,setCartcount]=useState(0)
    const navigate=useNavigate();
    const {logout}=useAuth()
    
   useEffect(() =>{
    const fetchcount=async()=>{
      const res= await server.post('/cartcount',{userid})
      if(res.status===200){
        setCartcount(res.data.count)
        console.log(res.data)
      }else{
        setCartcount(0)
      }
    }
    fetchcount()
},[]);

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-3 shadow-md border-b border-gray-300 bg-white">  <div className="w-28">
    <img src={Halleyx} alt="Halleyx Logo" className="object-contain w-full h-auto" />
  </div>

  <div className="flex gap-8 text-gray-700 text-md font-medium items-center">
  <nav className={Highlight==='Home'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer":'hover:text-red-600 transition duration-300 cursor-pointer'} onClick={() =>{navigate('/dashboard'); }}>
    Home
  </nav>
  <div className="flex flex-row">
  <nav className={Highlight==='Cart'?"px-1 hover:text-red-600 text-red-600 transition duration-300 cursor-pointer":'hover:text-red-600 transition duration-300 cursor-pointer'} onClick={() =>{navigate('/cart');  }}>
    Cart
   
  </nav>
 <button className="text-white text-sm bg-red-600 rounded-full w-6 h-6 flex items-center justify-center">
      {cartcount}
    </button>
    </div>
  <nav className={Highlight==='Orders'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer":'hover:text-red-600 transition duration-300 cursor-pointer'} onClick={() =>{navigate('/orders'); }}>
    Orders
  </nav>

  <nav className={Highlight==='Profile management'?"hover:text-red-600 text-red-600 transition duration-300 cursor-pointer":'hover:text-red-600 transition duration-300 cursor-pointer'} onClick={() =>{navigate('/profile');}}>
    Profile
  </nav>

  <nav className="hover:text-gray-600 hover:scale-110 hover:shadow-xl transition duration-300 cursor-pointer border border-red-400 bg-red-500 px-2 py-2 rounded-xl text-white" onClick={() => logout()}>
    Logout
  </nav>
</div>

</div>
    )
}

export default Navbar;