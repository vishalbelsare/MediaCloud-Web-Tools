import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CreateFocusControlBar from './CreateFocusControlBar';
import messages from '../../../resources/messages';
import Selector from '../../common/Selector';

const CreateFocusContainer = (props) => {
  const { topicId } = props;
  return (
    <div>
      <CreateFocusControlBar topicId={topicId} />
      <Grid>
        <Row>
          <Col lg={1} md={1} sm={12}>
            <h2><FormattedMessage {...messages.focusCreate1Title} /></h2>
            <p className="light">
              <FormattedMessage {...messages.focusCreate1About} />
            </p>
            <form>
              <FormattedMessage {...messages.pickFocalSet} />
              <Selector />
            </form>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

CreateFocusContainer.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
  // from context:
  topicId: React.PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

export default connect(
  mapStateToProps,
  null
)(CreateFocusContainer);
