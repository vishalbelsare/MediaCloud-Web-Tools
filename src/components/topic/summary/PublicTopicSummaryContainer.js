import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicSummaryContainer from './TopicSummaryContainer';
import AppButton from '../../common/AppButton';
import messages from '../../../resources/messages';

const PublicTopicSummaryContainer = (props) => {
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <br />
          <AppButton
            type="submit"
            label={formatMessage(messages.userLogin)}
            primary
          />
        </Col>
      </Row>
      <Row>
        <TopicSummaryContainer />
      </Row>
    </Grid>
  );
};

PublicTopicSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      PublicTopicSummaryContainer
    )
  );
