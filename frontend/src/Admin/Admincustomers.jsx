import { useEffect, useState } from "react";
import Halleyx from '../assets/halleyx-logo.svg';
import AdminNavbar from "./AdminNavbar";
import server from "../Authentication/Server";
import DataTable from 'react-data-table-component';
import { useAuth } from "../Authentication/Auth";
import { useNavigate } from "react-router-dom";

const Viewmodal = ({ edit,setedit,setviewmodal }) => {
  if (!edit) return null;
   const handlechange=(e)=>{
            setedit((edit)=>({...edit,[e.target.name]:e.target.value}))
    }
   const handleupdatedata=async()=>{
       const res= await server.post('/updatecustomer',{...edit,status:Number(edit.status)})
       if(res.status===200){
        setviewmodal(false)
       }
   }
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[320px]">
        <h2 className="text-lg font-semibold mb-4 text-center">User Details</h2>

         <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={edit.firstname || ''}
            name='firstname'
            onChange={(e)=>handlechange(e)}
            className="w-full px-3 py-1 border border-gray-300 rounded bg-gray-100"
          />
          <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Last Name</label>
          <input
            type="text"
            value={edit.lastname || ''}
            name='lastname'
            onChange={(e)=>handlechange(e)}
            className="w-full px-3 py-1 border border-gray-300 rounded bg-gray-100"
          />
        </div>

         <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            value={edit.email || ''}
            name='email'
            onChange={(e)=>handlechange(e)}
            className="w-full px-3 py-1 border border-gray-300 rounded bg-gray-100"
          />
        </div>

         <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
         <select
            value={edit.status}
            name="status"
            onChange={handlechange}
            className="w-full px-3 py-1 border border-gray-300 rounded bg-gray-100"
            >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
         </select>
        </div>

         <div className="text-center ">
          <button
            onClick={()=>setviewmodal(false)}
            className="mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Close
          </button>
          <button
            onClick={handleupdatedata}
            className="mt-4 ml-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};


const Admincustomer=({setrole})=>{
    const [customer,setcustomer]=useState([])
    const [search,setsearch]=useState([])
    const [edit,setedit]=useState()
    const [viewmodal,setviewmodal]=useState(false)
     const {logout}=useAuth()
     const {login}=useAuth()
     const navigate=useNavigate()
        const columns = [
	{
		name: 'Name',
		selector: row => row.firstname +' '+ row.lastname,
	},
	{
		name: 'Email',
		selector: row => row.email,
	},
    {
  name: 'Status',
  cell: row => {
    console.log(row.status,row.Block)
    if (row.status === 1 && row.Block === false) {
      return <span className="text-green-600 font-semibold">Active</span>;
    } else if (row.status === 1 && row.Block === true) {
      return <span className="text-red-600 font-semibold">Blocked</span>;
    } else if (row.status === 0 && row.Block === false) {
      return <span className="text-gray-600 font-semibold">Inactive</span>;
    } else if(row.status===0 && row.Block===true) {
      return <span className="text-yellow-600 font-semibold">Blocked</span>;
    }
  }
},
     {
        name: 'Actions',
        cell: row => (
            <div className="w-screen">
                <button disabled={row.Block}
                  onClick={() =>{
                    setedit(row)
                    setviewmodal(true)
                }} 
                  className={!row.Block?"px-3 py-1 mb-1 mt-6 w-20 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  :"px-3 py-1 mb-1 mt-6 w-20 bg-gray-500 text-white rounded hover:bg-gray-500 text-sm cursor-not-allowed"
                  }>
                View
                </button>
                <button className="px-3 w-20 mb-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                onClick={async()=>{
                   const res= await server.post('/blockupdatecustomer',{userid:row.userid,Block:row.Block?false:true})
                   if(res.status===200){
                    fetchdata()
                   }else{
                    alert("Failed to update")
                   }
                }}
                >{row.Block?"UnBlock":"Block"}
                </button>
                 <button onClick={async()=>{
               const res= await server.post('/impersonate',{...row})
               if(res.status===200){
                console.log(res.data)
                logout()
                navigate('/dashboard')
                login(res.data.token,res.data.user.userid,res.data.user.role)
                setrole(res.data.user.role)
               }
                 }} className="px-0 w-20 mb-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >Impersonate
                </button>
            </div>
        ),
        button: true,
    },
        ];

  const fetchdata=async()=>{
       const res= await server.post('/getcustomers')
       if(res.status===200){ 
        console.log(res.data)
        setcustomer(res.data)
       }
    }
    useEffect(()=>{
  
    fetchdata()
    },[])
const handlesearch=async()=>{
    if(search===''){return fetchdata()}
const res=await server.post('/searchcustomer',{search})
if(res.status===200){
   setcustomer(res.data)
}else{
    alert("error fetching data")
}
}
console.log(search)
    return (
       <>
       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
       <AdminNavbar Halleyx={Halleyx} Highlight="Admin customer" className='fixed'/>
       {viewmodal&&<Viewmodal edit={edit} setedit={setedit}  setviewmodal={setviewmodal}/>}
       </div>


       <div className="pt-20 min-h-screen bg-gray-100 px-4">
       <div className="max-w-6xl mx-auto">
       <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        👥 Customer Management
       </h1>
<input className="border border-black bg-gray-200 rounded-sm mb-2" placeholder="Search name/Email" onChange={(e)=>setsearch(e.target.value)}/>
<button className="border border-blue-300 bg-blue-300 shadow-xl shadow-blue-200 ml-2 px-3 rounded-xl text-white font-semibold text-shadow-black " 
onClick={handlesearch}>Search</button>
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <DataTable
          columns={columns}
          data={customer}
          pagination
          paginationPerPage={20}
          highlightOnHover
          pointerOnHover
          responsive
        />
      </div>
    </div>
  </div>
</>

    )
}

export default Admincustomer;