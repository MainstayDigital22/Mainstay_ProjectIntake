import { Component } from "react";
import { getAuthUser, getAuthToken } from "../components/auth";
import { HOST } from "../const";
import axios from "axios";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: undefined,
    };
  }
  componentDidMount() {
    axios
      .get(`http://${HOST}:8080/user/stats`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({
          stats: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }
  render() {
    return (
      <div className="text-white pb-5 ">
        <div className="d-flex container row justify-content-center">
          <div>
            <h1 style={{ fontSize: "50px" }}>Welcome {getAuthUser()}!</h1>
            {this.state.stats ? (
              <p style={{ color: "black" }}>
                User Count: {this.state.stats.userCount}
                <br />
                Post Count: {this.state.stats.postCount}
                <br />
                Pending Post Count: {this.state.stats.pendingCount}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
