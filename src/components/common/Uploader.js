import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { DragDrop } from '@uppy/react';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_NUM_FILES,
} from '../../config/settings';
import { FILE_UPLOAD_ENDPOINT } from '../../config/api';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { deleteFile, patchAppInstance } from '../../actions';
import { showErrorToast, showWarningToast } from '../../utils/toasts';

class Uploader extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchDeleteFile: PropTypes.func.isRequired,
    dispatchPatchAppInstance: PropTypes.func.isRequired,
    standalone: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
      headerVisible: PropTypes.bool.isRequired,
      collaborative: PropTypes.bool.isRequired,
      file: PropTypes.object,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const {
      dispatchDeleteFile,
      dispatchPatchAppInstance,
      standalone,
      t,
      settings,
    } = props;

    this.uppy = Uppy({
      restrictions: {
        maxNumberOfFiles: MAX_NUM_FILES,
        maxFileSize: MAX_FILE_SIZE,
        allowedFileTypes: ALLOWED_FILE_TYPES,
      },
      autoProceed: true,
    });

    // endpoint
    this.uppy.use(XHRUpload, {
      // on standalone flag upload should fail
      endpoint: standalone || FILE_UPLOAD_ENDPOINT,
    });

    this.uppy.on('complete', ({ successful }) => {
      const { file: { uri: prevUri } = {} } = settings;
      // delete previous file
      if (prevUri) {
        dispatchDeleteFile(prevUri);
      }

      successful.forEach(({ response: { body: uri }, name }) => {
        const newSettings = {
          ...settings,
          file: {
            name,
            uri,
          },
        };
        dispatchPatchAppInstance({
          data: newSettings,
        });
      });
    });

    this.uppy.on('error', (file, error) => {
      if (standalone) {
        showWarningToast(
          t('This is just a preview. No files can be uploaded.'),
        );
      } else {
        showErrorToast(error);
      }
    });

    this.uppy.on('upload-error', (file, error, response) => {
      if (standalone) {
        showWarningToast(
          t('This is just a preview. No files can be uploaded.'),
        );
      } else {
        showErrorToast(response);
      }
    });

    this.uppy.on('restriction-failed', (file, error) => {
      if (standalone) {
        showWarningToast(
          t('This is just a preview. No files can be uploaded.'),
        );
      } else {
        showErrorToast(error);
      }
    });
  }

  render() {
    const { t } = this.props;
    return (
      <DragDrop
        uppy={this.uppy}
        locale={{
          strings: {
            dropHereOr: t('Drop Here or Click to Browse'),
          },
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  const {
    context: { userId, standalone },
    appInstance,
  } = state;
  return {
    standalone,
    userId,
    settings: appInstance.content.settings,
  };
};

const mapDispatchToProps = {
  dispatchPatchAppInstance: patchAppInstance,
  dispatchDeleteFile: deleteFile,
};

const TranslatedComponent = withTranslation()(Uploader);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslatedComponent);
