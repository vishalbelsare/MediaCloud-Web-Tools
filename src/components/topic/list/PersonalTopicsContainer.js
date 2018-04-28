import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPersonalTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';

const localMessages = {
  empty: { id: 'topics.personal.none', defaultMessage: 'You haven\'t created any topics yet. Explore the public topics, or click the "Create a New Topic" button above to make your own.' },
};

const PersonalTopicsContainer = (props) => {
  const { topics, onSetFavorited, asyncFetch } = props;
  return (
    <Row>
      <Col lg={12}>
        <TopicPreviewList
          topics={topics}
          linkGenerator={t => `/topics/${t.topics_id}/summary`}
          onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); asyncFetch(); }}
          emptyMsg={localMessages.empty}
        />
      </Col>
    </Row>
  );
};

PersonalTopicsContainer.propTypes = {
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
  fetchStatus: state.topics.personalList.fetchStatus,
  topics: state.topics.personalList.topics,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchPersonalTopicsList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        PersonalTopicsContainer
      )
    )
  );
