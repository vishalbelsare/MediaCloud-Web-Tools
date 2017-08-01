import PropTypes from 'prop-types';
import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FocusSetSelectorContainer, { NO_FOCAL_SET_SELECTED } from './FocusSetSelectorContainer';
import FociAttentionComparisonContainer from './FociAttentionComparisonContainer';
import { setAttentionFocalSetId } from '../../../actions/topicActions';

const localMessages = {
  mainTitle: { id: 'attention.mainTitle', defaultMessage: 'Attention Scoreboard' },
};

const AttentionContainer = (props) => {
  const { selectedFocalSetId, filters, focalSets, topicId, handleFocalSetSelected } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  let content = null;
  const defaultFocalSet = focalSets.length > 0 ? focalSets[0].focal_sets_id : NO_FOCAL_SET_SELECTED;
  if (selectedFocalSetId !== NO_FOCAL_SET_SELECTED) {
    content = (<FociAttentionComparisonContainer
      topicId={topicId}
      filters={filters}
      selectedFocalSetId={selectedFocalSetId}
    />);
  } else if (focalSets.length > 0) { // handle case for default if we do have any focal sets
    content = (<FociAttentionComparisonContainer
      topicId={topicId}
      filters={filters}
      selectedFocalSetId={defaultFocalSet}
    />);
  }
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <FocusSetSelectorContainer
              topicId={topicId}
              snapshotId={filters.snapshotId}
              onFocalSetSelected={handleFocalSetSelected}
              selectedFocalSetId={selectedFocalSetId !== NO_FOCAL_SET_SELECTED ? selectedFocalSetId : defaultFocalSet}
              hideNoneOption
            />
          </Col>
        </Row>
        {content}
      </Grid>
    </div>
  );
};

AttentionContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number,
  selectedFocalSetId: PropTypes.number,
  focalSets: PropTypes.array,
  // from dispatch
  handleFocalSetSelected: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  focalSets: state.topics.selected.focalSets.all.list,
  selectedFocalSetId: state.topics.selected.attention.selectedFocalSetId,
});

const mapDispatchToProps = dispatch => ({
  handleFocalSetSelected: (evt, idx, focalSetId) => {
    dispatch(setAttentionFocalSetId(parseInt(focalSetId, 10)));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AttentionContainer
    )
  );
