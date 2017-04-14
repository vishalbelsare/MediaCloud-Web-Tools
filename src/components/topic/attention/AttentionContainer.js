import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FocusSetSelectorContainer from './FocusSetSelectorContainer';
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
  const defaultFocalSet = focalSets.length > 0 ? focalSets[0].focal_sets_id : '0';
  if (selectedFocalSetId !== '0') {
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
            <FocusSetSelectorContainer
              topicId={topicId}
              snapshotId={filters.snapshotId}
              onFocalSetSelected={handleFocalSetSelected}
              selectedFocalSetId={selectedFocalSetId !== '0' ? selectedFocalSetId : defaultFocalSet}
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
  intl: React.PropTypes.object.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number,
  selectedFocalSetId: React.PropTypes.string,
  focalSets: React.PropTypes.array,
  // from dispatch
  handleFocalSetSelected: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  focalSets: state.topics.selected.focalSets.all.list,
  selectedFocalSetId: state.topics.selected.attention.selectedFocalSetId,
});

const mapDispatchToProps = dispatch => ({
  handleFocalSetSelected: (evt, idx, focalSetId) => {
    dispatch(setAttentionFocalSetId(focalSetId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AttentionContainer
    )
  );
