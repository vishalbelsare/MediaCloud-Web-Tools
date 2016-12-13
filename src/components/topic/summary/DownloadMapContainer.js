import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import DataCard from '../../common/DataCard';
import { fetchTopicMapFiles } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.summary.mapDownload.title', defaultMessage: 'Download Link and Word Maps' },
  helpTitle: { id: 'topic.summary.mapDownload.help.title', defaultMessage: 'Link and Word Maps' },
  helpText: { id: 'topic.summary.mapDownload.help.title', defaultMessage: 'When you visit this page for the first time, we start a background process to generate the word map.  This word map is based on the top 100 words from the top 50 sources.  We will be making this system more versatile in the future, but for now this was the quickest way to integrate support.  The map is unique for each snapshot/focus/timespan trio; so if you change to a different timespan a new map will be generated.  These maps are saved, so you won\'t have to generate them more than once.' },
  generating: { id: 'topic.summary.mapDownload.generating', defaultMessage: 'Your map is being generated. This can take a while. Please reload this page in a few minutes to see if it is ready.' },
  unknownStatus: { id: 'topic.summary.mapDownload.unknownStatus', defaultMessage: 'We\'re not sure what is up with this file. Sorry!' },
  downloadText: { id: 'topic.summary.mapDownload.download.text', defaultMessage: 'Download a text file of the words used by each source' },
  downloadGexf: { id: 'topic.summary.mapDownload.download.gexf', defaultMessage: 'Download a .gexf file to use in Gephi' },
  downloadJson: { id: 'topic.summary.mapDownload.download.json', defaultMessage: 'Download a .json file to analyze with Python' },
  wordMap: { id: 'topic.summary.mapDownload.wordMap.header', defaultMessage: 'Word Map' },
  linkMap: { id: 'topic.summary.mapDownload.linkMap.header', defaultMessage: 'Link Map' },
};

class DownloadMapContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  render() {
    const { topicId, filters, helpButton, wordMapStatus } = this.props;
    let wordMapContent = null;
    switch (wordMapStatus) {
      case 'generating':
        wordMapContent = <FormattedMessage {...localMessages.generating} />;
        break;
      case 'rendered':
        wordMapContent = (
          <ul>
            <li>
              <a href={`/api/topics/${topicId}/map-files/wordMap.gexf?timespanId=${filters.timespanId}`}>
                <FormattedMessage {...localMessages.downloadGexf} />
              </a>
            </li>
            <li>
              <a href={`/api/topics/${topicId}/map-files/wordMap.json?timespanId=${filters.timespanId}`}>
                <FormattedMessage {...localMessages.downloadJson} />
              </a>
            </li>
            <li>
              <a href={`/api/topics/${topicId}/map-files/wordMap.txt?timespanId=${filters.timespanId}`}>
                <FormattedMessage {...localMessages.downloadText} />
              </a>
            </li>
          </ul>
        );
        break;
      default:

    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <h3><FormattedMessage {...localMessages.wordMap} />:</h3>
        {wordMapContent}
      </DataCard>
    );
  }
}

DownloadMapContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  linkMapStatus: React.PropTypes.string,
  wordMapStatus: React.PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.mapFiles.fetchStatus,
  linkMapStatus: state.topics.selected.summary.mapFiles.linkMap,
  wordMapStatus: state.topics.selected.summary.mapFiles.wordMap,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchTopicMapFiles(props.topicId, props.filters));
  },
  asyncFetch: () => {
    dispatch(fetchTopicMapFiles(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          DownloadMapContainer
        )
      )
    )
  );
