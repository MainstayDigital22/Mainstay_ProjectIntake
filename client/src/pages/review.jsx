import axios from "axios";
import { Chat } from "../components/chat";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import {
  asterisk,
  closeTicket,
  deleteTicket,
  editTicket,
  openTicket,
  profilePlaceholder,
} from "../assets";
import {
  getAuthToken,
  getAuthUser,
  getAuthLevel,
  getAuthId,
} from "../components/auth";
import { HOST } from "../const";
import { Label } from "../components/label";
import { ChatInfo } from "../components/chatinfo";
import ticket from "./ticket";
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusFilter: [],
      tagFilter: [],
      tagInput: [],
      posts: [],
      open: -1,
      showAction: getAuthLevel() != "client",
      showOpen: getAuthLevel() == "client",
      showClosed: false,
      showOverdue: false,
      showProgress: false,
      isExpand: false,
      height: 0,
      toggleList: true,
      showSortDropdown: false,
      sortBy: "priority",
      searchKeyword: "",
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }
  onImgLoad({ target: img }) {
    let currentHeight = this.state.height;
    if (currentHeight < img.offsetHeight) {
      this.setState({
        height: img.offsetHeight,
      });
    }
  }
  handleSortBy = (method) => {
    this.setState({ sortBy: method });
    this.sortTickets(method);
  };

  handleSearchChange = (event) => {
    this.setState({ searchKeyword: event.target.value }, () => {
      this.updatePosts();
    });
  };

  sortTickets = (sortBy) => {
    let tickets = [...this.state.posts];

    switch (sortBy) {
      case "priority":
        const priorityMap = {
          ASAP: 1,
          high: 2,
          medium: 3,
          low: 4,
        };
        tickets.sort(
          (a, b) => priorityMap[a.priority] - priorityMap[b.priority]
        );
        break;
      case "dueDate":
        tickets.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "name":
        tickets.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "status":
        tickets.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        console.warn("No valid sort method provided");
        break;
    }

    console.log(tickets);
    this.setState({ posts: tickets });
  };

  getSortTickets = (tickets) => {
    switch (this.state.sortBy) {
      case "priority":
        const priorityMap = {
          ASAP: 1,
          high: 2,
          medium: 3,
          low: 4,
        };
        tickets.sort(
          (a, b) => priorityMap[a.priority] - priorityMap[b.priority]
        );
        break;
      case "dueDate":
        tickets.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "name":
        tickets.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "status":
        tickets.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        console.warn("No valid sort method provided");
        break;
    }

    return tickets;
  };

  handleDelete = (id) => {
    if (!window.confirm(`Are you sure you want to delete this ticket?`)) {
      return;
    }

    axios
      .delete(`${HOST}/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        alert("Ticket deleted");
        window.location.reload(false);
      })
      .catch((err) => alert(err.response.data));
  };
  updatePosts = async () => {
    const filters = [];
    if (this.state.showAction) filters.push("new", "pending review");
    if (this.state.showProgress) filters.push("pending response");
    if (this.state.showClosed) filters.push("completed", "closed");
    if (this.state.showOpen)
      filters.push("new", "pending review", "pending response");
    const len = this.state.posts.length;
    const orgsRes = await axios.get(
      `${HOST}/organization/userorgs/${getAuthId()}`,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    const orgs = orgsRes.data.map((item) => item._id);
    await axios
      .post(
        `${HOST}/ticket`,
        {
          orgs: orgs,
          //status: filters,
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        const posts = res.data;
        const action = posts.filter(
          (post) => post.status === "new" || post.status === "pending review"
        );
        const actionNeededCount =
          getAuthLevel() == "client"
            ? action.length
            : this.state.showOverdue
            ? action.filter((post) => new Date(post.deadline) < Date.now())
                .length
            : action.filter((post) => new Date(post.deadline) > Date.now())
                .length;
        const inProgress = posts.filter(
          (post) => post.status === "pending response"
        );
        const inProgressCount =
          getAuthLevel() == "client"
            ? inProgress.length
            : this.state.showOverdue
            ? inProgress.filter((post) => new Date(post.deadline) < Date.now())
                .length
            : inProgress.filter((post) => new Date(post.deadline) > Date.now())
                .length;
        const closed = posts.filter(
          (post) => post.status === "completed" || post.status === "closed"
        );
        const closedCount =
          getAuthLevel() == "client"
            ? closed.length
            : this.state.showOverdue
            ? closed.filter((post) => new Date(post.deadline) < Date.now())
                .length
            : closed.filter((post) => new Date(post.deadline) > Date.now())
                .length;
        if (len != posts.length) {
          this.setState({ open: -1 });
        }
        let filteredPosts = posts.filter((post) =>
          filters.includes(post.status)
        );
        if (this.state.searchKeyword) {
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.title
                .toLowerCase()
                .includes(this.state.searchKeyword.toLowerCase()) ||
              (post.organization &&
                post.organization.companyName
                  .toLowerCase()
                  .includes(this.state.searchKeyword.toLowerCase())) ||
              (post.domainURL &&
                post.domainURL
                  .toLowerCase()
                  .includes(this.state.searchKeyword.toLowerCase()))
          );
        }
        filteredPosts = this.getSortTickets(filteredPosts);
        this.setState({
          posts:
            getAuthLevel() == "client"
              ? filteredPosts
              : this.state.showOverdue
              ? filteredPosts.filter(
                  (post) => new Date(post.deadline) < Date.now()
                )
              : filteredPosts.filter(
                  (post) => new Date(post.deadline) > Date.now()
                ),
          actionNeededCount,
          inProgressCount,
          closedCount,
          openCount: actionNeededCount + inProgressCount,
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };

  getPosts() {
    return this.state.posts;
  }
  componentDidMount() {
    this.updatePosts();
  }

  archive = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `${HOST}/ticket/update/${this.state.id}`,
        { status: "archived" },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        window.location.reload(false);
        alert("Ticket Archived!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  open = (id, chat) => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `${HOST}/ticket/update/${id}`,
        {
          status:
            chat.length == 0
              ? "new"
              : chat[chat.length - 1].isClient
              ? "pending review"
              : "pending response",
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        this.state.actionLock = false;
        this.updatePosts();
        alert("Ticket Reopened!");
      })
      .catch((err) => {
        console.log(err.response || err);
        this.state.actionLock = false;
      });
  };
  close = (id) => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `${HOST}/ticket/update/${id}`,
        { status: "closed" },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        this.updatePosts();
        alert("Ticket Closed!");
        this.state.actionLock = false;
      })
      .catch((err) => {
        console.log(err.response || err);
        this.state.actionLock = false;
      });
  };
  delete = (id) => {
    if (!window.confirm(`Are you sure you want to delete this ticket?`)) {
      return;
    }
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .delete(`${HOST}/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        console.log(res);
        alert("Ticket Deleted!");
        this.updatePosts();
        this.state.actionLock = false;
      })
      .catch((err) => {
        console.log(err.response || err);
        this.state.actionLock = false;
      });
  };
  edit = (id) => {
    window.location.replace(`/edit/${id}`);
  };

  render() {
    return (
      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, company, or domain..."
            value={this.state.searchKeyword}
            onChange={this.handleSearchChange}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
          />
        </div>

        <div className="row welcome-ticket">
          <div className="col title">
            <h1>Welcome {getAuthUser()}!</h1>
          </div>
          <div className="create col">
            <a href="/new-ticket">
              <div className="btn">
                <div className="row">
                  <div className="icon col-2">
                    <img src={asterisk} />
                  </div>
                  <p className="col">Create a Ticket</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {this.state.posts ? (
          <>
            <div className="row status">
              {getAuthLevel() != "client" ? (
                <>
                  <button
                    className={`col ${
                      this.state.showAction
                        ? "status-active"
                        : "status-inactive"
                    }`}
                    onClick={() => {
                      this.setState(
                        {
                          open: -1,
                          showAction: !this.state.showAction,
                          isExpand: false,
                        },
                        () => this.updatePosts()
                      );
                    }}>
                    <h1>{this.state.actionNeededCount}</h1>
                    <h3>Action Needed</h3>
                  </button>
                  <button
                    className={`col ${
                      this.state.showProgress
                        ? "status-active"
                        : "status-inactive"
                    }`}
                    onClick={() => {
                      this.setState(
                        {
                          open: -1,
                          showProgress: !this.state.showProgress,
                          isExpand: false,
                        },
                        () => this.updatePosts()
                      );
                    }}>
                    <h1>{this.state.inProgressCount}</h1>
                    <h3>Awaiting Response</h3>
                  </button>
                </>
              ) : (
                <button
                  className={`col ${
                    this.state.showOpen ? "status-active" : "status-inactive"
                  }`}
                  onClick={() => {
                    this.setState(
                      {
                        open: -1,
                        showOpen: !this.state.showOpen,
                        isExpand: false,
                      },
                      () => this.updatePosts()
                    );
                  }}>
                  <h1>{this.state.openCount}</h1>
                  <h3>Open</h3>
                </button>
              )}
              <button
                className={`col ${
                  this.state.showClosed ? "status-active" : "status-inactive"
                }`}
                onClick={() => {
                  this.setState(
                    {
                      open: -1,
                      showClosed: !this.state.showClosed,
                      isExpand: false,
                    },
                    () => this.updatePosts()
                  );
                }}>
                <h1>{this.state.closedCount}</h1>
                <h3>Closed</h3>
              </button>
              {getAuthLevel() != "client" && (
                <button
                  className={`col ${
                    this.state.showOverdue ? "status-active" : "status-inactive"
                  }`}
                  onClick={() => {
                    this.setState(
                      {
                        open: -1,
                        showOverdue: !this.state.showOverdue,
                        isExpand: false,
                      },
                      () => this.updatePosts()
                    );
                  }}>
                  <h3>
                    {this.state.showOverdue
                      ? "Displaying Overdue"
                      : "Displaying On Time"}
                  </h3>
                </button>
              )}
            </div>
            <div
              style={{ display: "inline-flex", width: "100%", height: "100%" }}>
              {!this.state.isExpand && (
                <div
                  id="panel"
                  className={
                    this.state.open == -1
                      ? "ticket-container"
                      : "ticket-container-shrink"
                  }>
                  <div className="ticket-panel">
                    <div className="ticket-header">
                      <h4 style={{ marginTop: -2 }}>Active Tickets</h4>
                      <div className="ticket-action-bar">
                        {this.state.open === -1 && (
                          <>
                            <h4
                              style={{
                                color: "#6C7577",
                                marginRight: "10px",
                                textAlign: "right",
                              }}>
                              Sort By:
                            </h4>
                            {!this.state.showSortDropdown && (
                              <div
                                onClick={() =>
                                  this.setState({
                                    showSortDropdown:
                                      !this.state.showSortDropdown,
                                  })
                                }
                                style={{
                                  cursor: "pointer",

                                  display: "inline-block",
                                }}>
                                <h4
                                  style={{
                                    textAlign: "left",
                                    color: "#0758ef",
                                    width: 91.5,
                                  }}>
                                  {this.state.sortBy.charAt(0).toUpperCase() +
                                    this.state.sortBy.slice(1) || "Select"}
                                </h4>
                              </div>
                            )}
                            {this.state.showSortDropdown && (
                              <div className="custom-dropdown-menu">
                                {["priority", "dueDate", "name", "status"].map(
                                  (option) => (
                                    <div
                                      key={option}
                                      onClick={() => {
                                        this.handleSortBy(option);
                                        this.setState({
                                          showSortDropdown: false,
                                        });
                                      }}
                                      style={{
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        backgroundColor:
                                          this.state.sortBy === option
                                            ? "#007bff"
                                            : "#ffffff",
                                        color:
                                          this.state.sortBy === option
                                            ? "#ffffff"
                                            : "#000000",
                                      }}>
                                      {option.charAt(0).toUpperCase() +
                                        option.slice(1)}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {this.state.posts.map((ticket, index) => {
                      return (
                        <div
                          className="ticket-item"
                          onClick={() => {
                            this.state.open == -1
                              ? this.setState({ open: index, isExpand: false })
                              : this.setState({ open: -1, isExpand: false });
                          }}>
                          <div
                            style={{
                              display: "inline-flex",
                              gap: 16,
                              minWidth: "100%",
                            }}>
                            <div className="ticket-preview">
                              <img src={profilePlaceholder} />
                              <Label status={ticket.status} />
                            </div>
                            <div className="ticket-text">
                              <h3>{ticket.title}</h3>
                              <div className="ticket-description">
                                <p>{ticket.comments}</p>
                              </div>
                              <p>
                                <strong>Created By:</strong>{" "}
                                {ticket.username.charAt(0).toUpperCase() +
                                  ticket.username.slice(1)}
                                &nbsp;&nbsp;&nbsp;<strong>Domain:</strong>{" "}
                                {ticket.domainURL}
                              </p>
                            </div>
                            {getAuthLevel() == "admin" && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  marginLeft: "auto",
                                }}>
                                {ticket.status == "closed" ? (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.open(ticket._id, ticket.chat);
                                    }}>
                                    <img
                                      style={{ cursor: "pointer" }}
                                      src={openTicket}
                                    />
                                  </div>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.close(ticket._id);
                                    }}>
                                    <img
                                      style={{ cursor: "pointer" }}
                                      src={closeTicket}
                                    />
                                  </div>
                                )}
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    this.edit(ticket._id);
                                  }}>
                                  <img
                                    style={{ cursor: "pointer" }}
                                    src={editTicket}
                                  />
                                </div>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    this.delete(ticket._id);
                                  }}>
                                  <img
                                    style={{ cursor: "pointer" }}
                                    src={deleteTicket}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {this.state.open != -1 && this.state.posts[this.state.open] && (
                <div
                  className="chat-panel"
                  style={{ marginLeft: this.state.isExpand && 12 }}>
                  <ChatInfo
                    post={this.state.posts[this.state.open]}
                    handleExpand={() =>
                      this.setState({ isExpand: !this.state.isExpand })
                    }
                  />
                  <Chat
                    post={this.state.posts[this.state.open]}
                    callback={this.updatePosts}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default Review;
