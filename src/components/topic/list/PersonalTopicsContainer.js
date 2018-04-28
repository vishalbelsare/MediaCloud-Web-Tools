import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchPersonalTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';
import composePagedContainer from '../../common/PagedContainer';

const localMessages = {
  empty: { id: 'topics.personal.none', defaultMessage: 'You haven\'t created any topics yet. Explore the public topics, or click the "Create a New Topic" button above to make your own.' },
};

const PersonalTopicsContainer = (props) => {
  const { topics, onSetFavorited, asyncFetch, prevButton, nextButton } = props;
  return (
    <div className="personal-topics-list">
      <TopicPreviewList
        topics={topics}
        linkGenerator={t => `/topics/${t.topics_id}/summary`}
        onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); asyncFetch(); }}
        emptyMsg={localMessages.empty}
      />
      <Row>
        <Col lg={12}>
          {prevButton}
          {nextButton}
        </Col>
      </Row>
    </div>
  );
};

PersonalTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: PropTypes.func,
  // from state
  topics: PropTypes.array,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  prevButton: PropTypes.node,
  nextButton: PropTypes.node,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.personalList.fetchStatus,
  topics: state.topics.personalList.topics,
  links: state.topics.personalList.link_ids,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchPersonalTopicsList());
  },
  fetchPagedData: (props, linkId) => {
    dispatch(fetchPersonalTopicsList(linkId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    nextPage: () => {
      dispatchProps.fetchPagedData(stateProps, stateProps.links.next);
    },
    previousPage: () => {
      dispatchProps.fetchPagedData(stateProps, stateProps.links.previous);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        composePagedContainer(
          PersonalTopicsContainer
        )
      )
    )
  );
