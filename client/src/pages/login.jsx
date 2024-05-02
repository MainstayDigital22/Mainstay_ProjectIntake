import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import building from "../assets/images/building.jpg";
import { HOST } from "../const";
import { loginbg, logoblue } from "../assets";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errmsg, setErr] = useState("");
  const location = useLocation();
  const signupSuccess = location.state?.signupSuccess;
  function login(username, password) {
    axios
      .post(`${HOST}/user/login`, {
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
          axios.get(`${HOST}/user/${res.data.user}`).then((res2) => {
            window.location.href = "/review";
          });
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
        <GlobalStyles />
        <form className="login" onSubmit={handleSubmit}>
          <div
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginBottom: 58,
            }}>
            {signupSuccess && (
              <div className="successMessage">
                Signup successful! Please log in.
              </div>
            )}
            <img src={logoblue} style={{ width: 352 }} />
          </div>
          <div>
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
                justifyContent: "center",
                marginTop: 22,
                fontSize: 15,
              }}>
              <p style={{ display: "inline-block", color: "#C9C9C9" }}>
                Don't have an account?&nbsp;&nbsp;
              </p>
              <a href="/signup">
                <p style={{ display: "inline-block", color: "#0b59ef" }}>
                  Create One
                </p>
              </a>
            </span>
          </div>
        </form>
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
  --primary: #0C58EF;
  --error: #e7195a;
  
}
body {
  background-image: url(${loginbg});
  font-family: "Poppins";
}
.limit{
  height: 100vh;
}
header {
  background: #fff;
}
.container-p {
  width:99%;
  
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
  font-family: Satoshi;
  font-weight: 500;
  font-size:18px;
  display: block;
}
input {
  border: 1px solid #0C58EF;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}
form button {
  
  background: var(--primary);
  border: 0;
  color: #fff;
  width: 100%;
  padding: 10px;
  font-family: "Satoshi";
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
  width: 464px;
  margin:auto;
  padding: 48px 24px 48px 24px;
  background: #fff;
  border-radius: 4px;
  gap:56px;
}

.postreview{
    min-width: 400px;
    margin: 40px auto;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    
  }
`;
