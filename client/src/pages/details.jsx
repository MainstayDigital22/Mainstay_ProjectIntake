import axios from "axios";
import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { getAuthLevel, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
import { Chat } from "../components/chat";
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
      ticket: undefined,
      id: "",
      actionLock: false,
      chat: [],
      chatInput: "",
      isSendingChat: false,
    };
  }
  async fetchData(id) {
    this.setState({
      id: id,
    });
    await axios
      .get(`${HOST}/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        const isClientView = getAuthLevel() === "client";
        if (res.data[0].chat) {
          const newChats = res.data[0].chat.map((msg) => ({
            position: isClientView === msg.isClient ? "right" : "left",
            type: "text",
            title: msg.username,
            text: msg.message,
          }));

          this.setState((prevState) => ({
            chat: newChats,
          }));
        }

        this.setState({
          ticket: res.data,
          chatraw: res.data[0].chat,
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
  handleInput = (input) => {
    this.setState({ chatInput: input });
  };
  addChat = async (text) => {
    if (this.state.isSendingChat || !text.trim()) return;
    const newChatMessage = {
      isClient: getAuthLevel() === "client",
      message: text,
      username: getAuthUser(),
    };

    const optimisticUpdate = {
      position: "right",
      type: "text",
      title: getAuthUser(),
      text,
    };

    this.setState((prevState) => ({
      chat: [...prevState.chat, optimisticUpdate],
      isSendingChat: true,
      chatInput: "", // Clear input for immediate feedback
    }));

    try {
      const response = await axios.post(
        `${HOST}/ticket/update/${this.state.id}`,
        {
          chat: [...this.state.ticket[0].chat, newChatMessage],
          status:
            getAuthLevel() === "client" ? "pending review" : "pending response",
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );

      if (response.status == 200) {
        await axios
          .get(`${HOST}/ticket/${this.state.id}`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          })
          .then((res) => {
            this.setState({
              ticket: [res.data[0]],
              chat: res.data[0].chat.map((msg) => ({
                position:
                  (getAuthLevel() === "client") === msg.isClient
                    ? "right"
                    : "left",
                type: "text",
                title: msg.username,
                text: msg.message,
              })),
            });
          });
      }
    } catch (err) {
      console.error(err.response || err);
      // Handle error (e.g., rollback optimistic update, show error message)
    } finally {
      this.setState({ isSendingChat: false });
    }
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
  open = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `${HOST}/ticket/update/${this.state.id}`,
        {
          status: !this.state.ticket[0]?.chat[0]
            ? "new"
            : this.state.ticket[0].chat[this.state.ticket[0].chat.length - 1]
                .isClient
            ? "pending review"
            : "pending response",
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        window.location.reload(false);
        alert("Ticket Reopened!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  close = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `${HOST}/ticket/update/${this.state.id}`,
        { status: "closed" },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        window.location.reload(false);
        alert("Ticket Closed!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  delete = () => {
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
      .delete(`${HOST}/ticket/${this.state.id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        console.log(res);
        window.location.replace("/review");
        alert("Ticket Deleted!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  edit = () => {
    window.location.replace(`/edit/${this.state.id}`);
  };
  render() {
    return (
      <div>
        <GlobalStyles />
        {this.state.ticket ? (
          <>
            {this.state.ticket[0].username === getAuthUser() ||
            ["admin", "staff"].includes(getAuthLevel()) ? (
              <div className="container">
                <div className="row mt-md-5 pt-md-4">
                  <ul>
                    {Object.keys(this.state.ticket[0]).map((key) => {
                      if (key == "chat") {
                        return;
                      }
                      if (
                        this.state.ticket[0][key] &&
                        typeof this.state.ticket[0][key] === "object" &&
                        !Array.isArray(this.state.ticket[0][key])
                      ) {
                        // For nested objects like branding, hosting, etc.
                        return (
                          <li key={key}>
                            <strong>{key}:</strong>
                            <ul>
                              {Object.keys(this.state.ticket[0][key]).map(
                                (subKey) => {
                                  if (this.state.ticket[0][key][subKey]) {
                                    return (
                                      <li key={subKey}>
                                        <strong>{subKey}:</strong>{" "}
                                        {JSON.stringify(
                                          this.state.ticket[0][key][subKey]
                                        )}
                                      </li>
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </ul>
                          </li>
                        );
                      } else if (this.state.ticket[0][key]) {
                        // For simple fields
                        return (
                          <li key={key}>
                            <strong>{key}:</strong> {this.state.ticket[0][key]}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
                <div className="row">
                  {["admin", "staff"].includes(getAuthLevel()) ? (
                    <>
                      {["closed", "archived"].includes(
                        this.state.ticket[0].status
                      ) ? (
                        <input
                          type="button"
                          id="submit"
                          onClick={this.open}
                          className="btn-main col m-1"
                          value="Reopen"
                        />
                      ) : (
                        <></>
                      )}
                      {this.state.ticket[0].status != "closed" ? (
                        <input
                          type="button"
                          id="submit"
                          onClick={this.close}
                          className="btn-main col m-1"
                          value="Close"
                        />
                      ) : (
                        <></>
                      )}
                      {this.state.ticket[0].status != "archived" ? (
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
                  {getAuthLevel() == "admin" ? (
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
                <Chat messages={this.state.chat} />
                <div className="row">
                  <div className="col-8">
                    <input
                      type="text"
                      value={this.state.chatInput || ""}
                      disabled={this.state.ticket[0].status === "closed"}
                      onChange={(e) => this.handleInput(e.target.value)}
                      placeholder={
                        this.state.ticket[0].status === "closed"
                          ? "Ticket is closed"
                          : "Text Something..."
                      }
                      style={{
                        width: "100%",
                        height: "50px",
                        fontSize: "20px",
                        bottom: 0,
                        padding: "10px",
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <button
                      onClick={() => this.addChat(this.state.chatInput)}
                      disabled={this.state.isSendingChat} // Disable button while sending
                      className="btn-action"
                      style={{
                        width: "100%",
                        height: "50px",
                        fontSize: "20px",
                        padding: "10px",
                      }}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <h2>Access Denied</h2>
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}

export default withParams(Details);
