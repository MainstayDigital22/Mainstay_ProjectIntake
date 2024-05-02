import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { HOST } from "../const";
import building from "../assets/images/building.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginbg } from "../assets";
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
        firstName: firstname,
        lastName: lastname,
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
          <div className="row">
            <div className="col">
              <label>First Name:</label>
              <input
                type="text"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
              />
            </div>
            <div className="col">
              <label>Last Name:</label>
              <input
                type="text"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />
            </div>
          </div>
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
              justifyContent: "center",
              marginTop: 22,
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
  );
};

export default SignUp;

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
