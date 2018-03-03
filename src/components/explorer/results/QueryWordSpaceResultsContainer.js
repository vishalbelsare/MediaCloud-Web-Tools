import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import ActionMenu from '../../common/ActionMenu';
import composeSummarizedVisualization from './SummarizedVizualization';
import { DownloadButton } from '../../common/IconButton';
import { queryChangedEnoughToUpdate, postToDownloadUrl } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import QueryResultsSelector from './QueryResultsSelector';
import Word2VecChart from '../../vis/Word2VecChart';
import { downloadSvg } from '../../util/svg';
import composeAsyncContainer from '../../common/AsyncContainer';

const localMessages = {
  title: { id: 'explorer.topWords.title', defaultMessage: 'Word Space' },
  descriptionIntro: { id: 'explorer.topWords.help.title', defaultMessage: '<p>Understanding which words are used together can help you find sub-conversations with the reporting about your issue.  This chart includes the top words, laying them out based on which words tend to be used together the most in news coverage online.  Words used more often are bigger and darker.</p>' },
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
        <Word2VecChart
          words={results[this.state.selectedQueryIndex].list.slice(0, 100)} // can't draw too many as it gets unreadable
          domId={WORD_SPACE_DOM_ID}
          width={585}
          xProperty="google_w2v_x"
          yProperty="google_w2v_y"
          noDataMsg={localMessages.noGoogleW2VData}
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
                    downloadSvg(svgChild.firstChild);
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
      composeSummarizedVisualization(localMessages.title, localMessages.descriptionIntro, messages.wordCloudWord2VecLayoutHelp)(
        composeAsyncContainer(
          QueryWordSpaceResultsContainer
        )
      )
    )
  );
