import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '300px',
    maxHeight: '300px',
    overflowY: 'scroll',
  },
}));

const HighlightPopup = ({ highlight }) => {
  const classes = useStyles();
  const {
    comment: { text, emoji },
  } = highlight;

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        {emoji && (
          <Typography variant="h4" gutterBottom>
            {emoji}
          </Typography>
        )}
        {text && <Typography variant="body1">{text}</Typography>}
      </CardContent>
    </Card>
  );
};

HighlightPopup.propTypes = {
  highlight: PropTypes.shape({
    comment: PropTypes.shape({
      text: PropTypes.string,
      emoji: PropTypes.string,
    }),
  }),
};

HighlightPopup.defaultProps = {
  highlight: {},
};

export default HighlightPopup;
