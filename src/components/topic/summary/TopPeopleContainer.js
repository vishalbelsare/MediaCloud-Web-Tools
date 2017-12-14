import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicEntitiesPeople, filterByQuery } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import EntitiesTable from '../../common/EntitiesTable';
import { filtersAsUrlParams, filteredLocation } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';

const VALID_THRESHOLD = 0.7;

const localMessages = {
  title: { id: 'topic.snapshot.topPeople.title', defaultMessage: 'Top People' },
  notEnoughData: { id: 'topic.snapshot.topPeople.notEnoughData', defaultMessage: '<i>Sorry, but we only have {pct} of these stories processed to identify people mentioned.  We don\'t want to lead you astray with incomplete data, so we\'ve hidden this list.  You an still downlload the data we have, but don\'t rely on it because it doesn\'t represent the full dataset.</i>' },
};

class TopPeopleContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.topicId, nextProps.filters);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/entities/people/entities.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  handleEntityClick = (tagId) => {
    const { filters, updateQueryFilter } = this.props;
    const queryFragment = `tags_id_stories: ${tagId}`;
    if (filters.q && filters.q.length > 0) {
      updateQueryFilter(`(${filters.q}) AND (${queryFragment})`);
    } else {
      updateQueryFilter(queryFragment);
    }
  }
  render() {
    const { coverage, entities } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    let content = null;
    const coverageRatio = coverage.count / coverage.total;
    if (coverageRatio > VALID_THRESHOLD) {
      content = <EntitiesTable entities={entities} onClick={(...args) => this.handleEntityClick(args)} />;
    } else {
      content = (
        <FormattedHTMLMessage
          {...localMessages.notEnoughData}
          values={{
            pct: formatNumber(coverageRatio, { style: 'percent', maximumFractionDigits: 2 }),
          }}
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
        </h2>
        {content}
      </DataCard>
    );
  }
}

TopPeopleContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  coverage: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  updateQueryFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topEntitiesPeople.fetchStatus,
  coverage: state.topics.selected.summary.topEntitiesPeople.coverage,
  entities: state.topics.selected.summary.topEntitiesPeople.entities,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, filters) => {
    dispatch(fetchTopicEntitiesPeople(topicId, filters));
  },
  updateQueryFilter: (newQueryFilter) => {
    const newFilters = {
      ...ownProps.filters,
      q: newQueryFilter,
    };
    const newLocation = filteredLocation(ownProps.location, newFilters);
    dispatch(push(newLocation));
    dispatch(filterByQuery(newQueryFilter));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters);
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
