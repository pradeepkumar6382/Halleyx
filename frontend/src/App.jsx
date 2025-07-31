import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CustomerRegister from './Customer/CustomerRegister'
import CustomerLogin from './Customer/CustomerLogin'
import { AuthProvider, useAuth } from './Authentication/Auth'
import ProtectedRoute from './Authentication/Protectedroute'
import Dashboard from './Customer/Dashboard' 
import Cart from './Customer/Cart'
import Orders from './Customer/Orders'
import Profile from './Customer/Profilemanagement'
import Admindashboard from './Admin/AdminDashboard'
import { useState } from 'react'
import Adminproducts from './Admin/Adminproducts'
import Admincustomer from './Admin/Admincustomers'
import Adminorders from './Admin/Adminorders'
import Adminprofile from './Admin/Adminprofile'

function App() { 
   const [role,setrole]=useState(localStorage.getItem('role') || '') 
  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<CustomerRegister/>} />
      <Route path='/login' element={<CustomerLogin setrole={setrole}/>} />

      {role==='Customer' && <>
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>} />
      <Route path='/orders' element={<ProtectedRoute><Orders/></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>} />
      </>
      }
      {role==='admin' && <>
      <Route path='/admindashboard' element={<ProtectedRoute><Admindashboard/></ProtectedRoute>} />
      <Route path='/adminproducts' element={<ProtectedRoute><Adminproducts/></ProtectedRoute>} />
       <Route path='/admincustomers' element={<ProtectedRoute><Admincustomer setrole={setrole}/></ProtectedRoute>} />
       <Route path='/adminorders' element={<ProtectedRoute><Adminorders/></ProtectedRoute>} />
       <Route path='/adminprofile' element={<ProtectedRoute><Adminprofile/></ProtectedRoute>} />
      </>}
      
    </Routes>
    </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
