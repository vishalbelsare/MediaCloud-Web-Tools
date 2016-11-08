import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchCollectionSourceStoryCounts } from '../../../actions/sourceActions';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import TreeMap from '../../vis/TreeMap';

const localMessages = {
  chartTitle: { id: 'collection.summary.sourceRepresentation.chart.title', defaultMessage: 'Sentences By Source' },
  title: { id: 'collection.summary.sourceRepresentation.title', defaultMessage: 'Source Representation' },
  helpTitle: { id: 'collection.summary.sourceRepresentation.help.title', defaultMessage: 'About Source Representation' },
  helpText: { id: 'collection.summary.sourceRepresentation.help.text',
    defaultMessage: '<p>This visualization gives you a sense of how much content each source contributes to this collection.  Each source is a rectangle.  The larger the rectangle, the more sentences if has in this collection.  Rollover one to see the actualy number of sentences.</p>',
  },
};

class CollectionSourceRepresentation extends React.Component {

  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/sources/story-counts.csv`;
    window.location = url;
  }

  handleLeafClick = (evt) => {
    const { sources, navToSource } = this.props;
    const source = sources[evt.point.index];
    navToSource(source.media_id);
  }

  render() {
    const { helpButton, sources } = this.props;
    const { formatMessage } = this.props.intl;
    const data = sources.map(s => ({ name: s.name, value: s.story_pct }));  // also available: story_count
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <TreeMap title={formatMessage(localMessages.chartTitle)} data={data} onLeafClick={this.handleLeafClick} />
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
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionSourceStoryCounts.fetchStatus,
  sources: state.sources.selected.details.collectionDetailsReducer.collectionSourceStoryCounts.sources,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionSourceStoryCounts(ownProps.collectionId));
  },
  navToSource: (mediaId) => {
    dispatch(push(`/sources/${mediaId}/details`));
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
