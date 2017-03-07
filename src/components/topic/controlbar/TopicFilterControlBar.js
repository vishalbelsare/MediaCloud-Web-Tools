import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import { filteredLinkTo, filteredLocation } from '../../util/location';
import { FilterButton } from '../../common/IconButton';
import { toggleFilterControls, filterByFocus } from '../../../actions/topicActions';
import FilterSelectorContainer from './FilterSelectorContainer';
import ActiveFiltersContainer from './ActiveFiltersContainer';
import ModifyTopicDialog from './ModifyTopicDialog';

const REMOVE_FOCUS = 0;

const localMessages = {
  editPermissions: { id: 'topic.editPermissions', defaultMessage: 'Edit Topic Permissions' },
  editSettings: { id: 'topic.editSettings', defaultMessage: 'Edit Topic Settings' },
  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
};

const TopicFilterControlBar = (props) => {
  const { topicId, location, filters, goToUrl, handleFilterToggle, handleFocusSelected } = props;
  const { formatMessage } = props.intl;
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
};

TopicFilterControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  handleFilterToggle: React.PropTypes.func.isRequired,
  handleFocusSelected: React.PropTypes.func.isRequired,
  // from merge
  goToUrl: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
});


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
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    goToUrl: url => dispatchProps.redirectToUrl(url, stateProps.filters),
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      TopicFilterControlBar
    )
  );
