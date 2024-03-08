import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";
const Protected = ({ perms, children }) => {
  function auth(perms) {
    const storage = JSON.parse(localStorage.getItem("user"));
    const perm = storage.perm;
    let expireTime = jwt_decode(storage.token).exp;
    //console.log(expireTime)
    return perms.includes(perm);
  }
  const ignoredPaths = ["/403", "/login", "/signup"];
  if (
    !localStorage.getItem("user") &&
    !ignoredPaths.includes(window.location.pathname)
  ) {
    return <Navigate to="/login" replace />;
  }
  if (auth(perms)) {
    return children;
  }
  return <Navigate to="/" replace />;
};
export default Protected;
