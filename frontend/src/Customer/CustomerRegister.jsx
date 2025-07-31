import { useState } from "react";
import server from "../Authentication/Server";
import { useNavigate } from "react-router-dom";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [registerdata, setregisterdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const handlechange = (e) => {
    setregisterdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async () => {
    if (registerdata.firstname && registerdata.email && registerdata.password) {
      await server
        .post("/register", { ...registerdata })
        .then((res) => {
          if (res.status === 200) {
            alert("Registration Successful");
            navigate("/login");
          } else {
            alert("Registration Failed");
          }
        })
        .catch((err) => {
          console.error("Error during registration:", err);
          alert("An error occurred during registration. Please try again.");
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create Your Account
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              type="text"
              name="firstname"
              value={registerdata.firstname}
              onChange={handlechange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={registerdata.lastname}
              onChange={handlechange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={registerdata.email}
              onChange={handlechange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={registerdata.password}
              onChange={handlechange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <button
          onClick={handleRegister}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Register
        </button>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
