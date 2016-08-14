import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkWithFilters from '../LinkWithFilters';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';

class ManageFocalSetsControlBar extends React.Component {
  render() {
    const { topicId, currentStep } = this.props;
    return (
      <div className="controlbar controlbar-focus-manage">
        <div className="main">
          <Grid>
            <Row>
              <Col lg={2} md={2} sm={12} className="left">
                <LinkWithFilters to={`/topics/${topicId}/summary`}>
                  &larr; <FormattedMessage {...messages.backToTopic} />
                </LinkWithFilters>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

ManageFocalSetsControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
};

export default injectIntl(ManageFocalSetsControlBar);
