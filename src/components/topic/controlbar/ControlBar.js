import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';
import TimespanSelectorContainer from './timespans/TimespanSelectorContainer';
import FocusSelectorContainer from './FocusSelectorContainer';
import LinkWithFilters from '../LinkWithFilters';
import { filteredLinkTo } from '../../util/location';
import CreateSnapshotButton from './CreateSnapshotButton';
import { SettingsButton } from '../../common/IconButton';
import { updateFeedback } from '../../../actions/appActions';
import { setTopicFavorite } from '../../../actions/topicActions';
import FavoriteToggler from '../../common/FavoriteToggler';
import messages from '../../../resources/messages';

const ControlBar = (props) => {
  const { topicInfo, topicId, location, filters, handleChangeFavorited } = props;
  // const { formatMessage } = props.intl;
  // both the focus and timespans selectors need the snapshot to be selected first
  let focusSelector = null;
  let subControls = null;
  if ((filters.snapshotId !== null) && (filters.snapshotId !== undefined)) {
    subControls = <TimespanSelectorContainer topicId={topicId} location={location} filters={filters} />;
    focusSelector = <FocusSelectorContainer topicId={topicId} location={location} snapshotId={filters.snapshotId} />;
  }
  return (
    <div className="controlbar controlbar-topic">
      <div className="main">
        <Grid>
          <Row>
            <Col lg={4} className="left">
              <div className="topic-name">
                <LinkWithFilters to={`/topics/${topicInfo.topics_id}/summary`}>&larr;</LinkWithFilters>
                &nbsp;
                <b>
                  {topicInfo.name}
                </b>
              </div>
              <SettingsButton
                linkTo={filteredLinkTo(`/topics/${topicId}/settings`, filters)}
              />
              <FavoriteToggler
                isFavorited={topicInfo.isFavorite}
                onChangeFavorited={isFavNow => handleChangeFavorited(topicInfo.topics_id, isFavNow)}
              />
            </Col>
            <Col lg={4}>
              {focusSelector}
            </Col>
            <Col lg={4} className="right">
              <SnapshotSelectorContainer topicId={topicId} location={location} />
              <CreateSnapshotButton topicId={topicId} />
            </Col>
          </Row>
        </Grid>
      </div>
      <div className="sub">
        {subControls}
      </div>
    </div>
  );
};

ControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
  // from state
  filters: React.PropTypes.object.isRequired,
  topicInfo: React.PropTypes.object,
  // from dispatch
  handleChangeFavorited: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicInfo: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleChangeFavorited: (topicId, isFavorite) => {
    dispatch(setTopicFavorite(topicId, isFavorite))
      .then(() => {
        const msg = (isFavorite) ? messages.topicFavorited : messages.topicUnfavorited;
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(msg) }));
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ControlBar
    )
  );
