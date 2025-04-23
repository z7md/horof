import { react } from "react";
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout(params) {
  
  localStorage.clear()
  return <Navigate to="/horof/login"/>
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register/>
}

function App () {
  return (
    <BrowserRouter>
    <Routes>
      <Route
      path="/horof"
      element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
          
       
      }
      />
      <Route path="/horof/login" element={<Login/>}/>
      <Route path="/horof/logout" element={<Logout/>}/>
      <Route path="/horof/register" element={<RegisterAndLogout/>}/>
      <Route path="/horof/*" element={<NotFound/>}/>

    </Routes>
    </BrowserRouter>
  )
}

export default App
