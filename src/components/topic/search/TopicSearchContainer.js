import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchFullTopicList } from '../../../actions/topicActions';

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

  handleMenuItemKeyDown = (item, event) => {
    switch (event.key) {
      case 'Enter':
        this.handleClick(item);
        break;
      default: break;
    }
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
          onKeyDown={this.handleMenuItemKeyDown.bind(this, item)}
          primaryText={(item.name.length > MAX_SUGGESTION_CHARS) ? `${item.name.substr(0, MAX_SUGGESTION_CHARS)}...` : item.name}
        />
      ),
    }));
    return resultsAsComponents;
  }

  render() {
    const { topicsCached } = this.props;
    const { formatMessage } = this.props.intl;
    const resultsAsComponents = this.resetIfRequested();
    if (topicsCached) {
      return (
        <div className="topic-search">
          <AutoComplete
            hintText={formatMessage(localMessages.searchHint)}
            fullWidth
            openOnFocus={false}
            onClick={this.resetIfRequested}
            dataSource={resultsAsComponents}
            maxSearchResults={10}
            filter={AutoComplete.fuzzyFilter}
          />
        </div>
      );
    }
    return (<div className="topic-search" />);
  }
}

TopicSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  topicResults: React.PropTypes.array.isRequired,
  topicsCached: React.PropTypes.bool.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  onTopicSelected: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.full.fetchStatus,
  topicResults: state.topics.full.list.topics,
  topicsCached: state.topics.full.list.cached,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchFullTopicList());
  },
  onTopicSelected: (item) => {
    dispatch(push(`/topics/${item.id}/summary`));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopicSearchContainer
      )
    )
  );
