import AdminNavbar from "./AdminNavbar"
import Halleyx from '../assets/halleyx-logo.svg';
import { useEffect, useState } from "react";
import server from "../Authentication/Server";
import DataTable from 'react-data-table-component';


const Viewmodal = ({ viewdata, setviewmodal, setviewdata }) => {
  const [orderdatas, setorderdatas] = useState([]);
  const [neworderdatas,setneworderdatas]=useState({})


  const handlesave=async(order,deletedata)=>{
   console.log(deletedata)
   const payload=deletedata?{status:0}:''
   const {userid,orderid}=order
   const res=await server.post('/orderupdate',{...neworderdatas,userid,orderid,...payload})
   if(res.status===200){
    setviewmodal(false)
   }
  }

  useEffect(() => {
    const fetchviewdata = async () => {
      try {
        const res = await server.post("/fetchviewdatas", { ...viewdata });
        if (res.status === 200) {
          console.log(res.data)
          setorderdatas(res.data);
        } else {
          alert(res.data);
        }
      } catch (err) {
        console.error("Error fetching data", err);
        alert("Something went wrong.");
      }
    };

    fetchviewdata();
  }, []);
console.log(neworderdatas)
  return (
    <div className="h-screen fixed z-50 w-screen bg-black/50 backdrop-blur-md flex items-center justify-center overflow-auto p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-center">View All Orders</h2>

        {orderdatas && orderdatas.map((order, index) => (
          <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Order #{order._id || index + 1}</h3>

            <div className="mb-3">
              <h4 className="font-medium mb-1">Products:</h4>
             
                <div key={index} className="flex justify-between text-sm border-b py-1">
                  <span>{order.name}</span>
                  <span>Qty: {order.quantity}</span>
                  <span>${order.totalPrice}</span>
                </div>
        
            </div>
            <div className="mb-3">
              <h4 className="font-medium">Billing & Shipping:</h4>
             Address line 1 <input type="text" defaultValue={order?order.addline1:''}  name="addline1"
             className="border border-black" 
             onBlur={(e)=>{setneworderdatas((prev)=>({...prev,addline1:e.target.value}))}} 
             />
             <div >
             <span>City:</span><input className="border border-black" 
             onBlur={(e)=>setneworderdatas((prev)=>({...prev,city:e.target.value}))} defaultValue={order.city}/>
              </div>
              <div>
              State: <input  className="border border-black" 
              onBlur={(e)=>setneworderdatas((prev)=>({...prev,state:e.target.value}))} defaultValue={order.state} />
              </div>
             <div>
              ZIP: <input className="border border-black" onBlur={(e)=>setneworderdatas((prev)=>({...prev,zip:e.target.value}))} name="zip" defaultValue={order.zip} /> 
             </div>

            </div>
           <div className="mb-3">
              <label className="font-medium mr-2">Status:</label>
           {order.status===1 &&
           <select defaultValue={order.orderstatus} className="border rounded p-1" name='orderstatus'
             onChange={(e)=>{setneworderdatas((prev)=>({...prev,orderstatus:e.target.value}))}} 
              >
                <option name='Shipped' value="Shipped">Shipped</option>
                <option name='Processing' value="Processing">Processing</option>
                <option name='Completed' value="Completed">Completed</option>
              </select>}
            {order.status===0 && <button disabled className="border border-black bg-gray-100 font-semibold px-2 cursor-not-allowed">Cancelled</button>}
            </div> 
            <div className="flex gap-3 justify-end mt-4">
              <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={()=>handlesave(order)}>Save</button> 
              
             <button
                onClick={() => handlesave(order,"delete")}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <div className="text-center">
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
            onClick={() => setviewmodal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const Adminorders=()=>{
    const [orders,setorders]=useState()
    const [viewmodal,setviewmodal]=useState(false)
    const [viewdata,setviewdata]=useState() 


    const columns = [
      {
        name: '#',
        selector: (row, index) => index + 1,
        width: '60px'
      },
      {
        name: 'Order ID',
        selector: row => row.orderid,
        sortable: true
      },
      {
        name: 'Customer',
        selector: row => row.firstname + ' '+ row.lastname,
        sortable: true
      },
      {
        name: 'Status',
        selector: row => row.orderstatus,
        sortable: true,
        cell: row => (
          <span
            className={`px-2 py-1 rounded text-white text-sm ${
              row.orderstatus === 'Processing'
                ? 'bg-yellow-500'
                : row.orderstatus === 'Shipped'
                ? 'bg-blue-500'
                : row.orderstatus === 'Pending'
                ? 'bg-green-600'
                : row.status===0 ? 'bg-red-600' :'bg-gray-400'
            }`}
          >
            {row.status===1?row.orderstatus:"Cancelled"}
          </span>
        )
      },
      {
        name: 'Total',
        selector: row => `$${row.totalPrice}`,
        sortable: true
      },
      {
        name: 'Actions',
        cell: row => (
          <div className="flex flex-col gap-2">
            <button onClick={()=>{setviewmodal(true); setviewdata(row)}} className="mt-4 hover:underline bg-blue-500 border border-blue px-4 py-2 rounded-xl text-white shadow-sm">View</button>
            <button onClick={async()=>{
              console.log(row)
              const res=await server.post('/orderupdate',{...row,status:0})
                  if(res.status===200){
                    fetchdata()
                  }

            }} className="mb-4 hover:underline bg-red-500 border border-blue px-4 py-2 rounded-xl text-white shadow-sm">Delete</button>
          </div>
        )
      }
    ];
    const fetchdata=async()=>{
        const res=await server.post('/getallorders')
        if(res.status===200){
        setorders(res.data)
        }else{
            alert("Error fetching data")
        }
        }
        
    useEffect(()=>{
       fetchdata()
        },[])

    return (
        <>
        <AdminNavbar Halleyx={Halleyx} Highlight={"Admin orders"}/>
        {viewmodal && <Viewmodal  viewdata={viewdata} setviewdata={setviewdata} setviewmodal={setviewmodal}/>}
        <div className="pt-20 min-h-screen bg-gray-100 px-4">
        <div className="max-w-6xl mx-auto border border-gray-400 shadow-xl">
        <DataTable
        columns={columns}
        data={orders}
        pagination
        paginationPerPage={20}
        />
      </div>
      </div>
      </>
    )
}
export default Adminorders