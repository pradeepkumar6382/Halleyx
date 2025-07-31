import { useEffect, useState } from "react";
import server from "../Authentication/Server";
import Halleyx from '../assets/halleyx-logo.svg';
import { ShoppingCart, Heart } from "lucide-react";
import Navbar from "./Navbar"; 
import SuccessPopup from "./Successpopup"; 
import { useAuth } from "../Authentication/Auth";

const Cartcomponent = ({cart,setaddtocart,setcart,setShowPopup,showPopup,setLoading}) => {
    const userid=localStorage.getItem('userid')
    console.log(cart)
    const [quantity,setquantity]=useState(1) 
    const handlecart = async () => {
    const updatedProduct = {
    ...cart[0],
    quantity: quantity,
    totalPrice: (Number(cart[0].price) * quantity) ,
    userid:Number(userid),
  };
   setcart([updatedProduct]);
   try {
    const res = await server.post("/addtocart", {...updatedProduct,stockquantity:updatedProduct.stockquantity-quantity});
    // console.log("Sent to backend:", res.data);
    if(res.status===200){
        setShowPopup(true);
    }
  } catch (err) {
    console.error("Error sending to backend", err);
  }
}; 
  return ( 
    <>
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
     {cart.map((product)=>{
        return(
            <div key={product.productId} className="w-1/2 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 flex flex-col justify-between  border border-gray-100">
            <button className="flex flex-row-reverse align-end text-gray-400 hover:text-red-500 transition" onClick={() => {
                console.log("Close clicked");
                setaddtocart(false);
                }}
                >
            <svg   xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
             <img
              src={
                product.img?.startsWith('http')
                  ? product.img
                  : `http://localhost:8000${product.img}`
              }   alt={product.name}
            className="w-full h-48 object-contain mb-6 rounded-xl transition-transform duration-300 hover:scale-105"
          /> 

          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 text-base">${product.price * quantity}</p>

        <div className="flex items-center gap-4 mt-4">
  <span className="text-base font-medium">Quantity</span>

  <div className="flex items-center border rounded-lg overflow-hidden">
    <button
      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-lg font-semibold"
      onClick={() => {
        if (quantity > 1  ) {
          console.log(product.stockquantity-quantity)
          setquantity(quantity - 1);
        } else {
          alert("Minimum quantity is 1");
        }
      }}
    >
      −
    </button>

    <span className="px-4 py-1 text-lg border-x">{quantity}</span>

    <button
      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-lg font-semibold"
      onClick={() =>{ 
        if((product.stockquantity-quantity)>0){ 
        setquantity(quantity + 1)
        }else{
          alert("out of stock")
        }
       
      }}
    >
      +
    </button>
  </div>
</div>

          </div>
        <div className="flex items-center gap-4 mt-4">

        <h1>Stock Quantity: </h1><h2>{product.stockquantity-quantity+1}</h2>
        </div>
          
        <button
  disabled={product.stockquantity === 0}
  onClick={handlecart}
  className={`mt-6 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors duration-300 shadow-sm flex items-center gap-2 justify-center ${
    product.stockquantity === 0
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'
  }`}
>
  <ShoppingCart size={16} />
  {product.stockquantity === 0 ? 'Out of Stock' : 'Add to Cart'}
</button>
            </div>
        )
     })}
       {showPopup && (
        <SuccessPopup
          message="✅Product added to cart!"
          onClose={() => {
            setShowPopup(false); setaddtocart(false); setcart([]);
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 600);  
        }}
        />
      )}
    </div>
    </>
)}

const Dashboard = () => {
  const {logout}=useAuth()
    const [showPopup, setShowPopup] = useState(false);
    const [products, setProducts] = useState([]);
    const page=[1,2,3,4];
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(1)
    const [addtocart,setaddtocart]=useState(false)
    const [cart,setcart]=useState([]);
    const [showpage,setshowpage]=useState(true)
    const [productsearch,setproductsearch]=useState("")

    useEffect(() => {
    const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await server.post("/products", { limit: pagination });
      setProducts(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [pagination]);
 
const handlesearch=async()=>{
  console.log(productsearch)
 if (productsearch == '') {
  setshowpage(true)
  setPagination(1)
  try {
    const res = await server.post("/products", { limit: 1 });
    setProducts(res.data);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
  }else{
    setProducts([])
    setshowpage(false)
       await server.post('/productsearch',{product:productsearch}).then((res)=>{
    if(res.status===200){
      setProducts(res.data)  
    }else{
    alert("Error searching data")
    }
   })
   }  
}

  return (
    <div className="dashboard-container min-h-screen bg-gray-100 ">
    {addtocart && <Cartcomponent cart={cart} setaddtocart={setaddtocart} setcart={setcart} setShowPopup={setShowPopup} showPopup={showPopup} setLoading={setLoading} />}
   <Navbar Halleyx={Halleyx} Highlight={'Home'}/> 
   
  <div className="mt-10 p-10 ml-4 mb-4 flex flex-row items-center gap-4">
   <span className="w-1 h-6 bg-red-600 rounded origin-bottom scale-y-0 animate-[growUp_1.3s_ease-out_forwards]"></span>

   <h1 className="text-lg font-semibold animate-pulse">Products</h1>

   <div className="flex-grow"></div>


  <div className="flex items-center gap-2">
    <input
      type="text" 
      placeholder="Search products..."
      className="border border-gray-400 px-3 py-1 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 hover:scale-105"
      onBlur={(e)=>setproductsearch(e.target.value)}
    />
    <button className="text-sm text-gray-600 border border-gray-200 bg-green-800 px-2 py-1 rounded-md text-white font-semibold transition transition-all hover:scale-110 hover:shadow-xl" onClick={handlesearch}>Search</button>
  </div>
</div>

    {loading && (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
      )}
      {products.length === 0 && !loading && (
        <p className="text-center text-gray-500">No products available</p>
      )}

  {!loading && (
   <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product,index) =>(
        
        <div
          key={index}
          className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full border border-gray-100"
        >
           <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
            <Heart size={20} />
          </button>

        <img
  src={
    product.img?.startsWith('http')
      ? product.img
      : `http://localhost:8000${product.img}`
  }
  alt={product.name}
  className="w-full h-[500px] object-fill mb-6 rounded-xl transition-transform duration-300 hover:scale-105"
/>

          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 text-base">${product.price}</p>
          </div>

           <button onClick={()=>{setaddtocart(true),setcart([product])}} className="mt-6 bg-blue-600 text-white text-sm font-medium px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-sm flex items-center gap-2 justify-center">
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </div>
)}
     <div className="flex justify-center mt-6 gap-2 mb-6 bg-gray-100 p-4 rounded">
    {showpage && page.map((pg) => (
        <button
            key={pg}
            onClick={() => setPagination(pg)}
            className={`border px-4 py-2 rounded shadow transition-colors duration-300 ${
            pagination === pg ? "bg-blue-600 text-white" : "bg-white text-black hover:bg-blue-100"
            }`}
        >
            {pg}
        </button>
        ))}
      </div>
      <div className="flex flex-row justify-center mb-10">
      <button className="text-white border border-red-500 bg-red-500 px-3 py-2 rounded-xl shadow-xl font-semibold transition transition-all hover:bg-red-600 hover:text-white/80 font-mono" onClick={()=>logout()}>Logout</button>
      </div>
      <div className="bg-gray-800 text-white p-6 mt-10 text-center rounded-t-xl">
  <p className="text-sm">&copy; 2025 Halleyx. All rights reserved.</p>
  <div className="mt-2 flex justify-center gap-4 text-xs">
    <a href="#" className="hover:underline">Privacy Policy</a>
    <a href="#" className="hover:underline">Terms of Service</a>
    <a href="#" className="hover:underline">Contact</a>
  </div>
</div>
    </div>

  );
}

export default Dashboard;