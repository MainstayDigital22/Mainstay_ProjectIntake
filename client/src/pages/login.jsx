import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import building from "../assets/building.jpg";
import { HOST } from "../const";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errmsg, setErr] = useState("");
  const location = useLocation();
  const signupSuccess = location.state?.signupSuccess;
  function login(username, password) {
    axios
      .post(`http://${HOST}:8080/user/login`, {
        username: username,
        password: password,
      })
      .then(async (res) => {
        console.log(res);
        if (res.status == 200) {
          const user = await JSON.stringify(res.data);
          await localStorage.setItem("user", user);
          const json = await JSON.parse(localStorage.getItem("user"));
          console.log(json);
          axios.get(`http://${HOST}:8080/user/${res.data.user}`).then((res2)=>{
            if(res2.data[0].onboard){
              window.location.href = "/";
            }else{
              window.location.href = "/onboard";
            }
            
          })
          
        }
      })
      .catch(async (err) => {
        setErr(err.response.data);
      });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="container-p">
      <div className="row limit">
        <div className="col-6 split">
          <img src={building} style={{ height: "100%" }} />
        </div>
        <GlobalStyles />
        <div className="col-6 split">
          <form className="login" onSubmit={handleSubmit}>
            <div style={{ justifyContent: "center", textAlign: "center" }}>
              {signupSuccess && (
                <div className="successMessage">
                  Signup successful! Please log in.
                </div>
              )}
              <h3>Log In</h3>
              <p style={{ fontSize: 11, marginTop: -6, color: "#999999" }}>
                Enter your credentials to get started
              </p>
            </div>

            <label>Username:</label>
            <input
              type="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button>Log in</button>
            {errmsg ? <label style={{ color: "red" }}>{errmsg}</label> : <></>}
            <span
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: 12,
                fontSize: 15,
              }}>
              <p style={{ display: "inline-block" }}>
                Need an account?&nbsp;&nbsp;
              </p>
              <a href="/signup">
                <p style={{ display: "inline-block", color: "#0b59ef" }}>
                  Sign Up
                </p>
              </a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

const GlobalStyles = createGlobalStyle`
/* google font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap');

/* layout */
:root {
  --primary: #0b59ef;
  --error: #e7195a;
}
body {
  background: #f1f1f1;
  font-family: "Poppins";
}
.limit{
  height: 100vh;
}
header {
  background: #fff;
}
.container-p {
  width:98%;
}
header a {
  color: #333;
  text-decoration: none;
}
.successMessage {
  color: #77cc77;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 15px;
  margin: auto;
  margin-bottom:10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.split{
  height:100%;
  display:flex;
  justify-content:center;
  overflow:hidden;
}

/* new workout form */
label, input {
  
  display: block;
}
input {
  
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
form button {
  
  background: var(--primary);
  border: 0;
  color: #fff;
  width: 100%;
  padding: 10px;
  font-family: "Poppins";
  border-radius: 4px;
  cursor: pointer;
}
div.error {
  padding: 10px;
  background: #ffefef;
  border: 1px solid var(--error);
  color: var(--error);
  border-radius: 4px;
  margin: 20px 0;
}
input.error {
  border: 1px solid var(--error);
}

nav a, nav button {
  margin-left: 10px;
}
nav button {
  background: #fff;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 6px 10px;
  border-radius: 4px;
  font-family: "Poppins";
  cursor: pointer;
  font-size: 1em;
}

/* auth forms */
form.signup, form.login {
  width: 400px;
  margin:auto;
  padding: 20px 20px 0px 20px;
  background: #fff;
  border-radius: 4px;
}

.postreview{
    min-width: 400px;
    margin: 40px auto;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
  }
`;
