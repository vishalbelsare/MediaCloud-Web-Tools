import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchCollectionSourceSentenceCounts } from '../../../actions/sourceActions';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import BubbleChart, { PLACEMENT_AUTO, TEXT_PLACEMENT_ROLLOVER } from '../../vis/BubbleChart';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  chartTitle: { id: 'collection.summary.sourceRepresentation.chart.title', defaultMessage: 'Sentences By Source' },
  title: { id: 'collection.summary.sourceRepresentation.title', defaultMessage: 'Source Representation' },
  helpTitle: { id: 'collection.summary.sourceRepresentation.help.title', defaultMessage: 'About Source Representation' },
  helpText: { id: 'collection.summary.sourceRepresentation.help.text',
    defaultMessage: '<p>This visualization gives you a sense of how much content each source contributes to this collection.  Each source is a rectangle.  The larger the rectangle, the more sentences it has in this collection.  Rollover one to see the actualy number of sentences. Click the source to learn more about it.</p><p>For performance reasons, these percentages are based on a sample of sentences from this collection.  Our tests show that this sampling provides very accurate results.</p>',
  },
  cantShow: { id: 'collection.summary.sourceRepresentation.cantShow', defaultMessage: 'Sorry, this collection has too many sources for us to compute a map of how much content each source contributes to it.' },
  overallSeries: { id: 'collection.bubble.series.overall', defaultMessage: 'Overall' },
  bubbleChartTitle: { id: 'collection.bubble.bubbleChart.title', defaultMessage: 'Total Bubble Representation' },
  lineChartTitle: { id: 'collection.bubble.lineChart.title', defaultMessage: 'Bubble Representation' },
};

const BUBBLE_CHART_DOM_ID = 'source-representation-bubble-chart';
const SENTENCE_PERCENTAGE_MIN_VALUE = 0.01; // 1 percent threshold

class CollectionSourceRepresentation extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/sources/sentences/count.csv`;
    window.location = url;
  }

  handlePieSliceClick = () => {
    // const { sources } = this.props;
    // const source = sources[evt.point.index];
  }

  render() {
    const { helpButton, sources } = this.props;
    const { formatMessage } = this.props.intl;

    let content = null;
    // if no sources that means there were too many to compute the chart for
    if (sources.length === 0) {
      content = <p><FormattedMessage {...localMessages.cantShow} /></p>;
    } else {
      const contributingSources = sources.filter(d => Math.ceil(d.sentence_pct * 100) / 100 > SENTENCE_PERCENTAGE_MIN_VALUE);
      const otherSourcesNode = { id: contributingSources.length, name: 'Other', label: 'Other', value: 1, unit: '%', color: '#eee' };
      const maxPct = Math.ceil(d3.max(contributingSources.map(d => d.sentence_pct)) * 100) / 100;
      const scaleRange = d3.scaleLinear()
        .domain([0, maxPct])
        .range([d3.rgb('#ffffff'), d3.rgb(getBrandDarkColor())]);

      const bubbleData = [
        ...contributingSources.map((s, idx) => ({
          id: idx,
          name: s.name,
          label: s.name,
          value: Math.ceil(s.sentence_pct * 100),
          unit: '%',
          color: scaleRange(s.sentence_pct),
        })),
      ];

      if (sources.length - contributingSources.length !== 0) {
        bubbleData.push(otherSourcesNode);
      }

      content = (
        <BubbleChart
          data={bubbleData}
          placement={PLACEMENT_AUTO}
          height={400}
          domId={BUBBLE_CHART_DOM_ID}
          textPlacement={TEXT_PLACEMENT_ROLLOVER}
        />
      );
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
      </DataCard>
    );
  }

}

CollectionSourceRepresentation.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  sources: React.PropTypes.array.isRequired,
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  navToSource: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSourceSentenceCounts.fetchStatus,
  sources: state.sources.collections.selected.collectionSourceSentenceCounts.sources,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionSourceSentenceCounts(ownProps.collectionId));
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
          CollectionSourceRepresentation
        )
      )
    )
  );
