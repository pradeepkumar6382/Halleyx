import AdminNavbar from "./AdminNavbar";
import Halleyx from '../assets/halleyx-logo.svg';
import { useEffect,useState } from "react";
import server from "../Authentication/Server";

const Admindashboard=()=>{
    const [admindashboarddata,setadmindashboarddata]=useState({
        Totalproducts:0,
        TotalCustomers:0,
        Orders:{shipped:0,Processing:0,pending:0}
    })
    useEffect(()=>{
         const fetchcount=async()=>{
            await server.get('/fetchadmindashboardcount').then((res)=>{
                if(res.status===200){
                    console.log(res.data)
                    setadmindashboarddata(res.data)
                }else{
                    alert("Error fetching data")
                }
            }).catch((err)=>console.log(err))
         }
         fetchcount()
    },[])

    return (
        <>
         <AdminNavbar Halleyx={Halleyx} Highlight={'Admin dashboard'}/>
         <div className="h-screen bg-gray-100 m-0 flex flex-col items-center justify-center">
         <div className="w-[500px] mx-auto mt-20 p-6  rounded-2xl shadow-xl border border-gray-200 bg-green-200">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h2>

  <div className="space-y-4 text-lg font-medium text-gray-700">
    <div className="flex justify-between items-center">
      <span>Total Products</span>
      <span className="text-blue-600 font-semibold">{admindashboarddata.Totalproducts}</span>
    </div>

    <div className="flex justify-between items-center">
      <span>Total Customers</span>
      <span className="text-green-600 font-semibold">{admindashboarddata.TotalCustomers}</span>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Orders</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-100 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-800 font-semibold">Pending</p>
          <p className="text-lg font-bold">{admindashboarddata.Orders.pending}</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-800 font-semibold">Processing</p>
          <p className="text-lg font-bold">{admindashboarddata.Orders.Processing}</p>
        </div>
        <div className="bg-green-100 rounded-lg p-3 text-center">
          <p className="text-sm text-green-800 font-semibold">Shipped</p>
          <p className="text-lg font-bold">{admindashboarddata.Orders.shipped}</p>
        </div>
  </div>
            </div>
  </div>
</div>
     </div>
        </>
    )
}
export default Admindashboard;