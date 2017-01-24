import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import LoadingSpinner from '../../common/LoadingSpinner';
import { FETCH_ONGOING } from '../../../lib/fetchConstants';
import { fetchMatchingTopics } from '../../../actions/topicActions';

const MAX_SUGGESTION_CHARS = 40;

const localMessages = {
  searchHint: { id: 'topics.search.hint', defaultMessage: 'Search by topic name' },
};

class TopicSearchContainer extends React.Component {

  handleClick = (item) => {
    const { onTopicSelected } = this.props;
    if (item) {
      if (onTopicSelected) {
        onTopicSelected(item);
      }
    }
  }

  shouldFireSearch = () => {
    if (this.props.topicResults === undefined || this.props.topicResults.length === 0) {
      return true;
    }
    return false;
  }

  resetIfRequested = () => {
    const { topicResults } = this.props;
    let results = [];
    results = results.concat(topicResults);
    const resultsAsComponents = results.map(item => ({
      text: item.name,
      value: (
        <MenuItem
          onClick={() => this.handleClick(item)}
          primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}
        />
      ),
    }));
    return resultsAsComponents;
  }

  handleUpdateInput = () => {
    const { search } = this.props;
    if (this.shouldFireSearch()) {
      search();
    }
  }

  render() {
    const { topicFetchStatus } = this.props;
    const { formatMessage } = this.props.intl;
    const resultsAsComponents = this.resetIfRequested();
    const isFetching = (topicFetchStatus === FETCH_ONGOING);
    const fetchingStatus = (isFetching) ? <LoadingSpinner size={15} /> : null;
    return (
      <div className="topic-search">
        <div className="fetching">{fetchingStatus}</div>
        <AutoComplete
          hintText={formatMessage(localMessages.searchHint)}
          fullWidth
          openOnFocus
          onClick={this.resetIfRequested}
          dataSource={resultsAsComponents}
          onUpdateInput={this.handleUpdateInput}
          maxSearchResults={10}
          filter={AutoComplete.fuzzyFilter}
        />
      </div>
    );
  }

}

TopicSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  topicFetchStatus: React.PropTypes.string.isRequired,
  topicResults: React.PropTypes.array.isRequired,
  // from dispatch
  search: React.PropTypes.func.isRequired,
  onTopicSelected: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topicFetchStatus: state.topics.matching.fetchStatus,
  topicResults: state.topics.matching.list,
});

const mapDispatchToProps = dispatch => ({
  search: () => {
    dispatch(fetchMatchingTopics());
  },
  onTopicSelected: (item) => {
    dispatch(push(`/topics/${item.id}/summary`));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicSearchContainer
    )
  );
