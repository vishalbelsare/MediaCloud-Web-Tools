import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import SentenceCount from '../../vis/SentenceCount';
import { fetchSourceCollectionSentenceCount } from '../../../actions/sourceActions';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

const CollectionSentenceCountContainer = (props) => {
  const { total, counts, health } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <SentenceCount total={total} counts={counts} health={health} />
    </DataCard>
  );
};

CollectionSentenceCountContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  health: React.PropTypes.array,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.fetchStatus,
  total: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.total,
  counts: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.list,
  health: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.health,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceCollectionSentenceCount(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        CollectionSentenceCountContainer
      )
    )
  );
