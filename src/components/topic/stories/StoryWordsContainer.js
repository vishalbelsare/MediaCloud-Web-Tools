import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchStoryWords } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import DownloadButton from '../../common/DownloadButton';
import { getBrandDarkColor } from '../../../styles/colors';

class StoryWordsContainer extends React.Component {
  downloadCsv = () => {
    const { storiesId, topicId } = this.props;
    const url = `/api/topics/${topicId}/stories/${storiesId}/words.csv`;
    window.location = url;
  }
  render() {
    const { words } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...messages.topWords} /></h2>
        <OrderedWordCloud words={words} textColor={getBrandDarkColor()} showTooltips />
      </DataCard>
    );
  }
}

StoryWordsContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  storiesId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.story.words.fetchStatus,
  words: state.topics.selected.story.words.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchStoryWords(ownProps.topicId, ownProps.storiesId)); // fetch the info we need
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        StoryWordsContainer
      )
    )
  );
