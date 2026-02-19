import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import RegisterForm from './components/auth/RegisterForm'
import LoginForm from './components/auth/LoginForm'
import StudentDashboard from './components/Member/member_dash'
import AdminDashboard from './components/admin/AdminDashboard'
import PrivateRoute from './components/auth/privateroutes'
import Unauth from './components/auth/unauth'
import NotFound from './components/auth/notfound'
import PublicRoute from './components/auth/publicroute'
import Hero from './components/home/Hero'
import Navbar from './components/home/Navbar'
import Club from './components/event-club/club'
import EventPage from './components/event-club/event'
import About from './components/home/About'
import SuperAdminPage from './components/admin/superadmin'
import Contact from './components/home/Contact'
function App() {
 
  return (
    <>
    
      <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/clubs" element={<Club />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />  {/* Fixed */}
        <Route path="/" element={
          <><Navbar/><Hero/><About/><EventPage/><Club/><Contact/></>
        }/>
      </Route>
    

       
       
        <Route path='*' element={<NotFound></NotFound>}></Route>
          
        <Route path='/unauthorized' element={<Unauth></Unauth>}></Route>
  
        <Route element={<PrivateRoute  allowedRoles={["admin"]} />}>
          <Route path='/admin' element={<SuperAdminPage></SuperAdminPage>}></Route>
        </Route>
        <Route element={<PrivateRoute allowedRoles={["member"]} />}>
         <Route path="/student/:clubId" element={<AdminDashboard />} />
         </Route>
       
      <Route element={<PrivateRoute  allowedRoles={["unmember"]} />}>
          <Route path='/student' element={<StudentDashboard></StudentDashboard>}></Route>
     </Route>
    </Routes>

  </>
  )
}

export default App;