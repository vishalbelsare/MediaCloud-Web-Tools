import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import { dismissNotices } from '../../actions/appActions';
import { CloseButton } from '../common/IconButton';
import AppNotice from './AppNotice';

const localMessages = {
  dismiss: { id: 'notices.dismiss', defaultMessage: 'dismiss' },
};

const AppNoticesContainer = (props) => {
  const { notices, handleDismiss } = props;
  const { formatMessage } = props.intl;
  let content = null;
  if (notices.length > 0) {
    content = (
      <div id="app-notice-list">
        <Grid>
          <Row>
            <Col lg={10}>
              {notices.map((notice, idx) => <AppNotice key={idx} info={notice} />)}
            </Col>
            <Col lg={2}>
              <CloseButton
                onClick={handleDismiss}
                tooltip={formatMessage(localMessages.dismiss)}
                backgroundColor="#000000"
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  return content;
};

AppNoticesContainer.propTypes = {
  // from parent
  // from context
  intl: React.PropTypes.object.isRequired,
  // state
  notices: React.PropTypes.array,
  // from dispatch
  handleDismiss: React.PropTypes.func.isRequired,
};

AppNoticesContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  notices: state.app.notices,
});

const mapDispatchToProps = dispatch => ({
  handleDismiss: () => {
    dispatch(dismissNotices());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AppNoticesContainer
    )
  );
