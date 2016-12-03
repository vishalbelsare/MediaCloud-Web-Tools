import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../../common/IntlForm';
import FocalTechniqueSelector from './FocalTechniqueSelector';
import AppButton from '../../../../common/AppButton';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../../actions/topicActions';
import messages from '../../../../../resources/messages';

const localMessages = {
  title: { id: 'focus.create.setup.title', defaultMessage: 'Step 1: Pick a Technique' },
  about: { id: 'focus.create.setup.about',
    defaultMessage: 'Creating a Focus lets you identify sub-conversations within this Topic that you can compare to one-another. For example, in a Topic about an election, you could have a topic for coverage about each candidate.' },
};

class FocusForm1TechniqueContainer extends React.Component {

  componentWillMount() {
    // grab any pre-filled-in props from the url and save them here
    const { setProperties } = this.props;
    const { focalSetDefId, focalTechnique } = this.props.location.query;
    if (focalTechnique !== undefined) {
      setProperties({ focalTechnique });
    }
    // if there aren't any focal set defs, the user should have to create a new one
    if (focalSetDefId !== undefined) {
      setProperties({ focalSetDefinitionId: focalSetDefId });
    }
  }

  handleFocalTechniqueSelected = (focalTechnique) => {
    const { setProperties } = this.props;
    setProperties({ focalTechnique });
  }

  render() {
    const { handleSubmit, finishStep, properties } = this.props;
    const { formatMessage } = this.props.intl;
    let nextButtonDisabled = true;
    if (properties.focalTechnique !== null) {
      nextButtonDisabled = false;
    }
    return (
      <Grid>
        <form className="focus-create-setup" name="snapshotFocusForm" onSubmit={handleSubmit(finishStep.bind(this))}>
          <Row>
            <Col lg={10} md={10} sm={10}>
              <h1><FormattedMessage {...localMessages.title} /></h1>
              <p>
                <FormattedMessage {...localMessages.about} />
              </p>
            </Col>
          </Row>
          <FocalTechniqueSelector
            selected={properties.focalTechnique}
            onSelected={this.handleFocalTechniqueSelected}
          />
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

FocusForm1TechniqueContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  initialValues: React.PropTypes.object,
  // form composition
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  properties: React.PropTypes.object.isRequired,
  // from dispatch
  setProperties: React.PropTypes.func.isRequired,
  finishStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  properties: state.topics.selected.focalSets.create.properties,
});

const mapDispatchToProps = dispatch => ({
  setProperties: (properties) => {
    dispatch(setNewFocusProperties(properties));
  },
  goToStep: (step) => {
    dispatch(goToCreateFocusStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.goToStep(1);
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
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          FocusForm1TechniqueContainer
        )
      )
    )
  );
