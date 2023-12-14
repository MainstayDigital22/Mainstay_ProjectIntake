import { Navigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode"
const Protected = ({ minauth, children }) => {
  function auth(ID){
    const storage = JSON.parse(localStorage.getItem('user'))
    const perm = storage.perm
    let expireTime = jwt_decode(storage.token).exp;
    //console.log(expireTime)
    return perm<=ID
  }
  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" replace />;
    }
  if (auth(minauth)) {
    return children;
    }
    return <Navigate to="/403" replace />;
};
export default Protected;