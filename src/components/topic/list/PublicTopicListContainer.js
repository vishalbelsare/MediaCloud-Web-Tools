import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPublicTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';
import { TOPIC_PUBLIC } from '../../../lib/topicFilterUtil';

const PublicTopicListContainer = (props) => {
  const { topics } = props;
  return (
    <Row>
      <Col lg={12}>
        <TopicPreviewList
          topics={topics}
          currentFilter={TOPIC_PUBLIC}
          linkGenerator={c => `/topics/public/${c.topics_id}/summary`}
        />
      </Col>
    </Row>
  );
};

PublicTopicListContainer.propTypes = {
  // from state
  topics: PropTypes.array,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.publiclist.fetchStatus,
  topics: state.topics.publiclist.topics.public,
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
        PublicTopicListContainer
      )
    )
  );
