import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import LinkWithFilters from '../LinkWithFilters';
import { filteredLinkTo, filteredLocation } from '../../util/location';
import { FilterButton, HomeButton } from '../../common/IconButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { toggleFilterControls, filterByFocus, fetchTopicFocalSetsList, fetchFocalSetDefinitions, setTopicNeedsNewSnapshot, topicStartSpider } from '../../../actions/topicActions';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import FilterSelectorContainer from './FilterSelectorContainer';
import ActiveFiltersContainer from './ActiveFiltersContainer';
import { asyncContainerize } from '../../common/AsyncContainer';
import ModifyTopicDialog from './ModifyTopicDialog';
import { LEVEL_WARNING } from '../../common/Notice';

const REMOVE_FOCUS = 0;

const localMessages = {
  editPermissions: { id: 'topic.editPermissions', defaultMessage: 'Edit Topic Permissions' },
  editSettings: { id: 'topic.editSettings', defaultMessage: 'Edit Topic Settings' },
  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
  startedSpider: { id: 'topic.startedSpider', defaultMessage: 'Started a new spidering job for this topic' },
  summaryMessage: { id: 'snapshot.required', defaultMessage: 'You have made some changes that you can only see if you generate a new Snapshot. <a href="{url}">Generate one now</a>.' },
  topicHomepage: { id: 'topic.homepage', defaultMessage: 'Topic Homepage' },
};

class TopicFilterControlBar extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, snapshots } = this.props;
    if (nextProps.filters.snapshotId !== filters.snapshotId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.filters.snapshotId, snapshots);
    }
  }
  render() {
    const { topicId, location, filters, goToUrl, handleFilterToggle, handleFocusSelected, needsNewSnapshot, handleSpiderRequest } = this.props;
    const { formatMessage } = this.props.intl;
    // both the focus and timespans selectors need the snapshot to be selected first
    let subControls = null;
    if ((filters.snapshotId !== null) && (filters.snapshotId !== undefined)) {
      subControls = <TimespanSelectorContainer topicId={topicId} location={location} filters={filters} />;
    }
    return (
      <div className="controlbar controlbar-topic">
        <div className="main">
          <Grid>
            <Row>
              <Col lg={4} className="left">
                <LinkWithFilters to={`/topics/${topicId}/summary`}>
                  <HomeButton />
                  <b><FormattedMessage {...localMessages.topicHomepage} /></b>
                </LinkWithFilters>
                <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                  <ModifyTopicDialog
                    topicId={topicId}
                    onUrlChange={goToUrl}
                    needsNewSnapshot={needsNewSnapshot}
                    onSpiderRequest={handleSpiderRequest}
                  />
                </Permissioned>
              </Col>
              <Col lg={8} className="right">
                <FilterButton onClick={() => handleFilterToggle()} tooltip={formatMessage(localMessages.filterTopic)} />
                <ActiveFiltersContainer
                  onRemoveFocus={() => handleFocusSelected(REMOVE_FOCUS)}
                />
              </Col>
            </Row>
          </Grid>
        </div>
        <FilterSelectorContainer
          location={location}
          onFocusSelected={handleFocusSelected}
        />
        <div className="sub">
          {subControls}
        </div>
      </div>
    );
  }
}

TopicFilterControlBar.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number,
  location: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  snapshots: PropTypes.array,
  needsNewSnapshot: PropTypes.bool,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  handleFilterToggle: PropTypes.func.isRequired,
  handleFocusSelected: PropTypes.func.isRequired,
  handleSpiderRequest: PropTypes.func.isRequired,
  // from merge
  goToUrl: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.foci.fetchStatus,
  snapshots: state.topics.selected.snapshots.list,
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
});

/**
 * Return true if there are focal set changes that require a new snapshot
 */
function pendingFocalSetDefinitions(definitions, focalSets) {
  // has match?
  const eachHasMatch = definitions.map((setDef) => {
    // for each focal set definition make sure a set exists
    const matchingSet = focalSets.find(set => setDef.name === set.name && setDef.description === set.description);
    if (matchingSet) {
      // make sure length is same (ie. no deleted defs)
      if (matchingSet.foci.length !== setDef.focus_definitions.length) {
        return false;
      }
      // for each focus definined make sure a focus exists in that set
      const macthingFoci = setDef.focus_definitions.map((def) => {
        const matchingFocus = matchingSet.foci.find(focus => def.name === focus.name && def.query === focus.query && def.description === focus.description);
        return matchingFocus !== undefined;
      });
      return !macthingFoci.includes(false);
    }
    return false;
  });
  return eachHasMatch.includes(false);
}

function latestSnapshotIsRunning(snapshots) {
  return snapshots[0].state === 'running';
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleFilterToggle: () => {
    dispatch(toggleFilterControls());
  },
  handleFocusSelected: (focus) => {
    const selectedFocusId = (focus.foci_id === REMOVE_FOCUS) ? null : focus.foci_id;
    const newLocation = filteredLocation(ownProps.location, { focusId: selectedFocusId, timespanId: null });
    dispatch(push(newLocation));
    dispatch(filterByFocus(selectedFocusId));
  },
  redirectToUrl: (url, filters) => dispatch(push(filteredLinkTo(url, filters))),
  fetchData: (topicId, snapshotId, snapshots) => {
    if (topicId !== null) {
      // here we want to determine if the topic needs a new snapshot and let everything know
      dispatch(fetchTopicFocalSetsList(topicId, snapshotId))
        .then((focalSets) => {
          dispatch(fetchFocalSetDefinitions(topicId))
            .then((focalSetDefinitions) => {
              if (pendingFocalSetDefinitions(focalSetDefinitions, focalSets) && !latestSnapshotIsRunning(snapshots)) {
                dispatch(setTopicNeedsNewSnapshot(true));
                dispatch(addNotice({
                  level: LEVEL_WARNING,
                  htmlMessage: ownProps.intl.formatHTMLMessage(localMessages.summaryMessage, {
                    url: `#/topics/${topicId}/snapshot/generate`,
                  }),
                }));
              }
            });
        });
    }
  },
  handleSpiderRequest: () => {
    dispatch(topicStartSpider(ownProps.topicId))
      .then(() => {
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.startedSpider) }));
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    goToUrl: url => dispatchProps.redirectToUrl(url, ownProps.filters),
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters.snapshotId, stateProps.snapshots);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      asyncContainerize(
        TopicFilterControlBar
      )
    )
  );
