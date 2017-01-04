import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import StoryTable from '../StoryTable';
import { fetchTopicInfluentialStories, sortTopicInfluentialStories } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { pagedAndSortedLocation } from '../../util/location';
import composePagedContainer from '../../common/PagedContainer';

const localMessages = {
  title: { id: 'topic.influentialStories.title', defaultMessage: 'Influential Stories' },
};

class InfluentialStoriesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort, links } = this.props;
    if ((nextProps.filters.timespanId !== filters.timespanId) || (nextProps.sort !== sort) || (nextProps.links.current !== links.current)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  downloadCsv = () => {
    const { filters, sort, topicId } = this.props;
    const url = `/api/topics/${topicId}/stories.csv?snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId}&sort=${sort}`;
    window.location = url;
  }
  render() {
    const { stories, sort, topicId, previousButton, nextButton, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    return (
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Title render={titleHandler} />
            <DataCard border={false}>
              <div className="actions">
                <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
              </div>
              <h2>
                <FormattedMessage {...localMessages.title} />
                {helpButton}
              </h2>
              <StoryTable topicId={topicId} stories={stories} onChangeSort={this.onChangeSort} sortedBy={sort} />
              { previousButton }
              { nextButton }
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }
}

InfluentialStoriesContainer.ROWS_PER_PAGE = 50;

InfluentialStoriesContainer.propTypes = {
  // from the composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  location: React.PropTypes.object.isRequired,
  // from parent
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array.isRequired,
  topicInfo: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  links: React.PropTypes.object,
  topicId: React.PropTypes.number.isRequired,
  // from PagedContainer wrapper
  nextButton: React.PropTypes.node,
  previousButton: React.PropTypes.node,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.stories.fetchStatus,
  sort: state.topics.selected.stories.sort,
  stories: state.topics.selected.stories.stories,
  links: state.topics.selected.stories.link_ids,
  filters: state.topics.selected.filters,
  topicInfo: state.topics.selected.info,
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props, linkId) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: InfluentialStoriesContainer.ROWS_PER_PAGE,
      linkId,
    };
    dispatch(fetchTopicInfluentialStories(props.topicId, params))
      .then((results) => {
        // only update the url if it has changed
        if ((results.link_ids.current.toString() !== ownProps.location.query.linkId) ||
            (props.sort !== ownProps.location.query.sort)) {
          dispatch(push(pagedAndSortedLocation(
            ownProps.location,
            results.link_ids.current,
            props.sort,
            props.filters
          )));
        }
      });
  },
  sortData: (sort) => {
    dispatch(push(pagedAndSortedLocation(ownProps.location, null, sort)));
    dispatch(sortTopicInfluentialStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
    nextPage: () => {
      dispatchProps.fetchData(stateProps, stateProps.links.next);
    },
    previousPage: () => {
      dispatchProps.fetchData(stateProps, stateProps.links.previous);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(messages.storiesTableHelpTitle, messages.storiesTableHelpText)(
        composePagedContainer(
          composeAsyncContainer(
            InfluentialStoriesContainer
          )
        )
      )
    )
  );
