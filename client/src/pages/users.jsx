import React, { Component } from "react";
import axios from "axios";
import { getAuthToken } from "../components/auth";
import { HOST } from "../const";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      currentUsers: [],
      currentPage: 1,
      usersPerPage: 10,
    };
  }

  fetchData() {
    axios
      .get(`${HOST}/user`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({
          allUsers: res.data,
          currentUsers: res.data.slice(0, 10), // Initialize with the first page of users
        });
      })
      .catch((err) => {
        console.error("Failed to fetch users", err);
        alert(err.response.data);
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  handlePageChange = (page) => {
    const { allUsers, usersPerPage } = this.state;
    const newStartIndex = (page - 1) * usersPerPage;
    this.setState({
      currentPage: page,
      currentUsers: allUsers.slice(newStartIndex, newStartIndex + usersPerPage),
    });
  };

  render() {
    const { currentUsers, currentPage, usersPerPage, allUsers } = this.state;
    const totalPages = Math.ceil(allUsers.length / usersPerPage);

    return (
      <>
        {currentUsers.length > 0 ? (
          <div className="container">
            <h1 className="page-title">User Management</h1>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organizations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.permission}</td>{" "}
                    <td>
                      {user.organizations
                        .map((org) => org.companyName)
                        .join(", ")}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "center",
                          gap: 5,
                        }}>
                        <button className="btn-small">Edit</button>
                        <button className="btn-small">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                className="btn-small"
                disabled={currentPage <= 1}
                onClick={() => this.handlePageChange(currentPage - 1)}>
                Prev
              </button>
              <p>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </p>
              <button
                className="btn-small"
                disabled={currentPage >= totalPages}
                onClick={() => this.handlePageChange(currentPage + 1)}>
                Next
              </button>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </>
    );
  }
}

export default Users;
