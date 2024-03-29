import React from "react";
import axios from "axios";

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
      .get("http://localhost:8080/organization/withusers")
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
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Orgs;
