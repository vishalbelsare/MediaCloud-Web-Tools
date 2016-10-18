import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { fetchSourceGeo } from '../../../actions/sourceActions';

import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'source.summary.geoChart.title', defaultMessage: 'Geographic Attention' },
  helpTitle: { id: 'source.summary.sentenceCount.help.title', defaultMessage: 'About Geography' },
  helpText: { id: 'source.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Source across the world.</p>',
  },
};

class SourceGeographyContainer extends React.Component {
  downloadCsv = () => {
    const { sourceId } = this.props;
    const url = `/api/sources/${sourceId}/geography/geography.csv`;
    window.location = url;
  }
  render() {
    const { intro, geolist } = this.props;
    const { formatMessage } = this.props.intl;
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

SourceGeographyContainer.propTypes = {
  // from state
  geolist: React.PropTypes.array.isRequired,
  sourceId: React.PropTypes.number.isRequired,
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
  sourceId: parseInt(state.sources.selected.details.sourceDetailsReducer.sourceDetails.object.id, 10),

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
       composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          SourceGeographyContainer
        )
      )
    )
  );
