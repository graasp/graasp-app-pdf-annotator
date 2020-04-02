import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Collapse,
  makeStyles,
  ListItemAvatar,
  Tooltip,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  deleteAppInstanceResource,
  getAppInstanceResources,
  getUsers,
} from '../../actions';
import { TEACHER_MODES } from '../../config/settings';
import getInitials from '../../utils/getInitials';

const PREVIEW_COMMENT_TEXT_LENGTH = 100;

const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

const resetHash = () => {
  document.location.hash = '';
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '25vw',
    padding: theme.spacing(),
  },
  icon: {
    height: 'auto',
  },
}));

const SideBar = ({
  t,
  highlights,
  dispatchDeleteAppInstanceResource,
  dispatchGetAppInstanceResources,
  dispatchGetUsers,
  userId,
  mode,
}) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleRefresh = () => {
    dispatchGetAppInstanceResources({ userId });
    dispatchGetUsers();
  };

  return (
    <div className={classes.root}>
      <div align="right">
        <IconButton color="primary" onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </div>
      <List dense>
        {highlights.map((highlight, index) => {
          const {
            comment = {},
            position = {},
            id,
            userId: highlightUserId,
            name,
          } = highlight;

          // can only delete own annotations in student mode,
          // but teachers can delete everyone's comments
          const canDelete =
            highlightUserId === userId || TEACHER_MODES.includes(mode);

          const { text: commentText, emoji } = comment;
          const { pageNumber } = position;

          const selected = selectedIndex === index;
          const initials = getInitials(name);

          let previewCommentText = _.truncate(commentText, {
            length: PREVIEW_COMMENT_TEXT_LENGTH,
          });
          if (emoji) {
            previewCommentText = `${emoji} ${previewCommentText}`;
          }
          return (
            <div key={id}>
              <ListItem
                onClick={() => {
                  if (!selected) {
                    setSelectedIndex(index);
                    updateHash(highlight);
                  } else {
                    setSelectedIndex(-1);
                    resetHash();
                  }
                }}
                button
              >
                <ListItemAvatar>
                  <Tooltip title={name}>
                    <Avatar>{initials}</Avatar>
                  </Tooltip>
                </ListItemAvatar>
                <ListItemText
                  primary={previewCommentText}
                  secondary={`${t('Page')} ${pageNumber}`}
                />
                <ListItemSecondaryAction>
                  {canDelete && (
                    <IconButton
                      edge="end"
                      aria-label={t('Delete')}
                      onClick={() => dispatchDeleteAppInstanceResource(id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={selected} timeout="auto" unmountOnExit>
                <ListItem>
                  <ListItemText primary={commentText} />
                </ListItem>
              </Collapse>
            </div>
          );
        })}
      </List>
    </div>
  );
};

SideBar.propTypes = {
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.object,
      comment: PropTypes.object,
      position: PropTypes.object,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  dispatchDeleteAppInstanceResource: PropTypes.func.isRequired,
  dispatchGetAppInstanceResources: PropTypes.func.isRequired,
  dispatchGetUsers: PropTypes.func.isRequired,
};

SideBar.defaultProps = {
  highlights: [],
  userId: null,
};

const mapStateToProps = ({ context }) => ({
  userId: context.userId,
  mode: context.mode,
});

const mapDispatchToProps = {
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchGetUsers: getUsers,
};

const TranslatedComponent = withTranslation()(SideBar);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslatedComponent);

export default ConnectedComponent;
