import { useEffect, useState } from "react";
import server from "../Authentication/Server";
import Navbar from "./Navbar";
import Halleyx from '../assets/halleyx-logo.svg';
import { useNavigate } from "react-router-dom";


const Successpopup=({setsuccess,message})=>{
    setTimeout(() => {
        setsuccess(false)
    }, 2000);
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="h-1/2 w-1/2 border border-black/50 shadow-green-600 shadow-md bg-white flex flex-col justify-center items-center rounded-xl text-xl">
          <video loading="lazy" className="h-1/2" muted="muted" playsinline="" src="https://cdnl.iconscout.com/lottie/premium/thumb/tick-icon-6200920-5056385.mp4" type="video/mp4" autoplay="autoplay" loop="loop"></video>             <h1>{message}</h1>
          </div>
        </div>
    )
}
const Profile = () => {
  const userid = localStorage.getItem('userid');
  const [user, setUser] = useState(null);
  const [message,setmessage]=useState(" ")
  const navigate=useNavigate()
  const [success,setsuccess]=useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPassword: '',
    confirm: ''
  });
   useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await server.post('/getuser', { userid });
        if (res.status === 200) {
          setUser(res.data);
          setFormData({
            firstname: res.data.firstname,
            lastname: res.data.lastname,
            email: res.data.email
          });
        } else {
          alert("No user found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userid]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
console.log(user,"user")
console.log(formData,"formdata")

const handlechangepassword=async()=>{
     if(passwordData.current && passwordData.newPassword && passwordData.confirm){
        try{
            await server.post('/changepassword',{...passwordData,userid:Number(userid)}).then((res)=>{
                       if(res.status===200){
                        setsuccess(true)
                        setmessage("Password change successfully")
                        navigate('/login')
                       }else{
                        alert("check the password please")
                    }
                    })
        }catch{((err)=>console.log(err))}
    }else{
        alert("please fill all the fields")
    }
}

const handlesave=async()=>{
    await server.post('/userupdate',{...formData,userid}).then((res)=>{
        if(res.status===200){
            setsuccess(true)
            setmessage("User updated successfully")
        }
    })
}
  return (
    <>
      <Navbar Halleyx={Halleyx} Highlight={'Profile management'}/>
      {success && <Successpopup setsuccess={setsuccess} message={message}/>}
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">My Profile</h2>

        {user ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition duration-300" onClick={handlesave}>
              Save Changes
            </button>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
            <div>
              <label className="block text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                name="current"
                value={passwordData.current}
                onChange={handlePasswordChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={passwordData.confirm}
                onChange={handlePasswordChange}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button className="mt-4 bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={handlechangepassword}>
              Change Password
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">No profile found</div>
        )}
      </div>
    </>
  );
};

export default Profile;
