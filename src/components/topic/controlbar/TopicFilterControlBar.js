import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import { filteredLinkTo, filteredLocation } from '../../util/location';
import { FilterButton } from '../../common/IconButton';
import { toggleFilterControls, filterByFocus, fetchTopicFocalSetsList, fetchFocalSetDefinitions } from '../../../actions/topicActions';
import FilterSelectorContainer from './FilterSelectorContainer';
import ActiveFiltersContainer from './ActiveFiltersContainer';
import { asyncContainerize } from '../../common/AsyncContainer';
import ModifyTopicDialog from './ModifyTopicDialog';
import { addNotice } from '../../../actions/appActions';
import { LEVEL_WARNING } from '../../common/Notice';

const REMOVE_FOCUS = 0;

const localMessages = {
  editPermissions: { id: 'topic.editPermissions', defaultMessage: 'Edit Topic Permissions' },
  editSettings: { id: 'topic.editSettings', defaultMessage: 'Edit Topic Settings' },
  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
  summaryMessage: { id: 'snapshot.required', defaultMessage: 'You have made some changes that you can only see if you generate a new Snapshot. <a href="{url}">Generate one now</a>.' },
};

class TopicFilterControlBar extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters } = this.props;
    if (nextProps.filters.snapshotId !== filters.snapshotId) {
      const { fetchData } = this.props;
      fetchData(nextProps.topicId, nextProps.filters.snapshotId);
    }
  }
  render() {
    const { topicId, location, filters, goToUrl, handleFilterToggle, handleFocusSelected } = this.props;
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
                <ModifyTopicDialog
                  topicId={topicId}
                  onUrlChange={goToUrl}
                  allowSnapshot
                />
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
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  handleFilterToggle: React.PropTypes.func.isRequired,
  handleFocusSelected: React.PropTypes.func.isRequired,
  // from merge
  goToUrl: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.foci.fetchStatus,
//  foci: state.topics.selected.focalSets.foci.list,
//  selectedFocus: state.topics.selected.focalSets.foci.selected,
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
  fetchData: (topicId, snapshotId) => {
    if (topicId !== null) {
      dispatch(fetchTopicFocalSetsList(topicId, snapshotId))
        .then((focalSets) => {
          dispatch(fetchFocalSetDefinitions(topicId))
            .then((focalSetDefinitions) => {
              if (pendingFocalSetDefinitions(focalSetDefinitions, focalSets)) {
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
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    goToUrl: url => dispatchProps.redirectToUrl(url, ownProps.filters),
    asyncFetch: () => {
      console.log(ownProps.filters);
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters.snapshotId);
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
