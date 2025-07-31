import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import server from "../Authentication/Server";
import Halleyx from "../assets/halleyx-logo.svg";

const Checkout = ({ checkoutdata,setcheckout,setCartData }) => {
  const userid=localStorage.getItem('userid')
  console.log("Checkout data:", checkoutdata);
  const [order, setOrder] = useState({
    addline1: "",
    addline2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  }; 
   
  const handleplaceorder=async()=>{
   if(order.addline1 && order.city && order.country && order.phone && order.state && order.zip){
    const checkoutdatanew={...checkoutdata[0],...order}
    await server.post('/addtoorder',{...checkoutdatanew}).then(async(res)=>{
      console.log(res.data)
      try{
        if(res.status===200 && res.data.message==="Order placed successfully"){
          await server.post('/cartupdate',{...checkoutdata[0],userid}).then((res)=>{
            console.log(res.data)
            if(res.status===200){
              setcheckout(false) 
              setCartData(res.data.cartData)
            }
          })
        }else if(res.status===200 && res.data.message==="Out of stock"){
          alert("out of stock")
        }
      }catch(err){
       console.log(err)
      }
    })
   }
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="border border-black bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        <button className="text-2xl float-right" onClick={()=>setcheckout(false)}>X</button>
        <h1 className="text-xl font-bold mb-4">Checkout</h1>
        
        <div className="space-y-2">
          <h2 className="font-semibold">Shipping Address</h2>
          <div className="flex flex-col gap-2">
            <label>Address Line 1</label>
            <input type="text" name="addline1" onChange={handleChange} className="border p-1" />
            
            <label>Address Line 2</label>
            <input type="text" name="addline2" onChange={handleChange} className="border p-1" />
            
            <label>City</label>
            <input type="text" name="city" onChange={handleChange} className="border p-1" />
            
            <label>State</label>
            <input type="text" name="state" onChange={handleChange} className="border p-1" />
            
            <label>ZIP</label>
            <input type="number" name="zip" onChange={handleChange} className="border p-1" />
            
            <label>Country</label>
            <input type="text" name="country" onChange={handleChange} className="border p-1" />
            
            <label>Phone</label>
            <input type="number" name="phone" onChange={handleChange} className="border p-1" />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          {checkoutdata && checkoutdata.length > 0 ? (
            checkoutdata.map((item, index) => (
              <>
              <div key={index} className="flex justify-between border-b py-1">
              <span>{item.name}</span>
              <span>${item.price} × {item.quantity}</span>
              </div>
              <div className="flex flex-row gap-2 mt-2 justify-between">
              <span>Subtotal</span> 
              <span className="font-bold">₹{item.price * item.quantity}</span>
             </div> 
             </>    
            ))
          ) : (
            <p>No items in checkout</p>
          )} 
          <button className="bg-green-300 float-right px-4 border border-gray-300 shadow-xl transition transition-all duration-200 ease-in-out hover:scale-110 rounded-md mt-2" onClick={handleplaceorder}>Place order</button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const userid = localStorage.getItem("userid");
  const [cartdata, setCartData] = useState([]);
  const [checkout,setcheckout]=useState(false)
  const [checkoutdata,setcheckoutdata]=useState([]) 

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await server.post("/cartdata", { userid });
        if (res.status === 200) {
          setCartData(res.data);
        } else {
          alert("Error fetching data");
        }
      } catch (error) {
        console.error("Fetch cart error:", error);
      }
    };

    fetchCartData();
  }, []);

  return (
    <>
      <Navbar Halleyx={Halleyx} Highlight={'Cart'}/>
      {checkout && <Checkout checkoutdata={checkoutdata} setcheckout={setcheckout}  setCartData={setCartData} />}
      <div className="max-w-3xl mx-auto p-4 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 mt-4">🛒Your Cart</h1>

        {cartdata.length === 0 ? (
          <p className="text-center text-gray-600 mt-20">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartdata.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                  <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">{item.name}</h2>
                    <p className="text-gray-600">Price: ${item.price}</p>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">Subtotal: ${item.price * item.quantity}</p>
                    <button className="border border-black bg-green-500 text-white px-5 rounded-lg py-2" onClick={()=>{setcheckout(true),setcheckoutdata([item])}}>Checkout</button>
                </div>
              </div>
            ))}

          
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
