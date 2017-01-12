import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
// import { fetchCollectionMetadataCoverage } from '../../../actions/sourceActions';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import MetadataCoverageItem from './MetadataCoverageItem';

// import PieChart from '../../vis/TreeMap';

const localMessages = {
  chartTitle: { id: 'collection.summary.metadatacoverage.chart.title', defaultMessage: 'Metadata' },
  title: { id: 'collection.summary.metadatacoverage.title', defaultMessage: 'Metadata Representation' },
  helpTitle: { id: 'collection.summary.metadatacoverage.help.title', defaultMessage: 'About Metadata Representation' },
  helpText: { id: 'collection.summary.metadatacoverage.help.text',
    defaultMessage: '<p>This visualization gives you a sense of whichc sources are tagged with metadata.</p>',
  },
  cantShow: { id: 'collection.summary.metadatacoverage.cantShow', defaultMessage: 'Sorry, this collection has too many sources for us to compute a map of how much content each source contributes to it.' },
  countryOfPublication: { id: 'collection.summary.metadatacoverage.pubCountry', defaultMessage: 'Country of Publication' },
};

class CollectionMetadataCoverageSummaryContainer extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/metadatacoverage/metadataCoverage.csv`;
    window.location = url;
  }

  handlePieSliceClick = () => {
  }

  render() {
    const { helpButton, sources } = this.props;
    const { formatMessage } = this.props.intl;
    // const sourcesWithoutMetadata = sources.filter(c => c.show_on_media === 1);
    // const metadata = collection.media_source_tags.filter(c => (isMetaDataTagSet(c.tag_sets_id)));
    // const data = sources.map(s => ({ name: s.name, tags_id: s.tags_id, media_id: s.media_id })).filter(tagsid);  // also available: sentence_count
    let content = null;
    // if no sources that means there were too many to compute the chart for
    if (sources.length === 0) {
      content = <p><FormattedMessage {...localMessages.cantShow} /></p>;
    }
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {content}
        <MetadataCoverageItem sources={sources} metadataId="1935" />
      </DataCard>
    );
  }

}

CollectionMetadataCoverageSummaryContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  collection: React.PropTypes.object.isRequired,
  sources: React.PropTypes.array.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = (state, ownprops) => ({
  fetchStatus: state.sources.collections.selected.collectionDetails.fetchStatus,
  sources: ownprops.sources,
  collection: state.sources.collections.selected.collectionDetails.object,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
  },
  navToSource: (mediaId) => {
    dispatch(push(`/sources/${mediaId}`));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText])(
        composeAsyncContainer(
          CollectionMetadataCoverageSummaryContainer
        )
      )
    )
  );
