import { useEffect, useState } from "react";
import Halleyx from '../assets/halleyx-logo.svg';
import AdminNavbar from "./AdminNavbar";
import DataTable from 'react-data-table-component';
import server from "../Authentication/Server"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons'

const Productmodal=({setproductmodal,setrender})=>{
    const [newproductdata,setnewproductdata]=useState({name:'',price:'',stockquantity:''})
    const [imageUrl,setImageUrl]=useState()

    const handleChange = (e) => {
    const { name, value } = e.target;
    setnewproductdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit=async()=>{
         await server.post('/addnewproduct',{...newproductdata,img:imageUrl,price:Number(newproductdata.price),stockquantity:Number(newproductdata.stockquantity)}).then((res)=>{
          if(res.status===200){
            setproductmodal(false)
            setrender(prev=>!prev)
          }else{
            alert(res.data)
          }
         })
    }

  const handleImageChange = async (e) => {

    const file = e.target.files[0];
    console.log(file)
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData)

   try {
    const res = await server.post('/uploadimage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const data = res.data; 
    setImageUrl(data.imageUrl);
  }  catch (err) {
      console.error("Upload error:", err); 
    }
  };
    return (
        <>
      <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-xl w-[400px] space-y-4">
      <h2 className="text-xl font-semibold text-center">Add new Product</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
     { imageUrl && <img
          src={`http://localhost:8000${imageUrl}`}
          alt="Uploaded"
          className="w-40 h-40 object-cover rounded border"
        />}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="text"
            name="name"
            value={newproductdata.name}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Price</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="number"
            name="price"
            value={newproductdata.price}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Stock Quantity</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="number"
            name="stockquantity"
            value={newproductdata.stockquantity}
            onChange={handleChange}
          />
           <label className="text-sm font-medium">Category</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="text"
            name="category"
            value={newproductdata.category}
            onChange={handleChange}
          />
            <label className="text-sm font-medium">Description</label>
          <input
            className="border border-gray-300 px-3 py-4 rounded"
            type="text"
            name="description"
            value={newproductdata.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={()=>setproductmodal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
           onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New product
          </button>
        </div>
      </div>
    </div>
        </>
    )
}



const Editmodal = ({ editdata, seteditmodal,setrender}) => {

  const [formData, setFormData] = useState({
    name: editdata.name,
    price: editdata.price,
    stockquantity: editdata.stockquantity,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async() => {
    await server.post('/productupdate',{...editdata,...formData,price:Number(formData.price),stockquantity:Number(formData.stockquantity)}).then((res)=>{
        if(res.status===200){
       alert('Updated')
        seteditmodal(false)
         setrender(prev => !prev)
        }else{
            alert("Failed to update,Try again Later...")
        }
    })
  } ;

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-xl w-[400px] space-y-4">
        <h2 className="text-xl font-semibold text-center">Edit Product</h2>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Price</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Stock Quantity</label>
          <input
            className="border border-gray-300 px-3 py-1 rounded"
            type="number"
            name="stockquantity"
            value={formData.stockquantity}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={()=>seteditmodal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const Adminproducts=()=>{
    const columns = [
	{
		name: 'Productid',
		selector: row => row.Productid,
	},
	{
		name: 'Name',
		selector: row => row.name,
	},
  {
    name: (
      <div className="group inline-flex items-center gap-1">
        Price
        <FontAwesomeIcon
          icon={faFilter}
          className="group-hover:hidden transition-opacity duration-200"
        />
      </div>
    ),
    selector: row => `$${row.price}`,
    sortable: true,
  },
     {
		name: 'Stock Quantity',
		selector: row =>row.stockquantity,
	},
     {
        name: 'Actions',
        cell: row => (
            <div className="w-screen">
                <button 
                  onClick={() =>{
                    console.log(row);
                    seteditmodal(true)
                    seteditdata(row)
                }} 
                  className="px-3 py-1 mb-1 mt-6 w-20 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                    Edit
                </button>
                <button 
                  onClick={async() => {
                    await server.post('/deleteproduct',{Productid:row.Productid}).then((res)=>{
                        if(res.status===200){
                            setrender(prev=>!prev)
                        }
                    })
                }} 
                  className="px-3 w-20 mb-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                    Delete
                </button>
            </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
];
    const [products,setproducts]=useState([])
    const [editmodal,seteditmodal]=useState(false)
    const [editdata,seteditdata]=useState([])
    const [render,setrender]=useState(false)
    const [productsearch,setproductsearch]=useState("")
    const [productmodal,setproductmodal]=useState(false)

    useEffect(()=>{
     const fetchdata=async()=>{
      await server.get('/getproducts').then((res)=>{
       setproducts(res.data)
      })
     }
     fetchdata()
    },[render])
   console.log(products)

    const handlesearch=async()=>{
     await server.post('/productsearch',{product:productsearch}).then((res)=>{
    if(res.status===200){
      setproducts(res.data)  
    }else{
    alert("Error searching data")
    }
   }) }
    return (
       <>
  {editmodal && (
    <Editmodal
      editdata={editdata}
      seteditmodal={seteditmodal}
      setrender={setrender}
    />
  )}
  {productmodal && <Productmodal setproductmodal={setproductmodal} setrender={setrender}/>}
  <AdminNavbar Halleyx={Halleyx} Highlight={'Admin products'} />
  <div className="flex justify-center mt-20 gap-6">
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Search products..."
        className="border border-gray-400 px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        onBlur={(e) => setproductsearch(e.target.value)}
      />
      <button
        onClick={handlesearch}
        className="text-sm bg-green-700 text-white px-4 py-2 rounded-md font-semibold hover:scale-105 hover:shadow-md transition-all"
      >
        Search
      </button>
    </div>
     <button
       onClick={()=>setproductmodal(true)}
        className="text-sm bg-green-700 text-white px-4 py-2 rounded-md font-semibold hover:scale-105 hover:shadow-md transition-all"
      >
        Add New Product
      </button>
  </div>

   <div className="flex flex-col items-center justify-center">
    <div className="mt-10 w-full max-w-4xl border border-black/20 shadow-xl rounded-xl overflow-hidden">
      <DataTable
        columns={columns}
        data={products}
        pagination
        paginationPerPage={20}
      />
    </div>
  </div>
</>

    )
}

export default Adminproducts;