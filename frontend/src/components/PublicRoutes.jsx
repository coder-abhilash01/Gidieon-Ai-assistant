import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PublicRoutes = ({children}) => {
    const {isAuthenticated} = useAppContext()
if(isAuthenticated){return <Navigate to="/" replace />}
return children
  
}

export default PublicRoutes
