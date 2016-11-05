import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchTopicTopWords } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import { ExploreButton, DownloadButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  helpTitle: { id: 'topic.summary.words.help.title', defaultMessage: 'About Top Words' },
  helpText: { id: 'topic.summary.words.help.into',
    defaultMessage: '<p>This is a visualization showing the top words in your Topic.</p>',
  },
};

class WordsSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/words.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  render() {
    const { topicId, filters, helpButton, words, width, height, maxFontSize, minFontSize, handleWordCloudClick } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <ExploreButton linkTo={filteredLinkTo(`/topics/${topicId}/words`, filters)} />
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.topWords} />
          {helpButton}
        </h2>
        <OrderedWordCloud
          words={words}
          textColor={getBrandDarkColor()}
          width={width}
          height={height}
          maxFontSize={maxFontSize}
          minFontSize={minFontSize}
          onWordClick={handleWordCloudClick}
        />
      </DataCard>
    );
  }
}

WordsSummaryContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  maxFontSize: React.PropTypes.number,
  minFontSize: React.PropTypes.number,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  words: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
  handleWordCloudClick: React.PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topWords.fetchStatus,
  words: state.topics.selected.summary.topWords.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchTopicTopWords(props.topicId, props.filters));
  },
  handleWordCloudClick: (word) => {
    const params = generateParamStr({ stem: word.stem, term: word.term });
    let url = `/topics/${ownProps.topicId}/words/${word.stem}*?`;
    url += params;
    window.location = url;
    dispatch(push(url));
  },
  asyncFetch: () => {
    dispatch(fetchTopicTopWords(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.wordcloudHelpText])(
        composeAsyncContainer(
          WordsSummaryContainer
        )
      )
    )
  );
