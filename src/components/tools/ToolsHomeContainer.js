import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'tools.title', defaultMessage: 'Tools' },
};

const ToolsHomeContainer = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
  return (
    <Grid>
      <Title render={titleHandler} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
        </Col>
      </Row>
    </Grid>
  );
};

ToolsHomeContainer.propTypes = {
  isLoggedIn: React.PropTypes.bool.isRequired,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      ToolsHomeContainer
    )
  );
