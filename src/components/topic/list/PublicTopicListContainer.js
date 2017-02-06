import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPublicTopicsList } from '../../../actions/topicActions';
import PublicTopics from './PublicTopics';

const localMessages = {
  topicsListTitle: { id: 'topics.list.title', defaultMessage: 'All Public Topics' },
};

const PublicTopicListContainer = (props) => {
  const { topics } = props;
  return (
    <Row>
      <Col lg={12} md={12} sm={12}>
        <h2><FormattedMessage {...localMessages.topicsListTitle} /></h2>
        <PublicTopics topics={topics} />
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
  topics: state.topics.publiclist.topics,
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
