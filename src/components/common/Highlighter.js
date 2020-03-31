import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
} from 'react-pdf-highlighter';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Loader from './Loader';
import Sidebar from './SideBar';
import HighlightPopup from './HighlightPopup';
import NewHighlightPopup from './NewHighlightPopup';
import { HIGHLIGHT } from '../../config/appInstanceResourceTypes';
import {
  deleteAppInstanceResource,
  postAppInstanceResource,
} from '../../actions';
import HighlighterNotConfigured from './HighlighterNotConfigured';
import { showErrorToast } from '../../utils/toasts';
import {
  DEFAULT_VISIBILITY,
  PRIVATE_VISIBILITY,
  PUBLIC_VISIBILITY,
} from '../../config/settings';

const parseIdFromHash = () =>
  document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
  document.location.hash = '';
};

class Highlighter extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchPostAppInstanceResource: PropTypes.func.isRequired,
    currentUserId: PropTypes.string,
    highlights: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        content: PropTypes.object,
        comment: PropTypes.object,
        position: PropTypes.object,
      }),
    ),
    visibility: PropTypes.oneOf([PRIVATE_VISIBILITY, PUBLIC_VISIBILITY]),
    ready: PropTypes.bool.isRequired,
    settings: PropTypes.shape({
      headerVisible: PropTypes.bool.isRequired,
      collaborative: PropTypes.bool.isRequired,
      file: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    highlights: [],
    visibility: DEFAULT_VISIBILITY,
    currentUserId: null,
  };

  static styles = {};

  state = {
    sideBarOpen: true,
  };

  componentDidMount() {
    window.addEventListener(
      'hashchange',
      this.scrollToHighlightFromHash,
      false,
    );
  }

  scrollToHighlightFromHash = () => {
    const { t } = this.props;
    try {
      const highlight = this.getHighlightById(parseIdFromHash());

      if (highlight) {
        this.scrollViewerTo(highlight);
      }
    } catch {
      showErrorToast(t('Could not scroll to this highlight.'));
    }
  };

  // this function is used to proxy scrollTo
  // eslint-disable-next-line no-unused-vars
  scrollViewerTo = () => {};

  getHighlightById = id => {
    const { highlights } = this.props;

    return highlights.find(highlight => highlight.id === id);
  };

  addHighlight = highlight => {
    const {
      currentUserId,
      dispatchPostAppInstanceResource,
      visibility,
    } = this.props;

    dispatchPostAppInstanceResource({
      visibility,
      userId: currentUserId,
      data: highlight,
      type: HIGHLIGHT,
    });
  };

  render() {
    const { sideBarOpen } = this.state;
    const { highlights, ready, settings } = this.props;

    const { file: { uri } = {} } = settings;

    if (!uri) {
      return <HighlighterNotConfigured />;
    }

    if (!ready) {
      return <Loader />;
    }

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div
          style={{
            height: '100vh',
            width: '75vw',
            overflowY: 'scroll',
            position: 'relative',
          }}
        >
          <PdfLoader url={uri} beforeLoad={<Loader />}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={false}
                onScrollChange={resetHash}
                scrollRef={scrollTo => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                ) => (
                  <NewHighlightPopup
                    onOpen={transformSelection}
                    onConfirm={comment => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                    onCancel={hideTipAndSelection}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                  const isTextHighlight = !(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight highlight={highlight} onChange={() => {}} />
                  );

                  const handleFocus = popupContent => {
                    return setTip(highlight, () => popupContent);
                  };

                  const handleMouseOver = popupContent => {
                    return setTip(highlight, () => popupContent);
                  };

                  return (
                    <Popup
                      popupContent={<HighlightPopup highlight={highlight} />}
                      onFocus={handleFocus}
                      onMouseOver={handleMouseOver}
                      onMouseOut={hideTip}
                      onBlur={hideTip}
                      key={index}
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
        {sideBarOpen && <Sidebar highlights={highlights} />}
      </div>
    );
  }
}

const mapStateToProps = (
  { appInstanceResources, appInstance, context, users },
  ownProps,
) => {
  const { userId: currentUserId } = context;
  const { userId: selectedUserId, t } = ownProps;
  let highlights = appInstanceResources.content.filter(({ type }) => {
    return type === HIGHLIGHT;
  });

  if (selectedUserId) {
    highlights = appInstanceResources.content.filter(({ user }) => {
      return user === selectedUserId;
    });
  }

  return {
    currentUserId,
    users: users.content,
    activity: Boolean(appInstanceResources.activity.length),
    ready: appInstanceResources.ready,
    highlights: highlights.map(({ _id, data, user }) => {
      const userObj = users.content.find(({ id }) => id === user);
      const name = (userObj && userObj.name) || t('Anonymous');
      return { id: _id.toString(), ...data, userId: user, name };
    }),
    settings: appInstance.content.settings,
  };
};

const mapDispatchToProps = {
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Highlighter);

const StyledComponent = withStyles(Highlighter.styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
