import { Routes,Route } from "react-router-dom";
import Community from "../pages/Community";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PublicRoutes from "../components/PublicRoutes";
import PrivateRoutes from "../components/PrivateRoutes"


const MainRoutes = () => {
  return (
      <Routes>
    <Route path="/" element={<PrivateRoutes> <Home/> </PrivateRoutes>}/>
    <Route path="/register" element={<PublicRoutes> <Register/> </PublicRoutes>}/>
    <Route path="/login" element={<PublicRoutes> <Login/> </PublicRoutes> }/>
</Routes>
  )
}

export default MainRoutes
