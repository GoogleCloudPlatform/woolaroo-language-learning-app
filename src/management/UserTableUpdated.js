import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import "react-table/react-table.css";
import TableCell from "@material-ui/core/TableCell";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { Breakpoint } from "react-socks";
import "./UserTableUpdated.scss";

class UserTableUpdated extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      selected: {},
      selectAll: 0,
      changeRoleDialogIsOpen: false,
      removeRoleDialogIsOpen: false,
      newRole: "None",
      orderBy: "name",
      order: "asc"
    };

    // TODO: Refactor shared code between invite & change role dialogs.
    this.openDialog_ = this.openDialog_.bind(this);
    this.closeDialog_ = this.closeDialog_.bind(this);
    this.handleRoleSelected_ = this.handleRoleSelected_.bind(this);
    this.changeRoles_ = this.changeRoles_.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      data: nextProps.data,
      loading: nextProps.loading
    };
  }

  toggleRow(uid) {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[uid] = !this.state.selected[uid];
    this.setState({
      selected: newSelected,
      selectAll: 2
    });
  }

  toggleSelectAll() {
    let newSelected = {};
    if (this.state.selectAll === 0) {
      this.state.data.forEach(x => {
        newSelected[x.uid] = true;
      });
    }
    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0
    });
  }

  openDialog_() {
    this.setState({ changeRoleDialogIsOpen: true });
  }

  openRemoveRoleDialog_() {
    this.setState({ removeRoleDialogIsOpen: true });
  }

  closeRemoveDialog_() {
    this.setState({ removeRoleDialogIsOpen: false });
  }

  closeDialog_() {
    this.setState({ changeRoleDialogIsOpen: false });
  }

  handleRoleSelected_(e) {
    this.setState({ newRole: e.target.value });
  }

  changeRoles_() {
    const selectedUsers = this.state.data.filter(
      user => this.state.selected[user.uid] && user.role !== this.state.newRole
    );

    if (this.state.newRole === "None") {
      // Revoke the current role for all selected users.
      selectedUsers.forEach(user =>
        this.props.updateRole(user.email, user.role, true /* revoke */)
      );
    } else {
      // Grant newRole to all selected users.
      selectedUsers.forEach(user =>
        this.props.updateRole(
          user.email,
          this.state.newRole,
          false /* revoke */
        )
      );
    }

    this.closeDialog_();
    this.closeRemoveDialog_();
  }

  renderRemoveRoleDialog_() {
    return (
      <Dialog
        open={this.state.removeRoleDialogIsOpen}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className="add-role-dialog-title">
          Remove roles
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="role"
              value={this.state.newRole}
              onChange={this.handleRoleSelected_}
            >
              <FormControlLabel value="None" control={<Radio />} label="None" />
              <FormHelperText className="role-text">
                Remove roles for the user. Can no longer review user
                contributions or manage settings
              </FormHelperText>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeRemoveDialog_()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => this.changeRoles_()} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderAddRoleDialog_() {
    return (
      <Dialog
        open={this.state.changeRoleDialogIsOpen}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className="add-role-dialog-title">
          Add roles
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="role"
              value={this.state.newRole}
              onChange={this.handleRoleSelected_}
            >
              <FormControlLabel
                value="Moderator"
                control={<Radio />}
                label="Moderator"
              />
              <FormHelperText className="role-text">
                Can review user contributions
              </FormHelperText>
              <FormControlLabel
                value="Admin"
                control={<Radio />}
                label="Admin"
              />
              <FormHelperText className="role-text">
                Can review user contributions and manage app and user settings
              </FormHelperText>
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog_} color="primary">
            Cancel
          </Button>
          <Button onClick={() => this.changeRoles_()} color="primary">
            Change
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleSortClick = columnName => {
    this.setState(state => ({
      order:
        state.orderBy === columnName
          ? state.order === "asc"
            ? "desc"
            : "asc"
          : "asc",
      orderBy: columnName
    }));
  };

  sortingFunction(a, b, orderBy) {
    let order = this.state.order;
    if (b[orderBy] === null || typeof b[orderBy] === "undefined") {
      return -1;
    }

    if (a[orderBy] > b[orderBy]) {
      if (order === "asc") {
        return 1;
      }
      return -1;
    }

    if (a[orderBy] < b[orderBy]) {
      if (order === "asc") {
        return -1;
      }
      return 1;
    }
    return 0;
  }

  sortData(array) {
    switch (this.state.orderBy) {
      case "name":
        return array.sort((a, b) => this.sortingFunction(a, b, "name"));

      case "email":
        return array.sort((a, b) => this.sortingFunction(a, b, "email"));

      case "role":
        return array.sort((a, b) => this.sortingFunction(a, b, "role"));

      default:
        return array;
    }
  }

  getTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox
              className="checkbox"
              checked={this.state.selectAll === 1}
              indeterminate={this.state.selectAll === 2}
              onChange={() => this.toggleSelectAll()}
            />
          </TableCell>
          <TableCell
            key="name"
            sortDirection={
              this.state.orderBy === "name" ? this.state.order : false
            }
            onClick={() => this.handleSortClick("name")}
          >
            <TableSortLabel
              active={this.state.orderBy === "name"}
              direction={
                this.state.orderBy === "name" ? this.state.order : "asc"
              }
            >
              Name
            </TableSortLabel>
          </TableCell>
          <TableCell
            key="email"
            sortDirection={
              this.state.orderBy === "email" ? this.state.order : false
            }
            onClick={() => this.handleSortClick("email")}
          >
            <Breakpoint customQuery="(min-width: 650px)">
              <TableSortLabel
                active={this.state.orderBy === "email"}
                direction={
                  this.state.orderBy === "email" ? this.state.order : "asc"
                }
              >
                Email
              </TableSortLabel>
            </Breakpoint>
          </TableCell>
          <TableCell
            key="role"
            sortDirection={
              this.state.orderBy === "role" ? this.state.order : false
            }
            onClick={() => this.handleSortClick("role")}
          >
            <Breakpoint customQuery="(min-width: 450px)">
              <TableSortLabel
                active={this.state.orderBy === "role"}
                direction={
                  this.state.orderBy === "role" ? this.state.order : "asc"
                }
              >
                Role
              </TableSortLabel>
            </Breakpoint>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  getToolbar = () => {
    let selectedItems = this.state.selected;
    let numSelected =
      Object.keys(selectedItems).length > 0
        ? Object.values(selectedItems).filter(entry => entry === true).length
        : 0;

    return numSelected > 0 ? (
      <Toolbar variant="dense" style={{ backgroundColor: "#D5EEE2" }}>
        <div className="toolbar-container">
          <Typography variant="subtitle2">{numSelected} selected</Typography>

          <Typography
            variant="subtitle2"
            style={{ cursor: "pointer" }}
            onClick={() => this.openDialog_()}
          >
            Add roles
          </Typography>

          <Typography
            variant="subtitle2"
            style={{ cursor: "pointer" }}
            onClick={() => this.openRemoveRoleDialog_()}
          >
            Remove roles
          </Typography>
        </div>
      </Toolbar>
    ) : null;
  };

  getTableBody = () => {
    console.log("data", this.state.data);
    return this.props.loading ? (
      <TableBody>
        <div style={{ marginLeft: "24px" }}>
          <p>Loading...</p>
        </div>
      </TableBody>
    ) : (
      <TableBody>
        {this.sortData(this.state.data).map(row => (
          <TableRow key={row.uid} className={this.state.selected[row.uid] === true ? 'selected-row': ''}>
            <TableCell component="th" scope="row">
              <Checkbox
                className="checkbox"
                checked={this.state.selected[row.uid] === true}
                onChange={() => this.toggleRow(row.uid)}
              />
            </TableCell>
            <TableCell align="left">
              <div>
                <p>{row.name}</p>
                <Breakpoint customQuery="(max-width: 650px)">
                  <p>{row.email}</p>
                </Breakpoint>
                <Breakpoint customQuery="(max-width: 450px)">
                  <p>Role: {row.role}</p>
                </Breakpoint>
              </div>
            </TableCell>
            <TableCell align="left">
              <Breakpoint customQuery="(min-width: 650px)">
                {row.email}
              </Breakpoint>
            </TableCell>
            <TableCell align="left">
              <Breakpoint customQuery="(min-width: 450px)">
                {row.role}
              </Breakpoint>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  render() {
    return (
      <div className="user-table-container">
        <Paper elevation={3}>
          {this.getToolbar()}
          <Table size="small" aria-label="User Table">
            {this.getTableHead()}
            {this.getTableBody()}
          </Table>
        </Paper>
        {this.renderAddRoleDialog_()}
        {this.renderRemoveRoleDialog_()}
      </div>
    );
  }
}

export default UserTableUpdated;
