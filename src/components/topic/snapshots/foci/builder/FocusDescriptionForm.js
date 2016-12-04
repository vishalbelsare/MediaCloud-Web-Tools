import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import composeIntlForm from '../../../../common/IntlForm';
import FocalSetForm from './FocalSetForm';
import { emptyString, nullOrUndefined } from '../../../../../lib/formValidators';

export const NEW_FOCAL_SET_PLACEHOLDER_ID = -1;

const localMessages = {
  describeFocusAbout: { id: 'focus.create.describe.about', defaultMessage: 'Give your focus a useful name and description so other people understand what it is for. You can change these later.' },
  describeFocalSet: { id: 'focus.create.describeSet.about', defaultMessage: 'Your Focus has to be part of a Set, which lets you compare it to other Foci in the same Set.' },
  focusName: { id: 'focus.name', defaultMessage: 'Focus Name' },
  focusDescription: { id: 'focus.description', defaultMessage: 'Focus Description' },
  pickFocalSet: { id: 'focus.pickFocalSet', defaultMessage: 'Pick a Focal Set' },
  newFocalSetName: { id: 'focus.techniquePicker.new.name', defaultMessage: 'Create a New Focal Set' },
  newFocalSetDescription: { id: 'focus.techniquePicker.new.description', defaultMessage: 'Pick this if you want to make a new Focal Set for this Focus.  Any Foci you add to it will be based on keyword searches.' },
  errorNameYourFocus: { id: 'focus.error.noName', defaultMessage: 'You need to name your Focus.' },
  errorPickASet: { id: 'focus.error.noSet', defaultMessage: 'You need to pick or create a Focal Set.' },
};

const formSelector = formValueSelector('snapshotFocus');

const FocusDescriptionForm = (props) => {
  const { renderTextField, renderSelectField, focalSetDefinitions, initialValues, currentFocalSetDefinitionId } = props;
  const { formatMessage } = props.intl;
  // if they pick "make a new focal set" then let them enter name and description
  let focalSetContent = null;
  if (currentFocalSetDefinitionId === NEW_FOCAL_SET_PLACEHOLDER_ID) {
    focalSetContent = <FocalSetForm initialValues={initialValues} />;
  }
  return (
    <div className="focus-create-details">
      <Row>
        <Col lg={3} xs={12}>
          <Field
            name="focusName"
            component={renderTextField}
            floatingLabelText={localMessages.focusName}
          />
        </Col>
        <Col lg={3} xs={12}>
          <Field
            name="focusDescription"
            component={renderTextField}
            multiLine
            floatingLabelText={localMessages.focusDescription}
          />
        </Col>
        <Col lg={3} xs={12}>
          <Field
            name="focalSetDefinitionId"
            component={renderSelectField}
            floatingLabelText={localMessages.pickFocalSet}
          >
            {focalSetDefinitions.map(focalSetDef =>
              <MenuItem
                key={focalSetDef.focal_set_definitions_id}
                value={focalSetDef.focal_set_definitions_id}
                primaryText={focalSetDef.name}
              />
            )}
            <MenuItem
              key={NEW_FOCAL_SET_PLACEHOLDER_ID}
              value={NEW_FOCAL_SET_PLACEHOLDER_ID}
              primaryText={formatMessage(localMessages.newFocalSetName)}
            />
          </Field>
          {focalSetContent}
        </Col>
        <Col lg={1} sm={0} />
        <Col lg={2} sm={12}>
          <p className="light"><i><FormattedMessage {...localMessages.describeFocusAbout} /></i></p>
          <p className="light"><i><FormattedMessage {...localMessages.describeFocalSet} /></i></p>
        </Col>
      </Row>
    </div>
  );
};

FocusDescriptionForm.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object.isRequired,
  focalSetDefinitions: React.PropTypes.array.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  // from state
  currentFocalSetDefinitionId: React.PropTypes.number,
};

const mapStateToProps = state => ({
  // pull the focal set id out of the form so we know when to show the focal set create sub form
  currentFocalSetDefinitionId: parseInt(formSelector(state, 'focalSetDefinitionId'), 10),
});

function validate(values) {
  const errors = {};
  if (emptyString(values.focusName)) {
    errors.focusName = localMessages.errorNameYourFocus;
  }
  if (nullOrUndefined(values.focalSetId)) {
    errors.focalSetId = localMessages.errorPickASet;
  }
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
        connect(mapStateToProps)(
          FocusDescriptionForm
        )
      )
    )
  );
