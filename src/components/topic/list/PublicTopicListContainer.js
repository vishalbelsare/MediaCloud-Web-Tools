import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPublicTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';

const PublicTopicListContainer = (props) => {
  const { topics } = props;
  return (
    <Row>
      <Col lg={12}>
        <TopicPreviewList
          topics={topics}
          linkGenerator={c => `/topics/public/${c.topics_id}/summary`}
        />
      </Col>
    </Row>
  );
};

PublicTopicListContainer.propTypes = {
  // from state
  topics: React.PropTypes.array,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
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
