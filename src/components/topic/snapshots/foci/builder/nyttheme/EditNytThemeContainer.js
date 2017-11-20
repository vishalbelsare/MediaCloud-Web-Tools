import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../../common/AppButton';
import composeIntlForm from '../../../../../common/IntlForm';
import messages from '../../../../../../resources/messages';
import NytThemeCoveragePreviewContainer from './NytThemeCoveragePreviewContainer';
import NytThemeStoryCountsPreviewContainer from './NytThemeStoryCountsPreviewContainer';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.edit.title', defaultMessage: 'Step 2: Preview Subtopics by NYT Themes' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: 'This will create a set of subtopics as filtered by the NYT Themes you have selected.' },
  numberLabel: { id: 'focus.create.edit.number', defaultMessage: '# Top Themes' },
};

const EditNytThemeContainer = (props) => {
  const { topicId, onPreviousStep, handleSubmit, finishStep, formData, initialValues, renderSelectField } = props;
  const { formatMessage } = props.intl;
  let numThemes = initialValues.numberSelected;
  if (formData && formData.values.numberSelected) {
    numThemes = formData.values.numberSelected;
  }
  return (
    <Grid>
      <form className="focus-create-edit-nyt-theme" name="focusCreateEditNytThemeForm" onSubmit={handleSubmit(finishStep.bind(this))}>
        <Row>
          <Col lg={8} md={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.about} /></p>
          </Col>
        </Row>
        <Row>
          <Field
            name="numberSelected"
            component={renderSelectField}
            floatingLabelText={formatMessage(localMessages.numberLabel)}
            value={5}
          >
            <MenuItem value={5} primaryText="Top 5" />
            <MenuItem value={10} primaryText="Top 10" />
            <MenuItem value={15} primaryText="Top 15" />
            <MenuItem value={20} primaryText="Top 20" />
            <MenuItem value={25} primaryText="Top 25" />
          </Field>
        </Row>
        <Row>
          <Col lg={8} md={12}>
            <NytThemeCoveragePreviewContainer topicId={topicId} numThemes={numThemes} />
          </Col>
        </Row>
        <Row>
          <Col lg={8} md={12}>
            <NytThemeStoryCountsPreviewContainer topicId={topicId} numThemes={numThemes} />
          </Col>
        </Row>
        <Row>
          <Col lg={8} xs={12}>
            <br />
            <AppButton flat onClick={onPreviousStep} label={formatMessage(messages.previous)} />
            &nbsp; &nbsp;
            <AppButton type="submit" label={formatMessage(messages.next)} primary />
          </Col>
        </Row>
      </form>
    </Grid>
  );
};

EditNytThemeContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  onPreviousStep: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
  // from state
  formData: PropTypes.object,
  currentKeywords: PropTypes.string,
  currentFocalTechnique: PropTypes.string,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  // from compositional helper
  intl: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  renderTextField: PropTypes.func.isRequired,
  renderSelectField: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form.snapshotFocus,
  currentKeywords: formSelector(state, 'keywords'),
  currentFocalTechnique: formSelector(state, 'focalTechnique'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finishStep: () => {
    ownProps.onNextStep({});
  },
});

const reduxFormConfig = {
  form: 'snapshotFocus', // make sure this matches the sub-components and other wizard steps
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          EditNytThemeContainer
        )
      )
    )
  );
