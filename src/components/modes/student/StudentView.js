import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Highlighter from '../../common/Highlighter';
import {
  DEFAULT_VISIBILITY,
  PRIVATE_VISIBILITY,
  PUBLIC_VISIBILITY,
} from '../../../config/settings';

const styles = theme => ({
  main: {
    textAlign: 'center',
    margin: theme.spacing(),
  },
  root: {
    overflow: 'hidden',
  },
});

export const StudentView = ({ classes, visibility }) => (
  <div className={classes.root}>
    <Grid container spacing={0}>
      <Grid item xs={12} className={classes.main}>
        <Highlighter visibility={visibility} />
      </Grid>
    </Grid>
  </div>
);

StudentView.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string,
    root: PropTypes.string,
  }).isRequired,
  visibility: PropTypes.oneOf([PRIVATE_VISIBILITY, PUBLIC_VISIBILITY]),
};

StudentView.defaultProps = {
  visibility: DEFAULT_VISIBILITY,
};

const StyledComponent = withStyles(styles)(StudentView);

export default withTranslation()(StyledComponent);
