import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StudentView from './StudentView';
import { DEFAULT_VIEW, FEEDBACK_VIEW } from '../../../config/views';
import { getAppInstanceResources, getUsers } from '../../../actions';
import {
  DEFAULT_VISIBILITY,
  PRIVATE_VISIBILITY,
  PUBLIC_VISIBILITY,
} from '../../../config/settings';

class StudentMode extends Component {
  static propTypes = {
    appInstanceId: PropTypes.string,
    view: PropTypes.string,
    dispatchGetUsers: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    userId: PropTypes.string,
    visibility: PropTypes.oneOf([PRIVATE_VISIBILITY, PUBLIC_VISIBILITY]),
  };

  static defaultProps = {
    view: 'normal',
    appInstanceId: null,
    userId: null,
    visibility: DEFAULT_VISIBILITY,
  };

  constructor(props) {
    super(props);
    const { userId } = props;

    // sets a minimum height when embedded
    if (window.frameElement) {
      window.frameElement.style['min-height'] = '900px';
    }

    // get light users
    props.dispatchGetUsers();

    // get the resources for this user
    props.dispatchGetAppInstanceResources({ userId });
  }

  componentDidUpdate({ appInstanceId: prevAppInstanceId }) {
    const {
      appInstanceId,
      dispatchGetAppInstanceResources,
      userId,
    } = this.props;
    // handle receiving the app instance id
    if (appInstanceId !== prevAppInstanceId) {
      dispatchGetAppInstanceResources({ userId });
    }
  }

  render() {
    const { view, visibility } = this.props;
    switch (view) {
      case FEEDBACK_VIEW:
      case DEFAULT_VIEW:
      default:
        return <StudentView visibility={visibility} />;
    }
  }
}
const mapStateToProps = ({ context, appInstance }) => {
  const { userId, appInstanceId } = context;
  const { collaborative } = appInstance.content.settings;
  // visibility determines whether resources are public or private
  const visibility = collaborative ? PUBLIC_VISIBILITY : PRIVATE_VISIBILITY;
  return {
    userId,
    appInstanceId,
    visibility,
  };
};

const mapDispatchToProps = {
  dispatchGetUsers: getUsers,
  dispatchGetAppInstanceResources: getAppInstanceResources,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StudentMode);

export default ConnectedComponent;
