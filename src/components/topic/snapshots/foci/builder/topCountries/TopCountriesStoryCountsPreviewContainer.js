import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import { fetchCreateFocusTopCountriesStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import BubbleRowChart from '../../../../../vis/BubbleRowChart';

// @see http://colorbrewer2.org/#type=diverging&scheme=RdBu&n=5
const TOP_COUNTRIES_COLORS = ['#0571b0', '#92c5de', '#666666', '#f4a582', '#ca0020'];

const BUBBLE_CHART_DOM_ID = 'focalSetCreatePreviewRetweetPartisanshipCounts';

const localMessages = {
  title: { id: 'topic.snapshot.topCountries.storyCount.title', defaultMessage: 'Stories By Top Countries' },
  intro: { id: 'topic.snapshot.topCountries.storyCount.intro', defaultMessage: 'Stories about however many most-talked-about-countries' },
};

const TopCountriesStoryCountsPreviewContainer = (props) => {
  const { counts } = props;
  const { formatNumber } = props.intl;
  let content = null;
  if (counts !== null) {
    const data = counts.map((info, idx) => ({
      value: info.count,
      fill: TOP_COUNTRIES_COLORS[idx],
      aboveText: (idx % 2 === 0) ? info.label : null,
      belowText: (idx % 2 !== 0) ? info.label : null,
      rolloverText: `${info.label}: ${formatNumber(info.count)}`,
    }));
    content = (<BubbleRowChart
      data={data}
      domId={BUBBLE_CHART_DOM_ID}
      width={700}
      padding={30}
    />);
  }
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p><FormattedMessage {...localMessages.intro} /></p>
      {content}
    </DataCard>
  );
};

TopCountriesStoryCountsPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from state
  counts: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.focalSets.create.topCountriesStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.topCountriesStoryCounts.story_counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCreateFocusTopCountriesStoryCounts(ownProps.topicId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        TopCountriesStoryCountsPreviewContainer
      )
    )
  );
