import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import ClippingListContainer from './ClippingListContainer';
import messages from '../../resources/messages';

const localMessages = {
  intro: { id: 'tools.home.intro', defaultMessage: 'You can save any of visualizations in our tools to your Notebook. These are static pictures of the data at the point you saved it.  They link back to the screen you saved them from.' },
};

const NotebookHome = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.userNotebook)} | ${parentTitle}`;
  return (
    <div className="notebook-home">
      <Grid>
        <Title render={titleHandler} />
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...messages.userNotebook} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ClippingListContainer />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

NotebookHome.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    NotebookHome
  );
