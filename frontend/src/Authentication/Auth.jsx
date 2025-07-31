import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null); 
  const [role,setrole]=useState(localStorage.getItem('role') || '')

   const login = (newToken,userid,role) => {
    setToken(newToken);
    setrole(role)
    localStorage.setItem("authToken",newToken);
    localStorage.setItem("userid",userid);
    localStorage.setItem("role",role)
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken"); 
    localStorage.removeItem("role");
    localStorage.removeItem('userid');
  };

   useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

 const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AuthContext };
