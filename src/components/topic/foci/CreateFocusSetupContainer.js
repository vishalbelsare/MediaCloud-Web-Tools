import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TextField from 'material-ui/TextField';
import { setNewFocusProperties, goToCreateFocusStep, fetchFocalSetDefinitions } from '../../../actions/topicActions';
import CreateFocalSetForm from './CreateFocalSetForm';
import FocalTechniqueSelector from './FocalTechniqueSelector';
import FocalSetDefinitionSelector from './FocalSetDefinitionSelector';
import { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocalSetDefinitionSelector';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY } from '../../../lib/focalTechniques';
import messages from '../../../resources/messages';
import composeAsyncContainer from '../../common/AsyncContainer';

const localMessages = {
  title: { id: 'focus.create.setup.title', defaultMessage: 'Step 1: Setup Your Focus' },
  about: { id: 'focus.create.setup.about',
    defaultMessage: 'Creating a Focus lets you identify sub-conversations within this Topic that you can compare to one-another. For example, in a Topic about an election, you could have a topic for coverage about each candidate.' },
  describeFocusTitle: { id: 'focus.create.describe.title', defaultMessage: 'Describe Your New Focus' },
  describeFocusAbout: { id: 'focus.create.describe.about', defaultMessage: 'Give your focus a useful name and description so other people understand what it is for. You can change these later.' },
  focusName: { id: 'focus.name', defaultMessage: 'Focus Name' },
  focusDescription: { id: 'focus.description', defaultMessage: 'Focus Description' },
};

class CreateFocusSetupContainer extends React.Component {

  handleFocalSetSelected = (focalSetDefinition) => {
    const { setProperties } = this.props;
    setProperties({ focalSetDefinition });
  }

  handleFocalTechniqueSelected = (focalTechnique) => {
    const { setProperties } = this.props;
    setProperties({ focalTechnique });
  }

  render() {
    const { fields: { focusName, focusDescription }, handleSubmit, finishStep, properties, focalSetDefinitions } = this.props;
    const { formatMessage } = this.props.intl;
    let step2Content = null;
    if (properties.focalTechnique !== null) {
      if (properties.focalTechnique === FOCAL_TECHNIQUE_BOOLEAN_QUERY) {
        let focalSetContent = null;
        if ((properties.focalSetDefinition !== null) && (properties.focalSetDefinition.focal_set_definitions_id < 0)) {
          focalSetContent = <CreateFocalSetForm />;
        }
        step2Content = (
          <div>
            <Row>
              <Col lg={10} md={10} sm={10}>
                <h3><FormattedMessage {...localMessages.describeFocusTitle} /></h3>
              </Col>
            </Row>
            <Row>
              <Col lg={4} md={4} sm={12}>
                <TextField
                  floatingLabelText={ formatMessage(localMessages.focusName) }
                  errorText={focusName.touched ? focusName.error : ''}
                  {...focusName}
                />
              </Col>
              <Col lg={4} md={4} sm={12}>
                <TextField
                  multiLine
                  floatingLabelText={ formatMessage(localMessages.focusDescription) }
                  errorText={focusDescription.touched ? focusDescription.error : ''}
                  {...focusDescription}
                />
              </Col>
              <Col lg={2} md={2} sm={0} />
              <Col lg={2} md={2} sm={12}>
                <p className="light"><i><FormattedMessage {...localMessages.describeFocusAbout} /></i></p>
              </Col>
            </Row>
            <FocalSetDefinitionSelector focalSetDefinitions={focalSetDefinitions}
              selected={properties.focalSetDefinition}
              onSelected={this.handleFocalSetSelected}
            />
            { focalSetContent }
          </div>
        );
      }
    }
    let nextButtonDisabled = true;
    if ((properties.focalTechnique !== null) &&
        (properties.focalSetDefinition !== null) &&
        ('focal_set_definitions_id' in properties.focalSetDefinition) &&
        (properties.focalSetDefinition.focal_set_definitions_id !== null)) {
      nextButtonDisabled = false;
    }
    return (
      <Grid>
        <form className="focus-create-setup" name="focusCreateSetupForm" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10} md={10} sm={10}>
              <h2><FormattedMessage {...localMessages.title} /></h2>
              <p>
                <FormattedMessage {...localMessages.about} />
              </p>
            </Col>
          </Row>
          <FocalTechniqueSelector selected={properties.focalTechnique}
            onSelected={this.handleFocalTechniqueSelected}
          />
          { step2Content }
          <Row>
            <Col lg={12} md={12} sm={12} >
              <RaisedButton disabled={nextButtonDisabled} type="submit" label={formatMessage(messages.next)} primary />
            </Col>
          </Row>
        </form>
      </Grid>
    );
  }

}

CreateFocusSetupContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  // form context
  intl: React.PropTypes.object.isRequired,
  // from form helper
  fields: React.PropTypes.object.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  focalSetDefinitions: React.PropTypes.array.isRequired,
  properties: React.PropTypes.object.isRequired,
  formData: React.PropTypes.object,
  // from dispatch
  setProperties: React.PropTypes.func.isRequired,
  finishStep: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from LoginForm helper
  handleSubmit: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
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
      if (stateProps.properties.focalSetDefinition.focal_set_definitions_id === NEW_FOCAL_SET_PLACEHOLDER_ID) {
        focusProps.focalSetName = stateProps.formData.focalSetName.value;
        focusProps.focalSetDescription = stateProps.formData.focalSetDescription.value;
      }
      dispatchProps.setProperties(focusProps);
      dispatchProps.goToStep(1);
    },
  });
}

function validate(values) {
  const errors = {};
  if (!values.focusName || values.focusName.trim() === '') {
    errors.focusName = ('You need to name your Focus.');
  }
  return errors;
}

const reduxFormConfig = {
  form: 'focusCreateSetup',
  fields: ['focusName', 'focusDescription'],
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps, mergeProps)(
    composeAsyncContainer(
      injectIntl(
        CreateFocusSetupContainer
      )
    )
  );
