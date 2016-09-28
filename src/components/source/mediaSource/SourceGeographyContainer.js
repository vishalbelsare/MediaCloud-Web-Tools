import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { fetchSourceGeo } from '../../../actions/sourceActions';

const localMessages = {
  title: { id: 'source.summary.geoChart.title', defaultMessage: 'Geographic Attention' },
};

const SourceGeographyContainer = (props) => {
  const { intro, geolist } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <p>{intro}</p>
      <GeoChart data={geolist} />
    </DataCard>
  );
};

SourceGeographyContainer.propTypes = {
  // from state
  geolist: React.PropTypes.array.isRequired,
  sourceId: React.PropTypes.string.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  fetchStatus: React.PropTypes.string,
  // from parent
  intro: React.PropTypes.string,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.geoTag.fetchStatus,
  total: state.sources.selected.details.sourceDetailsReducer.geoTag.total,
  geolist: state.sources.selected.details.sourceDetailsReducer.geoTag.list,
  sourceId: state.sources.selected.details.sourceDetailsReducer.sourceDetails.object.id,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceGeo(sourceId));
  },
});


function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.sourceId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        SourceGeographyContainer
      )
    )
  );
