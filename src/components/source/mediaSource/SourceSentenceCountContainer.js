import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import SentenceCount from '../../vis/SentenceCount';
import { fetchSourceSentenceCount } from '../../../actions/sourceActions';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

const SourceSentenceCountContainer = (props) => {
  const { total, counts, health } = props;
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} /></h2>
      <SentenceCount total={total} counts={counts} health={health} />
    </DataCard>
  );
};

SourceSentenceCountContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  // from parent
  sourceId: React.PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  health: React.PropTypes.array,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sentenceCount.fetchStatus,
  total: state.sources.selected.details.sourceDetailsReducer.sentenceCount.total,
  counts: state.sources.selected.details.sourceDetailsReducer.sentenceCount.list,
  health: state.sources.selected.details.sourceDetailsReducer.sentenceCount.health,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceSentenceCount(ownProps.sourceId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SourceSentenceCountContainer
      )
    )
  );
