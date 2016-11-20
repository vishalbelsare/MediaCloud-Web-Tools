import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ComingSoon from '../../../components/common/ComingSoon';

const localMessages = {
  searchTitle: { id: 'search.title', defaultMessage: 'Search' },
};

const SearchContainer = (props) => {
  const title = props.intl.formatMessage(localMessages.searchTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <Row>
        <Col lg={6} md={6} sm={6}>
          <h1><FormattedMessage {...localMessages.searchTitle} /></h1>
          <ComingSoon />
        </Col>
      </Row>
    </Grid>
  );
};


SearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    SearchContainer
  );
