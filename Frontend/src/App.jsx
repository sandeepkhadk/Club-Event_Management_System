import { Routes,Route } from 'react-router-dom'
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import AuthLayout from './components/auth/AuthLayout'
import Std_dash from './components/student/std_dash'
import Admin_dash from './components/admin/admin_dash'
import Navbar from './components/home/Navbar'
import Hero from './components/home/Hero'
import './App.css'

function App() {
  
  return (
    <>
    
    
    <Routes>
    {/* <Route path='/' element={AuthLayout}></Route> */}
       <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path='/student' element={<Std_dash></Std_dash>}></Route>
      <Route path='/admin' element={<Admin_dash></Admin_dash>}></Route>
      <Route path='/' element={<> <Navbar></Navbar><Hero></Hero> </>}></Route>
    </Routes>
    

    </>
  )
}

export default App
