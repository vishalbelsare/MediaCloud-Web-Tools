import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import { fetchTopicTopStories, sortTopicTopStories, filterByFocus } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import Permissioned from '../../common/Permissioned';
import LinkWithFilters from '../LinkWithFilters';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { ExploreButton, DownloadButton } from '../../common/IconButton';
import StoryTable from '../StoryTable';
import messages from '../../../resources/messages';
import { filteredLinkTo, filteredLocation, filtersAsUrlParams } from '../../util/location';

const localMessages = {
  title: { id: 'topic.summary.stories.title', defaultMessage: 'Top Stories' },
  descriptionIntro: { id: 'topic.summary.stories.help.title', defaultMessage: 'The top stories within this topic can suggest the main ways it is talked about.  Sort by different measures to get a better picture of a story\'s influence.' },
};

const NUM_TO_SHOW = 10;

class StoriesSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, sort, fetchData } = this.props;
    if ((nextProps.filters.timespanId !== filters.timespanId) ||
        (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  };
  downloadCsv = () => {
    const { filters, sort, topicId } = this.props;
    const url = `/api/topics/${topicId}/stories.csv?${filtersAsUrlParams(filters)}&sort=${sort}`;
    window.location = url;
  }
  render() {
    const { stories, sort, topicId, filters, handleFocusSelected } = this.props;
    const { formatMessage } = this.props.intl;
    const exploreUrl = `/topics/${topicId}/stories`;
    return (
      <DataCard>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={filteredLinkTo(exploreUrl, filters)} />
            <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
          </div>
        </Permissioned>
        <h2>
          <LinkWithFilters to={`/topics/${topicId}/stories`}>
            <FormattedMessage {...localMessages.title} />
          </LinkWithFilters>
        </h2>
        <StoryTable
          stories={stories}
          topicId={topicId}
          onChangeSort={this.onChangeSort}
          onChangeFocusSelection={handleFocusSelected}
          sortedBy={sort}
          maxTitleLength={50}
        />
      </DataCard>
    );
  }
}

StoriesSummaryContainer.propTypes = {
  // from the composition chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  handleFocusSelected: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topStories.fetchStatus,
  sort: state.topics.selected.summary.topStories.sort,
  stories: state.topics.selected.summary.topStories.stories,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchTopicTopStories(props.topicId, params));
  },
  handleFocusSelected: (focusId) => {
    const params = {
      ...ownProps.filters,
      focusId,
      timespanId: null,
    };
    const newLocation = filteredLocation(ownProps.location, params);
    dispatch(push(newLocation));
    dispatch(filterByFocus(focusId));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData({
        topicId: ownProps.topicId,
        filters: ownProps.filters,
        sort: stateProps.sort,
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeDescribedDataCard(localMessages.descriptionIntro, messages.storiesTableHelpText)(
        composeAsyncContainer(
          StoriesSummaryContainer
        )
      )
    )
  );
