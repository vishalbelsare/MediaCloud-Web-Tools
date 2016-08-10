import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMedia, fetchMedia } from '../../../actions/topicActions';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import MediaDetails from './MediaDetails';
import MediaInlinkContainer from './MediaInlinkContainer';
import MediaOutlinkContainer from './MediaOutlinkContainer';
import MediaStoriesContainer from './MediaStoriesContainer';
import MediaSentenceCountContainer from './MediaSentenceCountContainer';
import MediaWordsContainer from './MediaWordsContainer';

const localMessages = {
  mainTitle: { id: 'media.details.mainTitle', defaultMessage: 'Media Source Details: {title}' },
};

const MediaContainer = (props) => {
  const { media, topicId, mediaId } = props;
  const titleHandler = parentTitle => `${media.name} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2><FormattedMessage {...localMessages.mainTitle} values={{ title: media.name }} /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12}>
            <MediaDetails media={media} />
          </Col>
          <Col lg={6} md={6} sm={12}>
            <MediaSentenceCountContainer topicId={topicId} mediaId={mediaId} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12}>
            <MediaWordsContainer topicId={topicId} mediaId={mediaId} />
          </Col>
          <Col lg={6} md={6} sm={12}>
            <MediaStoriesContainer topicId={topicId} mediaId={mediaId} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12}>
            <MediaInlinkContainer topicId={topicId} mediaId={mediaId} />
          </Col>
          <Col lg={6} md={6} sm={12}>
            <MediaOutlinkContainer topicId={topicId} mediaId={mediaId} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

MediaContainer.propTypes = {
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  intl: React.PropTypes.object.isRequired,
  // from parent
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
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
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        MediaContainer
      )
    )
  );
