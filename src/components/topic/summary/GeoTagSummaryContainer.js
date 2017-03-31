import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { filtersAsUrlParams } from '../../util/location';
import messages from '../../../resources/messages';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import { DownloadButton } from '../../common/IconButton';
import { getBrandLightColor } from '../../../styles/colors';
import { fetchTopicGeocodedStoryCounts } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.summary.geo.title', defaultMessage: 'Geographic Attention' },
  helpIntro: { id: 'topic.summary.geo.info',
    defaultMessage: 'This is a map of the countries stories within this Topic are about. We\'ve extracted the places mentioned in each story and the ones mentioned most make a story "about" that place. Darker countries have more stories about them.' },
};

class GeoTagSummaryContainer extends React.Component {
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/geo-tags/counts.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  render() {
    const { geolist, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <GeoChart data={geolist} countryMaxColorScale={getBrandLightColor()} />
      </DataCard>
    );
  }

}

GeoTagSummaryContainer.propTypes = {
  // from state
  geolist: React.PropTypes.array.isRequired,
  fetchStatus: React.PropTypes.string,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.geotags.fetchStatus,
  geolist: state.topics.selected.geotags.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicGeocodedStoryCounts(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeDescribedDataCard(localMessages.helpIntro, messages.heatMapHelpText)(
        composeAsyncContainer(
          GeoTagSummaryContainer
        )
      )
    )
  );
