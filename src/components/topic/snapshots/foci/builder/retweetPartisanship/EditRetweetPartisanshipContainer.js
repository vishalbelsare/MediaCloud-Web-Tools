import React from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../../../common/AppButton';
import composeIntlForm from '../../../../../common/IntlForm';
import messages from '../../../../../../resources/messages';
import RetweetCoveragePreviewContainer from './RetweetCoveragePreviewContainer';
import RetweetStoryCountsPreviewContainer from './RetweetStoryCountsPreviewContainer';
import { notEmptyString } from '../../../../../../lib/formValidators';

const formSelector = formValueSelector('snapshotFocus');

const localMessages = {
  title: { id: 'focus.create.edit.title', defaultMessage: 'Step 2: Configure Your {technique} Subtopic' },
  about: { id: 'focus.create.edit.about',
    defaultMessage: '<p>This will create a set of subtopics driven by our analysis of Twitter followers of Trump and Clinton during the 2016 election season..  Each media soure is scored based on the ratio of retweets of their stories in those two groups.  For instance, if their stories are almost completely retweeted by Trump followers on Twitter, then that media source will be assigned to the "right" subtopic.  This covers the 1000 most tweeted media sources, so it is likely it will not cover all the media sources in your Topic.</p>' },
};

const EditRetweetPartisanshipContainer = (props) => {
  const { topicId, onPreviousStep } = props;
  const { formatMessage } = props.intl;
  // preview:
  // * pie chart showing the pct of sentences covered by the quintiles
  // * horizontal bubble chart showing the amount of stories in each quintile
  // * line chart showing sentences over time - one line for each quintile
  return (
    <Grid>
      <Row>
        <Col lg={8}>
          <RetweetCoveragePreviewContainer topicId={topicId} />
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <RetweetStoryCountsPreviewContainer topicId={topicId} />
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
    </Grid>
  );
};

EditRetweetPartisanshipContainer.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  initialValues: React.PropTypes.object,
  onPreviousStep: React.PropTypes.func.isRequired,
  onNextStep: React.PropTypes.func.isRequired,
  // from state
  formData: React.PropTypes.object,
  currentKeywords: React.PropTypes.string,
  currentFocalTechnique: React.PropTypes.string,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  // from compositional helper
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form.snapshotFocus,
  currentKeywords: formSelector(state, 'keywords'),
  currentFocalTechnique: formSelector(state, 'focalTechnique'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  finishStep: (values) => {
    const customProps = {
      keywords: values.keywords,
    };
    ownProps.onNextStep(customProps);
  },
});

function validate(values) {
  const errors = {};
  if (!notEmptyString(values.keywords)) {
    errors.focusName = localMessages.errorNoKeywords;
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
        connect(mapStateToProps, mapDispatchToProps)(
          EditRetweetPartisanshipContainer
        )
      )
    )
  );
