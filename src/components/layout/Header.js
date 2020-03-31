import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import WarningIcon from '@material-ui/icons/Warning';
import { withTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { DEFAULT_MODE, TEACHER_MODES } from '../../config/settings';
import { getAppInstanceResources, getUsers } from '../../actions';

class Header extends Component {
  static styles = theme => ({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    logo: {
      height: '48px',
      marginRight: theme.spacing(2),
    },
  });

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      grow: PropTypes.string,
      logo: PropTypes.string,
    }).isRequired,
    mode: PropTypes.string,
    standalone: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    mode: DEFAULT_MODE,
  };

  handleRefresh = () => {
    const { dispatchGetAppInstanceResources, dispatchGetUsers } = this.props;
    dispatchGetAppInstanceResources({ includePublic: false });
    dispatchGetUsers();
  };

  renderViewButtons() {
    const { t, mode, standalone } = this.props;

    if (standalone) {
      return (
        <Tooltip
          title={t('This is just a preview. No highlights will be saved.')}
        >
          <WarningIcon color="secondary" />
        </Tooltip>
      );
    }

    if (TEACHER_MODES.includes(mode)) {
      return [
        <IconButton onClick={this.handleRefresh} key="refresh">
          <RefreshIcon color="secondary" />
        </IconButton>,
      ];
    }
    return null;
  }

  render() {
    const { t, classes } = this.props;
    return (
      <header>
        <AppBar position="static">
          <Toolbar>
            <Logo className={classes.logo} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {t('PDF Annotator')}
            </Typography>
            {this.renderViewButtons()}
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

const mapStateToProps = ({ context }) => ({
  appInstanceId: context.appInstanceId,
  spaceId: context.spaceId,
  mode: context.mode,
  view: context.view,
  standalone: context.standalone,
});

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchGetUsers: getUsers,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Header);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(Header.styles)(TranslatedComponent);
