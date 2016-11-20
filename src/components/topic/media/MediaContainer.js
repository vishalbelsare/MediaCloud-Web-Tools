import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { selectMedia, fetchMedia } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import MediaDetails from './MediaDetails';
import MediaInlinkContainer from './MediaInlinkContainer';
import MediaOutlinkContainer from './MediaOutlinkContainer';
import MediaStoriesContainer from './MediaStoriesContainer';
import MediaSentenceCountContainer from './MediaSentenceCountContainer';
import MediaWordsContainer from './MediaWordsContainer';
import messages from '../../../resources/messages';
import { RemoveButton } from '../../common/IconButton';
import ComingSoon from '../../common/ComingSoon';
import MediaSourceIcon from '../../common/icons/MediaSourceIcon';
import Permissioned from '../Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';

const localMessages = {
  mainTitle: { id: 'media.details.mainTitle', defaultMessage: 'Media Source Details: {title}' },
  removeTitle: { id: 'story.details.remove', defaultMessage: 'Remove from Next Snapshot' },
  removeAbout: { id: 'story.details.remove.about', defaultMessage: 'If media source is clearly not related to the Topic, or is messing up your analysis, you can remove it from the next Snapshot.  Be careful, because this means it won\'t show up anywhere on the new Snapshot you generate.' },
};

class MediaContainer extends React.Component {

  state = {
    open: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.mediaId !== this.props.mediaId) {
      const { fetchData } = this.props;
      fetchData(nextProps.mediaId);
    }
  }

  handleRemoveClick = () => {
    this.setState({ open: true });
  };

  handleRemoveDialogClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { media, topicId, mediaId } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${media.name} | ${parentTitle}`;
    const dialogActions = [
      <FlatButton
        label={formatMessage(messages.ok)}
        primary
        onClick={this.handleRemoveDialogClose}
      />,
    ];
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h1>
                <span className="actions">
                  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                    <RemoveButton tooltip={formatMessage(localMessages.removeTitle)} onClick={this.handleRemoveClick} />
                  </Permissioned>
                </span>
                <MediaSourceIcon />
                <FormattedMessage {...localMessages.mainTitle} values={{ title: media.name }} />
              </h1>
            </Col>
          </Row>
          <Dialog
            title={formatMessage(localMessages.removeTitle)}
            actions={dialogActions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleRemoveDialogClose}
          >
            <p><FormattedMessage {...localMessages.removeAbout} /></p>
            <ComingSoon />
          </Dialog>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <MediaDetails media={media} />
            </Col>
            <Col lg={6} md={6} sm={12}>
              <MediaSentenceCountContainer topicId={topicId} mediaId={mediaId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <MediaStoriesContainer topicId={topicId} mediaId={mediaId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <MediaInlinkContainer topicId={topicId} mediaId={mediaId} />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <MediaOutlinkContainer topicId={topicId} mediaId={mediaId} />
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12}>
              <MediaWordsContainer topicId={topicId} mediaId={mediaId} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

MediaContainer.propTypes = {
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  intl: React.PropTypes.object.isRequired,
  // from parent
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  media: React.PropTypes.object.isRequired,
  mediaId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.mediaSource.info.fetchStatus,
  mediaId: parseInt(ownProps.params.mediaId, 10),
  topicId: parseInt(ownProps.params.topicId, 10),
  media: state.topics.selected.mediaSource.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(selectMedia(ownProps.params.mediaId));    // save it to the state
    dispatch(fetchMedia(ownProps.params.topicId, ownProps.params.mediaId)); // fetch the info we need
  },
  fetchData: (mediaId) => {
    dispatch(selectMedia(mediaId));    // save it to the state
    dispatch(fetchMedia(mediaId)); // fetch the info we need
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        MediaContainer
      )
    )
  );
