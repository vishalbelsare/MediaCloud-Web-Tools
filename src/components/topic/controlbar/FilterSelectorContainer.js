import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import FocusSelectorContainer from './FocusSelectorContainer';
import { filterBySnapshot } from '../../../actions/topicActions';
import { filteredLocation } from '../../util/location';
import SnapshotSelector from './SnapshotSelector';

/**
 * As the parent of other filters, it is useful for this one to own the snapshot selection process,
 * mostly so that heppens first before other things render.
 */
const FilterSelectorContainer = (props) => {
  const { filters, topicId, filtersVisible, snapshotId, snapshots, location, handleSnapshotSelected, onFocusSelected } = props;
  let content = null;
  let focusSelectorContent = null;
  if (snapshotId) {
    focusSelectorContent = (
      <FocusSelectorContainer
        topicId={topicId}
        location={location}
        snapshotId={filters.snapshotId}
        onFocusSelected={onFocusSelected}
      />
    );
  }
  if (filtersVisible) {
    content = (
      <div className="filter-selector">
        <Grid>
          <Row>
            <Col lg={4}>
              {focusSelectorContent}
            </Col>
            <Col lg={4}>
              <SnapshotSelector
                selectedId={snapshotId}
                snapshots={snapshots}
                onSnapshotSelected={handleSnapshotSelected}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  return content;
};

FilterSelectorContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  // from parent
  onFocusSelected: React.PropTypes.func.isRequired,
  // from dispatch
  handleSnapshotSelected: React.PropTypes.func.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  snapshots: React.PropTypes.array.isRequired,
  snapshotId: React.PropTypes.number,
  filtersVisible: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  filtersVisible: state.topics.selected.filtersVisible,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.snapshots.fetchStatus,
  snapshots: state.topics.selected.snapshots.list,
  snapshotId: state.topics.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSnapshotSelected: (snapshot) => {
    const newLocation = filteredLocation(ownProps.location, {
      snapshots_id: snapshot.snapshots_id,
      timespanId: null,
      focusId: null,
    });
    dispatch(filterBySnapshot(snapshot.snapshots_id));
    dispatch(push(newLocation));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      FilterSelectorContainer
    )
  );
