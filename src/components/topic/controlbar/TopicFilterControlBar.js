import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import { filteredLinkTo, filteredLocation } from '../../util/location';
import CreateSnapshotButton from './CreateSnapshotButton';
import { EditButton, SettingsButton, FilterButton } from '../../common/IconButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { toggleFilterControls, filterByFocus } from '../../../actions/topicActions';
import FilterSelectorContainer from './FilterSelectorContainer';
import ActiveFiltersContainer from './ActiveFiltersContainer';

const REMOVE_FOCUS = 0;

const localMessages = {
  editPermissions: { id: 'topic.editPermissions', defaultMessage: 'Edit Topic Permissions' },
  editSettings: { id: 'topic.editSettings', defaultMessage: 'Edit Topic Settings' },
};

const TopicFilterControlBar = (props) => {
  const { topicId, location, filters, handleFilterToggle, handleFocusSelected } = props;
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
              <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
                <EditButton
                  linkTo={filteredLinkTo(`/topics/${topicId}/edit`, filters)}
                  tooltip={formatMessage(localMessages.editSettings)}
                />
                <SettingsButton
                  linkTo={filteredLinkTo(`/topics/${topicId}/permissions`, filters)}
                  tooltip={formatMessage(localMessages.editPermissions)}
                />
                <CreateSnapshotButton topicId={topicId} />
              </Permissioned>
            </Col>
            <Col lg={8} className="right">
              <FilterButton onClick={() => handleFilterToggle()} />
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
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicFilterControlBar
    )
  );
