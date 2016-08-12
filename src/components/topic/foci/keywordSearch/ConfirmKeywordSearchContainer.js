import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../actions/topicActions';
import messages from '../../../../resources/messages';
import KeywordSearchResultsContainer from './KeywordSearchResultsContainer';

const localMessages = {
  title: { id: 'focus.create.confirm.title', defaultMessage: 'Step 3: Confirm Your New "{name}" Focus' },
  name: { id: 'focus.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'focus.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  focalTechnique: { id: 'focus.create.confirm.focalTechnique', defaultMessage: '<b>Focal Technique</b>: {name}' },
  generateSnapshot: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Generate Snapshot' },
  addAnotherFocus: { id: 'focus.create.generateSnapshot', defaultMessage: 'Save and Add Another Focus' },
};

class ConfirmKeywordSearchContainer extends React.Component {

  render() {
    const { topicId, saveAndAddAnother, saveAndGenerateSnapshot, properties } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Grid>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <h2><FormattedMessage {...localMessages.title} values={ { name: properties.name } } /></h2>
          </Col>
        </Row>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <ul>
              <li><FormattedHTMLMessage {...localMessages.name} values={ { name: properties.name } } /></li>
              <li><FormattedHTMLMessage {...localMessages.description} values={ { description: properties.description } } /></li>
              <li><FormattedHTMLMessage {...localMessages.focalTechnique} values={ { name: properties.focalTechnique } } /></li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col lg={10} md={10} sm={10}>
            <FlatButton label={formatMessage(localMessages.addAnotherFocus)} onClick={ saveAndAddAnother } />
            <RaisedButton primary label={formatMessage(localMessages.generateSnapshot)} onClick={ saveAndGenerateSnapshot } />
          </Col>
        </Row>
      </Grid>
    );
  }

}

ConfirmKeywordSearchContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  // from dispatch
  saveAndAddAnother: React.PropTypes.func.isRequired,
  saveAndGenerateSnapshot: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.focusCreateSetup,
});

const mapDispatchToProps = (dispatch) => ({
  saveAndAddAnother: (properties) => {
    console.log('saveAndAddAnother');
    // dispatch(setNewFocusProperties(properties));
  },
  saveAndGenerateSnapshot: (properties) => {
    console.log('saveAndGenerateSnapshot');
    // dispatch(setNewFocusProperties({ keywords }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      const focusProps = {
        keywords: values.keywords,
      };
      dispatchProps.setProperties(focusProps);
      dispatchProps.goToStep(2);
    },
    handleSearchClick: () => {
      const keywords = stateProps.formData.keywords.value;
      dispatchProps.setProperties({ keywords });
    },
  });
}

export default
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    injectIntl(
      ConfirmKeywordSearchContainer
    )
  );
