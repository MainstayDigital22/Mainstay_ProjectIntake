import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import React, { Component, useState } from "react";
import { createGlobalStyle } from "styled-components";
import { getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(
    () =>
      columns.reduce(
        (acc, column) => {
          acc[column.accessorKey ?? ""] = "";
          return acc;
        },
        { password: "", confirmPassword: "" }
      ) // Add confirmPassword field
  );

  const [passwordError, setPasswordError] = useState(false); // State to track password validation error

  const handleSubmit = () => {
    // Your validation logic here
    if (values.password !== values.confirmPassword) {
      setPasswordError(true); // Show an error if passwords don't match
      return;
    }

    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}>
            {columns.map((column) =>
              column.accessorKey !== "permission" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ) : (
                <FormControl key="permission">
                  <InputLabel>Permission</InputLabel>
                  <Select
                    label="Permission"
                    name="permission"
                    value={values.permission}
                    onChange={(e) =>
                      setValues({ ...values, permission: e.target.value })
                    }>
                    <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"staff"}>Staff</MenuItem>
                    <MenuItem value={"client"}>client</MenuItem>
                  </Select>
                </FormControl>
              )
            )}
            <TextField
              key="password"
              label="Password"
              name="password"
              type="password"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
            <TextField
              key="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              error={passwordError} // Add error prop to display validation error
              helperText={passwordError ? "Passwords do not match" : ""}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createModalOpen: false,
      users: undefined,
      editingRowData: null,
      editModalOpen: false,
    };
  }

  handleDelete = (username) => {
    if (!window.confirm(`Are you sure you want to delete ${username}`)) {
      return;
    }

    axios
      .delete(`${HOST}/user/${username}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        alert(res.data);
        window.location.reload(false);
      })
      .catch((err) => alert(err.response.data));
  };

  handleEdit = (row) => {
    this.setState({
      editModalOpen: true,
      editingRowData: row.original,
    });
  };

  handleCreate = (values) => {
    axios
      .post(`${HOST}/user/add`, values, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        alert("User Created");
        window.location.reload(false);
      })
      .catch((err) => alert(err.response.data));
  };

  handleUpdate = ({ row, values }) => {
    axios
      .post(`${HOST}/user/update/${row.original.username}`, values, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        alert("User Updated");
        window.location.reload(false);
      })
      .catch((err) => alert(err.response.data));
  };

  columns = [
    {
      accessorKey: "username",
      header: "Username",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "email",
      header: "Email",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "permission",
      header: "Permission",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
  ];

  fetchData() {
    axios
      .get(`${HOST}/user`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({ users: res.data });
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <>
        {this.state.users ? (
          <div>
            <GlobalStyles />
            <MaterialReactTable
              columns={this.columns}
              data={this.state.users}
              editingMode="modal"
              enableEditing
              onEditingRowSave={this.handleUpdate}
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow placement="right" title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => this.handleDelete(row.original.username)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              renderTopToolbarCustomActions={() => (
                <Button
                  color="secondary"
                  onClick={() => this.setState({ createModalOpen: true })}
                  variant="contained">
                  Create New User
                </Button>
              )}
            />
            <CreateNewAccountModal
              columns={this.columns}
              open={this.state.createModalOpen}
              onClose={() => this.setState({ createModalOpen: false })}
              onSubmit={this.handleCreate}
            />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default Users;
