import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMedia, fetchMedia } from '../../../actions/topicActions';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import MediaDetails from './MediaDetails';

const MediaContainer = (props) => {
  const { media, topicId, storiesId } = props;
  return (
    <div>
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2>{media.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={6} sm={12}>
            <MediaDetails media={media} />
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
  media: React.PropTypes.object.isRequired,
  mediaId: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.string.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.topics.selected.mediaSource.info.fetchStatus,
  mediaId: ownProps.params.mediaId,
  topicId: ownProps.params.topicId,
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
      composeAsyncWidget(
        MediaContainer
      )
    )
  );
