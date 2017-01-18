import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import MetadataCoverageItem from './MetadataCoverageItem';
import { TAG_SET_PUBLICATION_COUNTRY } from '../../../lib/tagUtil';

const localMessages = {
  chartTitle: { id: 'collection.summary.metadatacoverage.chart.title', defaultMessage: 'Metadata' },
  title: { id: 'collection.summary.metadatacoverage.title', defaultMessage: 'Metadata Coverage' },
  helpTitle: { id: 'collection.summary.metadatacoverage.help.title', defaultMessage: 'About Metadata Coverage' },
  helpText: { id: 'collection.summary.metadatacoverage.help.text',
    defaultMessage: '<p>These visualizations show you the percentage of sources in this collection that we have tagged with each type of metadata information.</p>',
  },
  cantShow: { id: 'collection.summary.metadatacoverage.cantShow', defaultMessage: 'This collection is empty.' },
  pubCountryTitle: { id: 'collection.summary.metadatacoverage.pubCountry.title', defaultMessage: 'Country of Publication' },
  pubCountryTagged: { id: 'collection.summary.metadatacoverage.pubCountry.tagged', defaultMessage: 'with a country' },
  pubCountryNotTagged: { id: 'collection.summary.metadatacoverage.pubCountry.notTagged', defaultMessage: 'unknown country' },
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
    let content = null;
    if (sources.length === 0) {
      content = <p><FormattedMessage {...localMessages.cantShow} /></p>;
    } else {
      content = (
        <Col lg={4}>
          <MetadataCoverageItem
            title={formatMessage(localMessages.pubCountryTitle)}
            sources={sources}
            metadataId={TAG_SET_PUBLICATION_COUNTRY}
            taggedText={formatMessage(localMessages.pubCountryTagged)}
            notTaggedText={formatMessage(localMessages.pubCountryNotTagged)}
          />
        </Col>
      );
    }
    return (
      <DataCard>
        <Row>
          <Col lg={12}>
            <div className="actions">
              <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
            </div>
            <h2>
              <FormattedMessage {...localMessages.title} />
              {helpButton}
            </h2>
          </Col>
        </Row>
        <Row>
          {content}
        </Row>
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
