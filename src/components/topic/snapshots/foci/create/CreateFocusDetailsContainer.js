import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../../common/IntlForm';
import AppButton from '../../../../common/AppButton';
import { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocalSetDefinitionSelector';
import { setNewFocusProperties, goToCreateFocusStep, fetchFocalSetDefinitions } from '../../../../../actions/topicActions';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../../../lib/focalTechniques';
import messages from '../../../../../resources/messages';
import composeAsyncContainer from '../../../../common/AsyncContainer';
import FocusDetailsForm from './FocusDetailsForm';

const localMessages = {
  title: { id: 'focus.create.setup.title', defaultMessage: 'Step 3: Describe Your Focus' },
};

class CreateFocusDetailsContainer extends React.Component {

  handleFocalSetSelected = (event, index, focalSetDefinitionId) => {
    const { setProperties } = this.props;
    setProperties({ focalSetDefinitionId });
  }

  render() {
    const { topicId, handleSubmit, finishStep, properties, focalSetDefinitions } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    // console.log(properties);
    if (properties.focalTechnique === FOCAL_TECHNIQUE_BOOLEAN_QUERY) {
      content = (<FocusDetailsForm
        topicId={topicId}
        initialValues={{ focalSetId: properties.focalSetDefinitionId }}
        focalSetDefinitions={focalSetDefinitions}
        properties={properties}
        onFocalSetSelected={this.handleFocalSetSelected}
      />);
    }
    let nextButtonDisabled = true;
    if ((properties.focalTechnique !== null) &&
        (properties.focalSetDefinitionId !== null)) {
      nextButtonDisabled = false;
    }
    return (
      <Grid>
        <form className="focus-create-details" name="focusCreateSetupForm" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10} md={10} sm={10}>
              <h1><FormattedMessage {...localMessages.title} /></h1>
            </Col>
          </Row>
          { content }
          <Row>
            <Col lg={12} md={12} sm={12} >
              <AppButton disabled={nextButtonDisabled} type="submit" label={formatMessage(messages.next)} primary />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }

}

CreateFocusDetailsContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  focalSetDefinitions: React.PropTypes.array.isRequired,
  properties: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object,
  // from dispatch
  setProperties: React.PropTypes.func.isRequired,
  finishStep: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  properties: state.topics.selected.focalSets.create.properties,
  formData: state.form.focusCreateSetup,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setProperties: (properties) => {
    dispatch(setNewFocusProperties(properties));
  },
  goToStep: (step) => {
    dispatch(goToCreateFocusStep(step));
  },
  asyncFetch: () => {
    dispatch(fetchFocalSetDefinitions(ownProps.topicId));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      const focusProps = {
        topicId: ownProps.topicId,
        name: values.focusName,
        description: values.focusDescription,
      };
      if (stateProps.properties.focalSetDefinitionId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
        focusProps.focalSetName = stateProps.formData.values.focalSetName;
        focusProps.focalSetDescription = stateProps.formData.values.focalSetDescription;
      }
      dispatchProps.setProperties(focusProps);
      dispatchProps.goToStep(3);
    },
  });
}

function validate() {
  const errors = {};
  // TODO: figure out if we need to do more validation here, because in theory the
  // subforms components have already done it
  return errors;
}

const reduxFormConfig = {
  form: 'focusCreateSetup', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          composeAsyncContainer(
            CreateFocusDetailsContainer
          )
        )
      )
    )
  );
