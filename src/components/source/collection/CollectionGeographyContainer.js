import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { fetchCollectionGeo } from '../../../actions/sourceActions';

import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'collection.summary.geo.title', defaultMessage: 'Geographic Attention' },
  intro: { id: 'collection.summary.geo.info',
    defaultMessage: 'Here is a heatmap of countries mentioned in this collection (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the sources in this collection cover it.' },
  helpTitle: { id: 'collection.summary.geo.help.title', defaultMessage: 'About Geographic Attention' },
  helpText: { id: 'collection.summary.geo.help.text',
    defaultMessage: '<p>This is a heat map that shows you how often different countries are mentioned by the sources in this collection.</p>',
  },
};

class CollectionGeographyContainer extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/geography/geography.csv`;
    window.location = url;
  }

  render() {
    const { geolist, intl, helpButton } = this.props;
    const { formatMessage } = intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <p><FormattedMessage {...localMessages.intro} /></p>
        <GeoChart data={geolist} />
      </DataCard>
    );
  }

}

CollectionGeographyContainer.propTypes = {
  // from state
  geolist: React.PropTypes.array.isRequired,
  fetchStatus: React.PropTypes.string,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.fetchStatus,
  geolist: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (collectionId) => {
    dispatch(fetchCollectionGeo(collectionId));
  },
  asyncFetch: () => {
    dispatch(fetchCollectionGeo(ownProps.collectionId));
  },
});


function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.heatMapHelpText])(
        composeAsyncContainer(
          CollectionGeographyContainer
        )
      )
    )
  );
