import { useState } from "react";
import server from "../Authentication/Server";
import { useAuth } from "../Authentication/Auth";
import { useNavigate } from "react-router-dom";

const CustomerLogin = ({setrole}) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handlelogin = async () => {
    await server
      .post("/login", { ...loginData })
      .then((res) => {
        if (res.status === 200) {
          console.log("Login successful:", res.data);
          login(res.data.token, res.data.user.userid,res.data.user.role);
          setrole(res.data.user.role)
          alert("Login Successful");
          if(res.data.user.role==='Customer'){
            navigate('/dashboard')
          }else{
            navigate('/admindashboard')
          }
        } else {
          alert("Login Failed");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        alert("Check the mail and password and try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Customer Login
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <button
          onClick={handlelogin}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            className="hover:underline text-blue-600"
            onClick={() => alert("Password reset feature coming soon!")}
          >
            Forgot password?
          </button>
          <button
            className="hover:underline text-blue-600"
            onClick={() => navigate("/")}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
