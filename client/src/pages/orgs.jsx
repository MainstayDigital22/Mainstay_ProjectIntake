import React from "react";
import axios from "axios";
import { HOST } from "../const";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuthToken } from "../components/auth";

class Orgs extends React.Component {
  state = {
    organizations: [],
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchOrganizations();
  }

  fetchOrganizations = () => {
    axios
      .get(`${HOST}/organization/withusers`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((response) => {
        this.setState({
          organizations: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          isLoading: false,
        });
      });
  };

  deleteOrganization = (orgId) => {
    axios
      .delete(`${HOST}/organization/${orgId}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then(() => {
        const updatedOrgs = this.state.organizations.filter(
          (org) => org._id !== orgId
        );
        this.setState({ organizations: updatedOrgs });
      })
      .catch((error) => {
        console.error("Error deleting organization:", error);
        alert("Failed to delete organization");
      });
  };

  render() {
    const { organizations, isLoading, error } = this.state;

    if (isLoading) {
      return <p></p>;
    }

    if (error) {
      return <p>Error loading data!</p>;
    }

    return (
      <div className="container">
        <h1 className="page-title">Organizations</h1>
        {organizations.map((org) => (
          <div key={org._id} className="org-container">
            <h2>{org.companyName}</h2>
            <div className="table-radius">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {org.users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.permission}</td>
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
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Orgs;
