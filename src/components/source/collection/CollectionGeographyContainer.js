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
    defaultMessage: '<p>Here is a heatmap of countries mentioned in this collection (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the sources in this collection cover it.</p>' },
  helpTitle: { id: 'collection.summary.geo.help.title', defaultMessage: 'About Geographic Attention' },
};

class CollectionGeographyContainer extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/geography/geography.csv`;
    window.location = url;
  }

  render() {
    const { geolist, intl, helpButton, handleCountryClick } = this.props;
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
        <GeoChart data={geolist} onCountryClick={handleCountryClick} />
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
  collectionName: React.PropTypes.string.isRequired,
  collectionId: React.PropTypes.number.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  handleCountryClick: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.fetchStatus,
  geolist: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionGeo(ownProps.collectionId));
  },
  handleCountryClick: (event, geo) => {
    const countryName = geo.name;
    const countryTagId = geo.tags_id;
    const collectionName = ownProps.collectionName;
    const url = `https://dashboard.mediacloud.org/#query/["(tags_id_story_sentences: ${countryTagId})"]/[{"sets":[${ownProps.collectionId}]}]/[]/[]/[{"uid":1,"name":"${collectionName} - ${countryName}","color":"55868A"}]`;
    window.open(url, '_blank');
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.heatMapHelpText])(
        composeAsyncContainer(
          CollectionGeographyContainer
        )
      )
    )
  );
