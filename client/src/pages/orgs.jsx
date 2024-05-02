import React from "react";
import axios from "axios";
import { HOST } from "../const";
import { getAuthToken } from "../components/auth";

const styles = {
  container: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  organization: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    borderRadius: "5px",
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "white",
  },
  companyName: {
    color: "#333",
    fontWeight: "bold",
  },
  user: {
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  userList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  loadingError: {
    textAlign: "center",
    color: "#ff6b6b",
  },
  button: {
    cursor: "pointer",
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    margin: "5px",
  },
};

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
      .get(`${HOST}/organization/withusers`)
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
      return <p style={styles.loadingError}>Loading...</p>;
    }

    if (error) {
      return <p style={styles.loadingError}>Error loading data!</p>;
    }

    return (
      <div style={styles.container}>
        {organizations.map((org) => (
          <div key={org._id} style={styles.organization}>
            <h2 style={styles.companyName}>{org.companyName}</h2>
            <div>
              <ul style={styles.userList}>
                {org.users.map((user, index) => (
                  <li key={index} style={styles.user}>
                    Username: {user.username}
                    <br />
                    Name: {user.firstName} {user.lastName}
                  </li>
                ))}
              </ul>
              <button
                style={styles.button}
                onClick={() => this.deleteOrganization(org._id)}>
                Delete Organization
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Orgs;
