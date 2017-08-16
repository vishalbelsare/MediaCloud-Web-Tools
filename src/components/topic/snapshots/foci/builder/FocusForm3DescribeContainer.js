import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../../common/IntlForm';
import AppButton from '../../../../common/AppButton';
import FocusDescriptionForm, { NEW_FOCAL_SET_PLACEHOLDER_ID } from './FocusDescriptionForm';
import { FOCAL_TECHNIQUE_BOOLEAN_QUERY, FOCAL_TECHNIQUE_RETWEET_PARTISANSHIP } from '../../../../../lib/focalTechniques';
import { goToCreateFocusStep } from '../../../../../actions/topicActions';
import messages from '../../../../../resources/messages';
import FocalSetForm from './FocalSetForm';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.setup3.title', defaultMessage: 'Step 3: Describe Your Subtopic' },
  retweetIntro: { id: 'focus.create.setup3.retweetIntro', defaultMessage: 'This will create a set with one subtopic for each of the partisan quintiles.  For example, any story from a media source in the "center left" group will be put into the "center left" subtopic in this set.  Name thet set and we will create the 5 subtopics within it.  Give it a name that makes these subtopics easy to identify later.' },
  defaultSetNameRetweet: { id: 'focus.create.setup3.retweet.setName', defaultMessage: 'Retweet Partisanship' },
  defaultSetDescriptionRetweet: { id: 'focus.create.setup3.retweet.setDescription', defaultMessage: 'Subtopics driven by our analysis of Twitter followers of Trump and Clinton during the 2016 election season.  Each media soure is scored based on the ratio of retweets of their stories in those two groups.' },
};

const FocusForm3DescribeContainer = (props) => {
  const { topicId, handleSubmit, finishStep, goToStep, initialValues, focalSetDefinitions, formData } = props;
  const { formatMessage } = props.intl;
  // figure out a which focal set to default to
  if (focalSetDefinitions.length === 0) {
    initialValues.focalSetId = NEW_FOCAL_SET_PLACEHOLDER_ID;
  } else {
    initialValues.focalSetId = focalSetDefinitions[0].focal_set_definitions_id;
  }
  let content;
  switch (formData.focalTechnique) {
    case FOCAL_TECHNIQUE_BOOLEAN_QUERY:
      content = (<FocusDescriptionForm
        topicId={topicId}
        initialValues={initialValues}
        focalSetDefinitions={focalSetDefinitions}
      />);
      break;
    case FOCAL_TECHNIQUE_RETWEET_PARTISANSHIP:
      const introContent = (
        <p><FormattedMessage {...localMessages.retweetIntro} /></p>
      );
      content = (
        <Row>
          <Col lg={10}>
            <FocalSetForm
              initialValues={{
                ...initialValues,
                focalSetName: formatMessage(localMessages.defaultSetNameRetweet),
                focalSetDescription: formatMessage(localMessages.defaultSetDescriptionRetweet),
              }}
              introContent={introContent}
              fullWidth
            />
          </Col>
        </Row>
      );
      break;
    default:
      content = <FormattedMessage {...messages.unimplemented} />;
  }
  return (
    <Grid>
      <form className="focus-create-details" name="snapshotFocusForm" onSubmit={handleSubmit(finishStep.bind(this))}>
        <Row>
          <Col lg={10}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
          </Col>
        </Row>
        {content}
        <Row>
          <Col lg={12}>
            <AppButton flat label={formatMessage(messages.previous)} onClick={() => goToStep(1)} />
            &nbsp; &nbsp;
            <AppButton type="submit" label={formatMessage(messages.next)} primary />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

FocusForm3DescribeContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  // form composition
  intl: PropTypes.object.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  focalSetDefinitions: PropTypes.array.isRequired,
  formData: PropTypes.object,
  // from dispatch
  goToStep: PropTypes.func.isRequired,
  finishStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  focalSetDefinitions: state.topics.selected.focalSets.definitions.list,
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  formData: formSelector(state, 'focalTechnique', 'focalSetDefinitionId'),
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreateFocusStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
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
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          FocusForm3DescribeContainer
        )
      )
    )
  );
