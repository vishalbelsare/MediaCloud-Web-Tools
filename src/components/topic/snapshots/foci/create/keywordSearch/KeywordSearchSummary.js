import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 4: Confirm Your New "{name}" Focus' },
  name: { id: 'focus.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'focus.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Focal Technique</b>: {name}' },
  keywords: { id: 'focus.create.confirm.keywords', defaultMessage: '<b>Keywords</b>: {keywords}' },
};

const KeywordSearchSummary = (props) => {
  const { properties } = props;
  return (
    <div>
      <Row>
        <Col lg={12}>
          <h2><FormattedMessage {...localMessages.title} values={{ name: properties.name }} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ul>
            <li><FormattedHTMLMessage {...localMessages.name} values={{ name: properties.name }} /></li>
            <li><FormattedHTMLMessage {...localMessages.description} values={{ description: properties.description }} /></li>
            <li><FormattedHTMLMessage {...localMessages.focalTechnique} values={{ name: properties.focalTechnique }} /></li>
            <li><FormattedHTMLMessage {...localMessages.keywords} values={{ keywords: properties.keywords }} /></li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

KeywordSearchSummary.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  properties: React.PropTypes.object.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    KeywordSearchSummary
  );
