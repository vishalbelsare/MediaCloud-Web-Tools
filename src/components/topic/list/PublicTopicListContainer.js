import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPublicTopicsList } from '../../../actions/topicActions';
import TopicIcon from '../../common/icons/TopicIcon';
import ContentPreview from '../../common/ContentPreview';

const PublicTopicListContainer = (props) => {
  const { topics } = props;
  return (
    <Row>
      <Col lg={12} md={12} sm={12}>
        <ContentPreview
          items={topics}
          itemType="topics"
          classStyle="browse-items"
          icon={<TopicIcon height="25" />}
          linkInfo={c => `topics/${c.topics_id}`}
          linkDisplay={c => c.name}
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
