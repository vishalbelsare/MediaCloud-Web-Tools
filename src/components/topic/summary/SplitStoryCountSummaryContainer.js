import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withDescription from '../../common/hocs/DescribedDataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSplitStoryCounts } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import LinkWithFilters from '../LinkWithFilters';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DownloadButton, ExploreButton } from '../../common/IconButton';
import DataCard from '../../common/DataCard';
import { getBrandDarkColor } from '../../../styles/colors';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';

const localMessages = {
  title: { id: 'topic.summary.splitStoryCount.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'topic.summary.splitStoryCount.help.title', defaultMessage: 'Analyze attention to this topic over time to understand how it is covered. This chart shows the total number of stories that matched your topic query. Spikes in attention can reveal key events.  Plateaus can reveal stable, "normal", attention levels.' },
};

class SplitStoryCountSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/split-story/count.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  render() {
    const { total, counts, topicId, filters } = this.props;
    const { formatMessage } = this.props.intl;
    const exploreUrl = `/topics/${topicId}/attention`;
    return (
      <DataCard>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={filteredLinkTo(exploreUrl, filters)} />
            <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
          </div>
        </Permissioned>
        <h2>
          <LinkWithFilters to={exploreUrl}>
            <FormattedMessage {...localMessages.title} />
          </LinkWithFilters>
        </h2>
        <AttentionOverTimeChart
          total={total}
          data={counts}
          height={200}
          lineColor={getBrandDarkColor()}
        />
      </DataCard>
    );
  }
}

SplitStoryCountSummaryContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // passed in
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,  // array of {date: epochMS, count: int]
  // from dispath
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.splitStoryCount.fetchStatus,
  total: state.topics.selected.summary.splitStoryCount.total,
  counts: state.topics.selected.summary.splitStoryCount.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicSplitStoryCounts(props.topicId, props.filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withDescription(localMessages.descriptionIntro, [messages.attentionChartHelpText])(
        withAsyncFetch(
          SplitStoryCountSummaryContainer
        )
      )
    )
  );
