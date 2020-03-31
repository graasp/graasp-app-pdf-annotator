import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Paper, TextField, Tooltip, withStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@material-ui/icons';

const EMOJIS = ['👍️', '👎', '☝', '👌'];

class NewHighlightPopup extends Component {
  static styles = theme => ({
    root: {
      padding: theme.spacing(3),
    },
    form: {
      width: '100%',
    },
  });

  static propTypes = {
    onUpdate: PropTypes.func,
    onConfirm: PropTypes.func,
    onOpen: PropTypes.func,
    onCancel: PropTypes.func,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      form: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    onUpdate: () => {},
    onConfirm: () => {},
    onOpen: () => {},
    onCancel: () => {},
  };

  state = {
    compact: true,
    text: '',
    emoji: '',
  };

  // for TipContainer
  componentDidUpdate(nextProps, nextState) {
    const { onUpdate } = this.props;
    const { compact } = this.state;

    if (onUpdate && compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen, onCancel, t, classes } = this.props;
    const { compact, text, emoji } = this.state;

    return (
      <Paper variant="outlined" className={classes.root}>
        {compact ? (
          <Tooltip title={t('Add Highlight')}>
            <IconButton
              color="primary"
              onClick={() => {
                onOpen();
                this.setState({ compact: false });
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <form
            className={classes.form}
            onSubmit={event => {
              event.preventDefault();
              onConfirm({ text, emoji });
            }}
          >
            <TextField
              color="primary"
              placeholder={t('Add a comment here...')}
              value={text}
              onChange={event => this.setState({ text: event.target.value })}
              fullWidth
              autoFocus
              multiline
              rowsMax={10}
              ref={node => {
                if (node) {
                  node.focus();
                }
              }}
            />
            <FormControl component="fieldset">
              <RadioGroup
                color="primary"
                aria-label="emoji"
                name="emoji"
                value={emoji}
                onChange={event => this.setState({ emoji: event.target.value })}
                row
              >
                {EMOJIS.map(_emoji => (
                  <FormControlLabel
                    key={_emoji}
                    value={_emoji}
                    control={<Radio />}
                    label={_emoji}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <div align="right">
              <Tooltip title={t('Cancel')}>
                <IconButton color="secondary" onClick={onCancel}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('Save')}>
                <IconButton type="submit" color="primary">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </div>
          </form>
        )}
      </Paper>
    );
  }
}

const StyledComponent = withStyles(NewHighlightPopup.styles)(NewHighlightPopup);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
