import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';
import { TextField, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { withTranslation } from 'react-i18next';
import { closeSettings, deleteFile, patchAppInstance } from '../../../actions';
import Loader from '../../common/Loader';
import { PUBLIC_VISIBILITY } from '../../../config/settings';
import Uploader from '../../common/Uploader';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  uploader: {
    padding: theme.spacing(),
  },
});

class Settings extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      paper: PropTypes.string,
      uploader: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
      headerVisible: PropTypes.bool.isRequired,
      collaborative: PropTypes.bool.isRequired,
      file: PropTypes.object,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchCloseSettings: PropTypes.func.isRequired,
    dispatchDeleteFile: PropTypes.func.isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
    i18n: PropTypes.shape({
      defaultNS: PropTypes.string,
    }).isRequired,
  };

  saveSettings = settingsToChange => {
    const { settings, dispatchPatchAppInstance } = this.props;
    const newSettings = {
      ...settings,
      ...settingsToChange,
    };
    dispatchPatchAppInstance({
      data: newSettings,
    });
  };

  handleChangeHeaderVisibility = () => {
    const {
      settings: { headerVisible },
    } = this.props;
    const settingsToChange = {
      headerVisible: !headerVisible,
    };
    this.saveSettings(settingsToChange);
  };

  handleChangeStudentAnnotationVisibility = () => {
    const {
      settings: { collaborative },
    } = this.props;
    const settingsToChange = {
      collaborative: !collaborative,
    };
    this.saveSettings(settingsToChange);
  };

  handleClose = () => {
    const { dispatchCloseSettings } = this.props;
    dispatchCloseSettings();
  };

  handleDeleteFile = () => {
    const { settings } = this.props;
    const { file = {} } = settings;
    const { dispatchDeleteFile } = this.props;

    dispatchDeleteFile(file.uri);
    this.saveSettings({ file: {} });
  };

  renderModalContent() {
    const { t, settings, activity, classes } = this.props;
    const { headerVisible, collaborative, file = {} } = settings;

    if (activity) {
      return <Loader />;
    }

    const headerVisibilitySwitch = (
      <Switch
        color="primary"
        checked={headerVisible}
        onChange={this.handleChangeHeaderVisibility}
        value="headerVisibility"
      />
    );

    const studentUploadVisibilitySwitch = (
      <Switch
        color="primary"
        checked={collaborative}
        onChange={this.handleChangeStudentAnnotationVisibility}
        value="collaborative"
      />
    );

    const deleteCurrentFileButton = (
      <InputAdornment position="end">
        <IconButton
          aria-label={t('Delete File')}
          onClick={this.handleDeleteFile}
        >
          <DeleteIcon />
        </IconButton>
      </InputAdornment>
    );

    return (
      <>
        <Typography>{t('PDF File')}</Typography>
        <div className={classes.uploader}>
          <Uploader visibility={PUBLIC_VISIBILITY} />
        </div>
        <TextField
          label={t('URL')}
          value={file.uri}
          variant="outlined"
          InputProps={{
            endAdornment: deleteCurrentFileButton,
          }}
          disabled
          fullWidth
        />
        <FormControlLabel
          control={headerVisibilitySwitch}
          label={t('Show Header to Students')}
        />
        <Tooltip
          title={t(
            'When enabled, student annotations will be visible to other students. Teacher annotations are always visible to all students.',
          )}
        >
          <FormControlLabel
            control={studentUploadVisibilitySwitch}
            label={t('Collaborative Mode')}
          />
        </Tooltip>
      </>
    );
  }

  render() {
    const { open, classes, t } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h5" id="modal-title" gutterBottom>
              {t('Settings')}
            </Typography>
            {this.renderModalContent()}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ layout, appInstance }) => {
  return {
    open: layout.settings.open,
    settings: appInstance.content.settings,
    activity: Boolean(appInstance.activity.length),
  };
};

const mapDispatchToProps = {
  dispatchCloseSettings: closeSettings,
  dispatchPatchAppInstance: patchAppInstance,
  dispatchDeleteFile: deleteFile,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(styles)(TranslatedComponent);
