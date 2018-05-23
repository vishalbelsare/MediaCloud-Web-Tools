import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import ActionMenu from '../../common/ActionMenu';
import composeSummarizedVisualization from './SummarizedVizualization';
import { DownloadButton } from '../../common/IconButton';
import { queryChangedEnoughToUpdate, postToDownloadUrl, downloadExplorerSvg } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import QueryResultsSelector from './QueryResultsSelector';
import WordSpace from '../../vis/WordSpace';
import composeAsyncContainer from '../../common/AsyncContainer';

const localMessages = {
  title: { id: 'explorer.topWords.title', defaultMessage: 'Word Space' },
  descriptionIntro: { id: 'explorer.topWords.help.title', defaultMessage: '<p>Understanding which words are used together can help you find sub-conversations within the reporting about your issue.  We created this chart to show information about how the top 50 words are used. The bigger and darker a word is, the more it is used. Words are laid out based on how they are used in general news reporting (not based on the stories matching your query). Rollover a word to highlight words used in similar phrases in general news reporting.</p>' },
  noGoogleW2VData: { id: 'wordcloud.editable.mode.googleW2V.noData', defaultMessage: 'Sorry, but the Google News word2vec data is missing.' },
};

const WORD_SPACE_DOM_ID = 'query-word-space-wrapper';

class QueryWordSpaceResultsContainer extends React.Component {
  state = {
    selectedQueryIndex: 0,
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
  }
  handleDownloadCsv = (query) => {
    postToDownloadUrl('/api/explorer/words/wordcount.csv', query);
  }
  render() {
    const { results, queries } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <QueryResultsSelector
          options={queries.map(q => ({ label: q.label, index: q.index, color: q.color }))}
          onQuerySelected={index => this.setState({ selectedQueryIndex: index })}
        />
        <WordSpace
          words={results[this.state.selectedQueryIndex].list.slice(0, 50)}
          domId={`${WORD_SPACE_DOM_ID}-${this.state.selectedQueryIndex}`}
          xProperty="google_w2v_x"
          yProperty="google_w2v_y"
          noDataMsg={localMessages.noGoogleW2VData}
          length={660}
        />
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            {queries.map((q, idx) =>
              <span key={`wordspace-actions-${idx}`}>
                <MenuItem
                  className="action-icon-menu-item"
                  primaryText={formatMessage(messages.downloadDataCsv, { name: q.label })}
                  rightIcon={<DownloadButton />}
                  onTouchTap={() => this.handleDownloadCsv(q)}
                />
                <MenuItem
                  className="action-icon-menu-item"
                  primaryText={formatMessage(messages.downloadDataSvg, { name: q.label })}
                  rightIcon={<DownloadButton />}
                  onTouchTap={() => {
                    const svgChild = document.getElementById(WORD_SPACE_DOM_ID);
                    downloadExplorerSvg(q.label, 'sampled-word-space', svgChild);
                  }}
                />
              </span>
            )}
          </ActionMenu>
        </div>
      </div>
    );
  }
}

QueryWordSpaceResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleWordCloudClick: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.topWords.fetchStatus,
  results: state.explorer.topWords.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleWordCloudClick: (word) => {
    ownProps.onQueryModificationRequested(word.term);
  },
  asyncFetch: () => {
    // pass through because the WordsResults container fetches all the data for us!
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeSummarizedVisualization(localMessages.title, localMessages.descriptionIntro, messages.wordSpaceLayoutHelp)(
        composeAsyncContainer(
          QueryWordSpaceResultsContainer
        )
      )
    )
  );
