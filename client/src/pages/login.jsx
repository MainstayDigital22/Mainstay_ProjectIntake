import { useState } from "react";
import axios from "axios";
import { createGlobalStyle } from "styled-components";
import { HOST } from "../const";
import { getAuthUser } from "../components/auth";
const GlobalStyles = createGlobalStyle`
/* google font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;800&family=VT323&display=swap');

/* layout */
:root {
  --primary: #1aac83;
  --error: #e7195a;
}
body {
  background: #f1f1f1;
  margin: 0;
  font-family: "Poppins";
}
header {
  background: #fff;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
header a {
  color: #333;
  text-decoration: none;
}
.pages{
  max-width: 1400px;
  padding: 20px;
  margin: 0 auto;
}

/* homepage */
.home {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 100px;
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

/* navbar */
nav {
  display: flex;
  align-items: center;
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
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errmsg, setErr] = useState("");
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

          axios.get("https://api.ipify.org/?format=json").then((res) => {
            axios
              .post(`http://${HOST}:8080/log/add`, {
                username: getAuthUser(),
                action: "Login",
                comments: `User ${getAuthUser()} login from IP ${res.data.ip}`,
              })
              .then(() => {
                window.location.href = "/";
              });
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
    <form className="login" onSubmit={handleSubmit}>
      <GlobalStyles />
      <h3>Log In</h3>

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
    </form>
  );
};

export default Login;
