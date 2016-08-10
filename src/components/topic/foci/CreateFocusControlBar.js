import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkWithFilters from '../LinkWithFilters';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';

class CreateFocusControlBar extends React.Component {
  render() {
    const { topicId } = this.props;
    return (
      <div className="controlbar">
        <Grid>
          <Row>
            <Col lg={2} md={2} sm={12} className="left">
              <LinkWithFilters to={`/topics/${topicId}/summary`}>
                &larr; <FormattedMessage {...messages.backToTopic} />
              </LinkWithFilters>
            </Col>
            <Col lg={8} md={8} sm={12} className="middle">
              
            </Col>
            <Col lg={2} md={2} sm={12}>
              
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

CreateFocusControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from param
  topicId: React.PropTypes.number,
};

export default injectIntl(CreateFocusControlBar);
