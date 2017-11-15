import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicEntitiesOrgs } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import EntitiesTable from '../../common/EntitiesTable';
import { filtersAsUrlParams } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
// import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  title: { id: 'topic.snapshot.topStories.coverage.title', defaultMessage: 'Top Organizations' },
};

class TopOrgsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/entities/organizations/entities.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  render() {
    const { topicId, count, entities } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (count !== null) {
      content = <EntitiesTable entities={entities} topicId={topicId} />;
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

TopOrgsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  count: PropTypes.number,
  entities: PropTypes.array.isRequired,
  total: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topEntitiesOrgs.fetchStatus,
  count: state.topics.selected.summary.topEntitiesOrgs.counts.count,
  total: state.topics.selected.summary.topEntitiesOrgs.counts.total,
  entities: state.topics.selected.summary.topEntitiesOrgs.entities,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId) => {
    dispatch(fetchTopicEntitiesOrgs(topicId));
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
        TopOrgsContainer
      )
    )
  );
