import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAuthToken, getAuthLevel, getAuthUser } from "../components/auth";
import ReactPlayer from "react-player";
import { HOST } from "../const";
function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: undefined,
      id: "",
      actionLock: false,
    };
  }
  async fetchData(id) {
    this.setState({
      id: id,
    });
    await axios
      .get(`http://${HOST}:8080/post/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({
          post: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }
  componentDidMount() {
    const { id } = this.props.params;
    this.fetchData(id);
  }
  approve = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/post/update/${this.state.id}`,
        { status: 1, updated: Date.now },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        axios.post(`http://${HOST}:8080/log/add`, {
          username: getAuthUser(),
          postid: this.state.id,
          postTitle: this.state.post[0].name,
          action: "Approve Post",
          comments: `User ${getAuthUser()} approved post titled ${
            this.state.post[0].name
          } with the post ID of ${this.state.id}`,
        });
        window.location.reload(false);
        alert("Post Approved!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  pending = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/post/update/${this.state.id}`,
        { status: 0, updated: Date.now },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        axios.post(`http://${HOST}:8080/log/add`, {
          username: getAuthUser(),
          postid: this.state.id,
          postTitle: this.state.post[0].name,
          action: "Approve Post",
          comments: `User ${getAuthUser()} switched to pending for post titled ${
            this.state.post[0].name
          } with the post ID of ${this.state.id}`,
        });
        window.location.reload(false);
        alert("Post Pending");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  reject = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/post/update/${this.state.id}`,
        { status: 2, updated: Date.now },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        axios.post(`http://${HOST}:8080/log/add`, {
          username: getAuthUser(),
          postid: this.state.id,
          postTitle: this.state.post[0].name,
          action: "Reject Post",
          comments: `User ${getAuthUser()} rejected post titled ${
            this.state.post[0].name
          } with the post ID of ${this.state.id}`,
        });
        window.location.reload(false);
        alert("Post Rejected!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  archive = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/post/update/${this.state.id}`,
        { status: 3, updated: Date.now },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        axios.post(`http://${HOST}:8080/log/add`, {
          username: getAuthUser(),
          postid: this.state.id,
          postTitle: this.state.post[0].name,
          action: "Archive Post",
          comments: `User ${getAuthUser()} archived post titled ${
            this.state.post[0].name
          } with the post ID of ${this.state.id}`,
        });
        window.location.reload(false);
        alert("Post Archived!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  delete = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    let newPost = this.state.post;
    newPost[0].media = [];
    this.setState({ post: newPost });
    axios
      .delete(`http://${HOST}:8080/post/${this.state.id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        console.log(res);
        axios.post(`http://${HOST}:8080/log/add`, {
          username: getAuthUser(),
          postid: this.state.id,
          postTitle: this.state.post[0].name,
          action: "Delete Post",
          comments: `User ${getAuthUser()} deleted post titled ${
            this.state.post[0].name
          } with the post ID of ${this.state.id}`,
        });
        window.location.replace("/review");
        alert("Post Deleted!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  edit = () => {
    window.location.replace(`/edit/${this.state.id}`);
  };
  duplicate = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    if (
      confirm(
        "Would you like to duplicate this post? (images won't be duplicated)"
      )
    ) {
      axios
        .post(
          `http://${HOST}:8080/post/add`,
          {
            user: getAuthUser(),
            name: this.state.post[0].name,
            englishName: this.state.post[0].englishName,
            year: this.state.post[0].year,
            title: this.state.post[0].title,
            subtitle: this.state.post[0].subtitle,
            description: this.state.post[0].desc,
            category: this.state.post[0].category,
            layout: this.state.post[0].layout,
            created: Date.now,
            updated: Date.now,
            status: 0,
            order: 0,
          },
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        )
        .then((res) => {
          if (res.status == 200) {
            alert(`post duplicated!`);
            window.location.replace(`/review/${res.data.id}`);
          }
        });
    }
  };
  render() {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Taipei", // Taiwan Time
    };
    return (
      <div>
        <GlobalStyles />
        {this.state.post ? (
          <>
            {this.state.post[0].user == getAuthUser() || getAuthLevel() <= 1 ? (
              <div className="container">
                <div className="row mt-md-5 pt-md-4">
                  <div className="col-md-6 text-center">
                    <div style={{ maxWidth: "100%" }}>
                      {this.state.post[0].media.map((media) =>
                        media.extension == "mp4" ? (
                          <ReactPlayer
                            url={media.link}
                            style={{ maxWidth: "100%" }}
                          />
                        ) : (
                          <img
                            src={media.link}
                            className="img-fluid img-rounded"
                            alt=""
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="item_info">
                      <h2>
                        {" "}
                        {this.state.post[0].name}{" "}
                        {`${
                          this.state.post[0].englishName
                            ? "(" + this.state.post[0].englishName + ")"
                            : ""
                        }`}
                      </h2>

                      <h2>{this.state.post[0].title}</h2>
                      <p>{this.state.post[0].subtitle}</p>
                      <div className="item_info_counts">
                        {this.state.post[0].category.map((tag) => (
                          <div className="item_info_type">{tag}</div>
                        ))}
                      </div>
                      <p>Description:</p>
                      <p>Year: {this.state.post[0].year}</p>
                      <p>
                        Created:{" "}
                        {new Date(this.state.post[0].created).toLocaleString(
                          "en-US",
                          options
                        )}
                      </p>
                      <p>
                        Updated:{" "}
                        {new Date(this.state.post[0].updated).toLocaleString(
                          "en-US",
                          options
                        )}
                      </p>
                      <p>Order: {this.state.post[0].order}</p>
                      <p
                        style={{
                          backgroundColor: `${
                            this.state.post[0].status == 0
                              ? "#fffcd4"
                              : this.state.post[0].status == 1
                              ? "#ddffd4"
                              : this.state.post[0].status == 2
                              ? "#ffd4f6"
                              : "#d4d4ff"
                          }`,
                        }}>
                        Status:{" "}
                        {this.state.post[0].status == 0
                          ? "Pending"
                          : this.state.post[0].status == 1
                          ? "Approved"
                          : this.state.post[0].status == 2
                          ? "Rejected"
                          : "Archived"}
                      </p>
                      <p>Last Edited By: {this.state.post[0].user}</p>
                      <div className="spacer-50"></div>
                      <div className="row">
                        {getAuthLevel() <= 1 ? (
                          <>
                            {this.state.post[0].status != 0 ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.pending}
                                className="btn-main col m-1"
                                value="Pending"
                              />
                            ) : (
                              <></>
                            )}
                            {this.state.post[0].status != 1 ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.approve}
                                className="btn-main col m-1"
                                value="Approve"
                              />
                            ) : (
                              <></>
                            )}
                            {this.state.post[0].status != 2 ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.reject}
                                className="btn-main col m-1"
                                value="Reject"
                              />
                            ) : (
                              <></>
                            )}
                            {this.state.post[0].status != 3 ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.archive}
                                className="btn-main col m-1"
                                value="Archive"
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        <input
                          type="button"
                          id="submit"
                          onClick={this.edit}
                          className="btn-main col m-1"
                          value="Edit"
                        />
                        <input
                          type="button"
                          id="submit"
                          onClick={this.duplicate}
                          className="btn-main col m-1"
                          value="Duplicate"
                        />
                        {getAuthLevel() == 0 ? (
                          <input
                            type="button"
                            id="submit"
                            onClick={this.delete}
                            className="btn-main col m-1"
                            value="Delete"
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="de_tab"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <h2>access denied</h2>
            )}
          </>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default withParams(Details);
