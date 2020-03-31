import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { deleteAppInstanceResource, openSettings } from '../../../actions';
import { getUsers } from '../../../actions/users';
import Settings from './Settings';
import { deleteFile } from '../../../actions/file';
import Highlighter from '../../common/Highlighter';
import { PUBLIC_VISIBILITY } from '../../../config/settings';

export class TeacherView extends Component {
  static styles = theme => ({
    root: {
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    main: {
      textAlign: 'center',
      padding: theme.spacing(),
    },
    fab: {
      margin: theme.spacing(),
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    teacherView: {
      marginBottom: '100px',
    },
    form: {
      padding: theme.spacing(2),
    },
  });

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchOpenSettings: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      form: PropTypes.string,
      main: PropTypes.string,
      fab: PropTypes.string,
      teacherView: PropTypes.string,
    }).isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    // this is the shape of the select options for students
    users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  state = {
    selectedUserId: '',
  };

  constructor(props) {
    super(props);
    const { dispatchGetUsers } = this.props;
    dispatchGetUsers();
  }

  handleSelectUser = ({ target: { value } }) => {
    this.setState({ selectedUserId: value });
  };

  render() {
    const { classes, t, dispatchOpenSettings, users } = this.props;
    const { selectedUserId } = this.state;
    return (
      <div className={classes.teacherView}>
        <div className={classes.form}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="user">{t('Users')}</InputLabel>
            <Select
              labelId="select-user-label"
              id="select-user"
              value={selectedUserId}
              onChange={this.handleSelectUser}
              label="Users"
            >
              <MenuItem value="" key="">
                <em>{t('All')}</em>
              </MenuItem>
              {users.map(({ id, name }) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.main}>
            <Highlighter
              userId={selectedUserId}
              visibility={PUBLIC_VISIBILITY}
            />
          </Grid>
        </Grid>
        <Settings />
        <Fab
          color="primary"
          aria-label={t('Settings')}
          className={classes.fab}
          onClick={dispatchOpenSettings}
        >
          <SettingsIcon />
        </Fab>
      </div>
    );
  }
}

const mapStateToProps = ({ users }) => ({
  users: users.content,
});

const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchOpenSettings: openSettings,
  dispatchDeleteFile: deleteFile,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeacherView);

const StyledComponent = withStyles(TeacherView.styles)(ConnectedComponent);

export default withTranslation()(StyledComponent);
