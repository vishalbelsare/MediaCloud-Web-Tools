import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ComingSoon from '../../../../components/common/ComingSoon';

const localMessages = {
  title: { id: 'sources.create.title', defaultMessage: 'Add a New Source' },
};

const CreateSourceContainer = (props) => {
  const title = props.intl.formatMessage(localMessages.title);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <Row>
        <Col lg={6} md={6} sm={6}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <ComingSoon />
        </Col>
      </Row>
    </Grid>
  );
};


CreateSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    CreateSourceContainer
  );
