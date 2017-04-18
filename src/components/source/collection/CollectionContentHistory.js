import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { fetchCollectionSourceSentenceHistoricalCounts } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';

const localMessages = {
  title: { id: 'collection.contentHistory.title', defaultMessage: 'Content History' },
};

class CollectionContentHistory extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { collectionId, fetchData } = this.props;
    if ((nextProps.collectionId !== collectionId)) {
      fetchData(nextProps.collectionId);
    }
  }

  render() {
    const { collection } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <h1>{collection.label} - <FormattedMessage {...localMessages.title} /></h1>
        </Grid>
      </div>
    );
  }

}

CollectionContentHistory.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from context
  // from state
  collectionId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  collection: React.PropTypes.object.isRequired,
  historicalCounts: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  collectionId: state.sources.collections.selected.id,
  collection: state.sources.collections.selected.collectionDetails.object,
  fetchStatus: state.sources.collections.selected.historicalSentenceCounts.fetchStatus,
  historicalCounts: state.sources.collections.selected.historicalSentenceCounts.list,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (collectionId) => {
    dispatch(fetchCollectionSourceSentenceHistoricalCounts(collectionId, '2017-01-01', '2017-01-07'));
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
      composeAsyncContainer(
        CollectionContentHistory
      )
    )
  );
