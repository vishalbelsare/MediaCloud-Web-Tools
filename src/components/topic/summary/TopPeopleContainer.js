import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicEntitiesPeople } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
// import EntityTable from '../../EntityTable';

const localMessages = {
  title: { id: 'topic.snapshot.topStories.coverage.title', defaultMessage: 'Entity Coverage' },
  intro: { id: 'topic.snapshot.topStories.coverage.intro', defaultMessage: 'By Top People' },
};

class TopPeopleContainer extends React.Component {
  componentWillReceiveProps() { // nextprops
    // const { topicId, numCountries, fetchData } = this.props;
    /* if (nextProps.numCountries !== numCountries) {
      fetchData(topicId, nextProps.numCountries);
    } */
  }
  render() {
    const { count, total } = this.props;
    // const { formatMessage } = this.props.intl;
    /* let content = null;
    if (count !== null) {
      content = <EntityTable/>;
    } */
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <p><FormattedMessage {...localMessages.intro} /></p>
        {count}
        {total}
      </DataCard>
    );
  }
}

TopPeopleContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  total: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topEntitiesPeople.fetchStatus,
  count: state.topics.selected.summary.topEntitiesPeople.counts.count,
  total: state.topics.selected.summary.topEntitiesPeople.counts.total,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId) => {
    dispatch(fetchTopicEntitiesPeople(topicId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId);
    },

  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        TopPeopleContainer
      )
    )
  );
