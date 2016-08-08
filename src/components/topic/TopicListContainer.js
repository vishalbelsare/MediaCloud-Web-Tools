import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../common/AsyncContainer';
import TopicList from './TopicList';
import { fetchTopicsList } from '../../actions/topicActions';
import { pagedLocation } from '../util/paging';
import composePagedContainer from '../common/PagedContainer';

const localMessages = {
  topicsListTitle: { id: 'topics.list.title', defaultMessage: 'Recent Topics' },
};

const TopicListContainer = (props) => {
  const { topics, nextButton, previousButton } = props;
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.topicsListTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2>{title}</h2>
            <TopicList topics={topics} />
            { previousButton }
            { nextButton }
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

TopicListContainer.propTypes = {
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

const mapStateToProps = (state) => ({
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
