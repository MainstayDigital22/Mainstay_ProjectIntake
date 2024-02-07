import { Navigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const Protected = ({ perms, children }) => {
  function auth(perms) {
    const storage = JSON.parse(localStorage.getItem("user"));
    const perm = storage.perm;
    let expireTime = jwt_decode(storage.token).exp;
    //console.log(expireTime)
    return perms.includes(perm);
  }
  if (!localStorage.getItem("user")) {
    return <Navigate to="/login" replace />;
  }
  if (auth(perms)) {
    return children;
  }
  return <Navigate to="/login" replace />;
};
export default Protected;
