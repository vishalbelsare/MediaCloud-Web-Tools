import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../../resources/messages';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import EditableWordCloudDataCard from '../../common/EditableWordCloudDataCard';
import { topicDownloadFilename } from '../../util/topicUtil';
import { VIEW_1K } from '../../../lib/topicFilterUtil';

const WORD_CLOUD_DOM_ID = 'topic-summary-media-word-cloud';

/**
 * Wrap any component that wants to display an EditableWordCloud. This passes
 * a `fetchData` helper to the child component,.
 */
const composeTopicEditableWordCloudContainer = (ChildComponent) => {
  class TopicEditableWordCloudContainer extends React.Component {
    state = {
      sampleSize: VIEW_1K,
    };
    setSampleSize = (nextSize) => {
      const { fetchData } = this.props;
      this.setState({ sampleSize: nextSize });
      fetchData(nextSize);
    }
    render() {
      const { topicInfo, fetchData, filters, handleWordCloudClick, helpButton } = this.props;
      const { formatMessage } = this.props.intl;
      const urlDownload = `/api/topics/${topicInfo.topicId}/words.csv?${filtersAsUrlParams(filters)}`;

      if (fetchData === undefined) {
        const error = { message: 'No fetchData defined for your container!', child: ChildComponent };
        throw error;
      }
      return (
        <div className="csv-download-notifier">
          <EditableWordCloudDataCard
            words={this.props.words}
            explore={filteredLinkTo(`/topics/${topicInfo.topicId}/words`, filters)}
            downloadUrl={urlDownload}
            onViewModeClick={handleWordCloudClick}
            onViewSampleSizeClick={sampleSize => this.setSampleSize(sampleSize)}
            initSampleSize={this.state.sampleSize}
            title={formatMessage(messages.topWords)}
            helpButton={helpButton}
            domId={WORD_CLOUD_DOM_ID}
            svgDownloadPrefix={`${topicDownloadFilename(topicInfo.name, filters)}-words`}
            includeTopicWord2Vec
          />
          { this.props.children }
        </div>
      );
    }
  }
  TopicEditableWordCloudContainer.propTypes = {
    // from compositional chain
    intl: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    topicInfo: PropTypes.object.isRequired,
    helpButton: PropTypes.object.isRequired,
    // from dispatch
    fetchData: PropTypes.func.isRequired,
    // from state
    handleWordCloudClick: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
    words: PropTypes.array.isRequired,
  };

  const mapStateToProps = state => ({
    fetchStatus: state.topics.selected.mediaSource.words.fetchStatus,
    topicInfo: state.topics.selected.info,
    filters: state.topics.selected.filters,
  });

  return connect(mapStateToProps)(
    injectIntl(
      TopicEditableWordCloudContainer
    )
  );
};

export default composeTopicEditableWordCloudContainer;
