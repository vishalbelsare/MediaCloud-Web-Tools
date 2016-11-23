import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../../common/IntlForm';
import { createSource } from '../../../../actions/sourceActions';
import AppButton from '../../../common/AppButton';
import SourceDetailsForm from './SourceDetailsForm';
import SourceMetadataForm from './SourceMetadataForm';
import { emptyString } from '../../../../lib/formValidators';

const localMessages = {
  mainTitle: { id: 'source.maintitle', defaultMessage: 'Create New source' },
  addButton: { id: 'source.add.saveAll', defaultMessage: 'Save New source' },
};

const CreateSourceContainer = (props) => {
  const { pristine, submitting, handleSubmit, handleSave } = props;
  const { formatMessage } = props.intl;
  const titleHandler = formatMessage(localMessages.mainTitle);
  const buttonLabel = formatMessage(localMessages.addButton);
  return (
    <div>
      <Title render={titleHandler} />
      <form className="source-details-form" name="sourcesSourceDetailsForm" onSubmit={handleSubmit(handleSave.bind(this))}>
        <Grid>
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
            </Col>
          </Row>
          <SourceDetailsForm />
          <SourceMetadataForm />
          <Row>
            <Col lg={12}>
              <AppButton
                style={{ marginTop: 30 }}
                type="submit"
                label={buttonLabel}
                disabled={pristine || submitting}
                primary
              />
            </Col>
          </Row>
        </Grid>
      </form>
    </div>
  );
};

CreateSourceContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  collections: React.PropTypes.array,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
  // from form healper
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleSave: (values) => {
    const newVals = Object.assign({}, values, {
      sourceObj: [{ name: values.sourceName, url: values.sourceUrl }] });
    dispatch(createSource(newVals));
   // .then(() => dispatch(createSource(ownProps.sourceId)));
  },
});

function validate(values) {
  console.log(values.name);
  const errors = {};
  if (emptyString(values.name)) {
    errors.email = localMessages.nameError;
  }
  if (emptyString(values.url)) {
    errors.permission = localMessages.urlError;
  }
  return errors;
}

const reduxFormConfig = {
  form: 'sourceDetailsForm',
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps)(
          CreateSourceContainer
        ),
      ),
    ),
  );
