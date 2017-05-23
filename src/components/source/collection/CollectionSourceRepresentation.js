import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchCollectionSourceSentenceCounts } from '../../../actions/sourceActions';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton, ExploreButton } from '../../common/IconButton';
import PackedBubbleChart from '../../vis/PackedBubbleChart';
import { getBrandDarkColor } from '../../../styles/colors';
import ActionMenu from '../../common/ActionMenu';
import { downloadSvg } from '../../util/svg';

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
const TOP_N_LABELS_TO_SHOW = 5; // only the top N bubbles will get a label visible on them (so the text is readable)

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
    const { helpButton, sources, collectionId } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;

    let content = null;
    // if no sources that means there were too many to compute the chart for
    if (sources.length === 0) {
      content = <p><FormattedMessage {...localMessages.cantShow} /></p>;
    } else {
      const contributingSources = sources.filter(d => d.sentence_pct > SENTENCE_PERCENTAGE_MIN_VALUE);
      const otherSources = sources.filter(d => d.sentence_pct <= SENTENCE_PERCENTAGE_MIN_VALUE);
      const otherTotal = d3.sum(otherSources.map(d => d.sentence_pct));
      const otherSourcesNode = {
        value: otherTotal,
        rolloverText: `${formatMessage(messages.other)}: ${formatNumber(otherTotal, { style: 'percent', maximumFractionDigits: 2 })}`,
        fill: '#eee',
      };
      const maxPct = Math.ceil(d3.max(contributingSources.map(d => d.sentence_pct)) * 100) / 100;
      const scaleRange = d3.scaleLinear()
        .domain([0, maxPct])
        .range([d3.rgb('#ffffff'), d3.rgb(getBrandDarkColor())]);

      const bubbleData = [
        ...contributingSources.sort((a, b) => b.sentence_pct - a.sentence_pct).map((s, idx) => ({
          value: s.sentence_pct,
          centerText: (idx < TOP_N_LABELS_TO_SHOW) ? s.name : null,
          rolloverText: `${s.name}: ${formatNumber(s.sentence_pct, { style: 'percent', maximumFractionDigits: 2 })}`,
          fill: scaleRange(s.sentence_pct),
        })),
      ];

      if (sources.length - contributingSources.length !== 0) {
        bubbleData.push(otherSourcesNode);
      }

      content = (
        <PackedBubbleChart
          data={bubbleData}
          height={400}
          domId={BUBBLE_CHART_DOM_ID}
        />
      );
    }
    return (
      <DataCard>
        <div className="actions">
          <ExploreButton linkTo={`/collections/${collectionId}/content-history`} />
          <ActionMenu>
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(messages.downloadCSV)}
              rightIcon={<DownloadButton />}
              onTouchTap={this.downloadCsv}
            />
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(messages.downloadSVG)}
              rightIcon={<DownloadButton />}
              onTouchTap={() => downloadSvg(BUBBLE_CHART_DOM_ID)}
            />
          </ActionMenu>
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
