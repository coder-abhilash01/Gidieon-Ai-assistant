import { Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import { useAppContext } from "../context/AppContext";
const PrivateRoutes = ({children})=> {

    const {isAuthenticated} = useAppContext()
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
    return children
}

export default PrivateRoutes