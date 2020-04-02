import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { withTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../resources/logo.svg';

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
    classes: PropTypes.shape({
      root: PropTypes.string,
      grow: PropTypes.string,
      logo: PropTypes.string,
    }).isRequired,
    standalone: PropTypes.bool.isRequired,
  };

  static defaultProps = {};

  renderViewButtons() {
    const { t, standalone } = this.props;

    if (standalone) {
      return (
        <Tooltip
          title={t('This is just a preview. No highlights will be saved.')}
        >
          <WarningIcon color="secondary" />
        </Tooltip>
      );
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
  view: context.view,
  standalone: context.standalone,
});

const mapDispatchToProps = {};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Header);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(Header.styles)(TranslatedComponent);
