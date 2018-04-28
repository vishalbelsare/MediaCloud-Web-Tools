import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPublicTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';
import { TOPIC_SNAPSHOT_STATE_COMPLETED } from '../../../reducers/topics/selected/snapshots';

const localMessages = {
  empty: { id: 'topics.public.none', defaultMessage: 'There are no public topics for you to explore right now.' },
};

const PublicTopicsContainer = (props) => {
  const { topics, onSetFavorited, asyncFetch } = props;
  return (
    <Row>
      <Col lg={12}>
        <TopicPreviewList
          topics={topics.filter(t => t.state === TOPIC_SNAPSHOT_STATE_COMPLETED)}
          linkGenerator={t => `/topics/${t.topics_id}/summary`}
          onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); asyncFetch(); }}
          emptyMsg={localMessages.empty}
        />
      </Col>
    </Row>
  );
};

PublicTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: PropTypes.func,
  // from state
  topics: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.publicList.fetchStatus,
  topics: state.topics.publicList.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchPublicTopicsList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        PublicTopicsContainer
      )
    )
  );
