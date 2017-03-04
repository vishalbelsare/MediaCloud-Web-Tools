import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import FocusSelectorContainer from './FocusSelectorContainer';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';

const FilterSelectorContainer = (props) => {
  const { filters, topicId } = props;
  let focusSelector = null;
  if ((filters.snapshotId !== null) && (filters.snapshotId !== undefined)) {
    focusSelector = <FocusSelectorContainer topicId={topicId} location={location} snapshotId={filters.snapshotId} />;
  }
  let content = (<span />);
  if (filters.isVisible) {
    content = (
      <div className="filter-selector">
        <Grid>
          <Row>
            <Col lg={4}>
              {focusSelector}
            </Col>
            <Col lg={4}>
              <SnapshotSelectorContainer topicId={topicId} location={location} />
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
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      FilterSelectorContainer
    )
  );
