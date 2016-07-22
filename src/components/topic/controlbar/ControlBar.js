import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkWithFilters from '../LinkWithFilters';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';
import TimespanSelectorContainer from './TimespanSelectorContainer';
import messages from '../../../resources/messages';

const ControlBar = (props) => {
  const { title, topicId, location } = props;
  return (
    <div className="controlbar">
      <Grid>
        <Row>
          <Col lg={3} md={3} sm={3} className="left">
            <LinkWithFilters to={`/topics/${topicId}/foci/create`}>
              <FormattedMessage {...messages.focusCreate} />
            </LinkWithFilters>
          </Col>
          <Col lg={6} md={6} sm={6} className="middle">
            <TimespanSelectorContainer topicId={topicId} location={location} />
          </Col>
          <Col lg={3} md={3} sm={3} className="right">
            <SnapshotSelectorContainer topicId={topicId} location={location} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

ControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  title: React.PropTypes.string,
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
};

export default injectIntl(ControlBar);
