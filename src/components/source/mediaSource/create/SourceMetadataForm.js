import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import MetadataPickerContainer from './MetadataPickerContainer';

const localMessages = {
  title: { id: 'source.add.title', defaultMessage: 'Source Metadata' },
};

const SourceMetadataForm = () => (
  <div className="source-metadata-form">
    <Row>
      <Col lg={12} md={12} sm={12}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
      </Col>
    </Row>
    <Row>
      <Col lg={12} md={12} sm={12}>
        <MetadataPickerContainer id={123} name={'detectedLanguage'} />
      </Col>
    </Row>
  </div>
);

SourceMetadataForm.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    SourceMetadataForm
  );
