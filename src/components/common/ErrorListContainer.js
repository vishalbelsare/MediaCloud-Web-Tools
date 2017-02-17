import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import { dismissErrors } from '../../actions/appActions';
import AppButton from '../common/AppButton';
import ErrorItem from './ErrorItem';

const localMessages = {
  dismiss: { id: 'errors.dismiss', defaultMessage: 'dismiss' },
};

const ErrorListContainer = (props) => {
  const { errors, handleDismiss } = props;
  const { formatMessage } = props.intl;
  let content = null;
  if (errors.length > 0) {
    content = (
      <div id="error-list">
        <Grid>
          <Row>
            <Col lg={12}>
              {errors.map((error, idx) => <ErrorItem key={idx} error={error} />)}
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Row end="lg">
                <Col lg={1}>
                  <AppButton flat label={formatMessage(localMessages.dismiss)} onClick={handleDismiss} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  return content;
};

ErrorListContainer.propTypes = {
  // from parent
  // from context
  intl: React.PropTypes.object.isRequired,
  // state
  errors: React.PropTypes.array,
  // from dispatch
  handleDismiss: React.PropTypes.func.isRequired,
};

ErrorListContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.app.errors,
});

const mapDispatchToProps = dispatch => ({
  handleDismiss: () => {
    dispatch(dismissErrors());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      ErrorListContainer
    )
  );
