import { Navigate } from 'react-router-dom';

function ProtectedRoute ({ element: Component, ...rest }) {
  const token = localStorage.getItem('token');
  
  return token ? <Component {...rest} /> : <Navigate to="/teacher-login" />;
}

export default ProtectedRoute;
