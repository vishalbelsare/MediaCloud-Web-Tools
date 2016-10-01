import React from 'react';
import { push } from 'react-router-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicsList } from '../../../actions/topicActions';
import { pagedLocation } from '../../util/location';
import composePagedContainer from '../../common/PagedContainer';
import TopicList from './TopicList';

const localMessages = {
  topicsListTitle: { id: 'topics.list.title', defaultMessage: 'All Topics' },
};

const TopicListContainer = (props) => {
  const { topics, nextButton, previousButton, onChangeFavorited } = props;
  return (
    <Row>
      <Col lg={12} md={12} sm={12}>
        <h2><FormattedMessage {...localMessages.topicsListTitle} /></h2>
        <TopicList topics={topics} onChangeFavorited={onChangeFavorited} />
        { previousButton }
        { nextButton }
      </Col>
    </Row>
  );
};

TopicListContainer.propTypes = {
  // from parent
  onChangeFavorited: React.PropTypes.func.isRequired,
  // from state
  topics: React.PropTypes.array.isRequired,
  links: React.PropTypes.object,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from PagedContainer wrapper
  nextButton: React.PropTypes.node,
  previousButton: React.PropTypes.node,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.all.fetchStatus,
  topics: state.topics.all.topics,
  links: state.topics.all.link_ids,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicsList());
  },
  fetchPagedData: (props, linkId) => {
    dispatch(fetchTopicsList(linkId))
      .then(() => {
        dispatch(push(pagedLocation(ownProps.location, linkId)));
      });
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
      composePagedContainer(
        composeAsyncContainer(
          TopicListContainer
        )
      )
    )
  );
