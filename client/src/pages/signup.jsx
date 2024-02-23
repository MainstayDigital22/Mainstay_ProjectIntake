import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { HOST } from "../const";
import building from "../assets/building.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errmsg, setErr] = useState("");
  const navigate = useNavigate();
  async function signUp() {
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    axios
      .post(`${HOST}/user/signup`, {
        username,
        name: fullname,
        password,
        email,
        phone,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          navigate("/login", { state: { signupSuccess: true } });
        }
      })
      .catch((error) => {
        // Handle non-200 status and other errors
        const errMsg = error.response
          ? error.response.data
          : "An error occurred during sign up.";
        setErr(errMsg);
      });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp();
  };
  return (
    <div className="container-p">
      <div className="row limit">
        <div className="col-6 split">
          <img src={building} style={{ height: "100%" }} alt="Building" />
        </div>
        <div className="col-6 split">
          <form className="signup" onSubmit={handleSubmit}>
            <GlobalStyles />
            <div style={{ justifyContent: "center", textAlign: "center" }}>
              <h3>Sign Up</h3>
              <p style={{ fontSize: 11, marginTop: -6, color: "#999999" }}>
                Fill in the details to create your account
              </p>
            </div>

            <label>Username:</label>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />

            <label>Full Name:</label>
            <input
              type="text"
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
            />

            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <label>Confirm Password:</label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />

            <label>Email:</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <label>Phone:</label>
            <input
              type="tel"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />

            <button type="submit">Sign Up</button>
            {errmsg && <label style={{ color: "red" }}>{errmsg}</label>}

            <span
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: 12,
                fontSize: 15,
              }}>
              <p style={{ display: "inline-block" }}>
                Already have an account?&nbsp;&nbsp;
              </p>
              <a href="/login">
                <p style={{ display: "inline-block", color: "#0b59ef" }}>
                  Log In
                </p>
              </a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

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
