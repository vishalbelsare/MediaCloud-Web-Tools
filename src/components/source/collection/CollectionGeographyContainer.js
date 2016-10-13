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
  title: { id: 'source.summary.geoChart.title', defaultMessage: 'Geographic Attention' },
  helpTitle: { id: 'topic.summary.sentenceCount.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Collection across the world.</p>',
  },
};

class CollectionGeographyContainer extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/sources/${collectionId}/geography/count.csv`;
    window.location = url;
  }
  render() {
    const { intro, geolist, intl } = this.props;
    const { formatMessage } = intl;
    return (

      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <p>{intro}</p>
        <GeoChart data={geolist} />
      </DataCard>
    );
  }
}

CollectionGeographyContainer.propTypes = {
  // from state
  geolist: React.PropTypes.array.isRequired,
  collectionId: React.PropTypes.string.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string,
  // from parent
  intro: React.PropTypes.string,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.fetchStatus,
  total: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.total,
  geolist: state.sources.selected.details.collectionDetailsReducer.collectionGeoTag.list,
  collectionId: state.sources.selected.details.collectionDetailsReducer.collectionDetails.object.id,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (collectionId) => {
    dispatch(fetchCollectionGeo(collectionId));
  },
});


function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.collectionId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          CollectionGeographyContainer
        )
      )
    )
  );
