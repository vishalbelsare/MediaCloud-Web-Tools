import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LinkWithFilters from '../../LinkWithFilters';
import messages from '../../../../resources/messages';

const CreateFocusControlBar = (props) => {
  const { topicId } = props;
  return (
    <div className="controlbar controlbar-focus-create">
      <div className="main">
        <Grid>
          <Row>
            <Col lg={2} md={2} sm={12} className="left">
              <LinkWithFilters to={`/topics/${topicId}/summary`}>
                &larr; <FormattedMessage {...messages.backToTopic} />
              </LinkWithFilters>
            </Col>
            <Col lg={8} md={8} sm={12} className="middle" />
          </Row>
        </Grid>
      </div>
    </div>
  );
};

CreateFocusControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  currentStep: React.PropTypes.number.isRequired,
};

export default injectIntl(CreateFocusControlBar);
