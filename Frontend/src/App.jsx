import { Routes,Route } from 'react-router-dom'
import './App.css';
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import Std_dash from './components/Member/member_dash'
import Admin_dash from './components/admin/admin_dash'
import PrivateRoute from './components/auth/privateroutes'
import Unauth from './components/auth/unauth'
import NotFound from './components/auth/notfound'
import PublicRoute from './components/auth/publicroute'
import './App.css'
import Hero from './components/home/hero'
import Navbar from './components/home/navbar'
import Club from './components/event-club/club'
import EventPage from './components/event-club/event';    
import About from './components/home/About'
function App() {
 
  return (
    <>
    
    <Routes>
        <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/clubs" element={<Club/>} />
            <Route path="/events" element={<EventPage/>} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={
             <><Navbar></Navbar><Hero></Hero></>}/>
        </Route>
       
       
        <Route path='*' element={<NotFound></NotFound>}></Route>
          
        <Route path='/unauthorized' element={<Unauth></Unauth>}></Route>
  
        <Route element={<PrivateRoute  allowedRoles={["admin"]} />}>
          <Route path='/admin' element={<Admin_dash></Admin_dash>}></Route>
        </Route>
        <Route element={<PrivateRoute  allowedRoles={["student"]} />}>
          <Route path='/student' element={<Std_dash></Std_dash>}></Route>
        </Route>
     
     
    </Routes>

  </>
  )
}

export default App