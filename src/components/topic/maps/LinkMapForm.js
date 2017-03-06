import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from 'material-ui/MenuItem';
import AppButton from '../../common/AppButton';
import composeIntlForm from '../../common/IntlForm';

export const NEW_FOCAL_SET_PLACEHOLDER_ID = -1;

const localMessages = {
  describeLinkMap: { id: 'linkmap.describe.about', defaultMessage: 'Link Map' },
  describeFocalSet: { id: 'linkmap.describe', defaultMessage: ' link map' },
  colorBy: { id: 'linkmap.colorby', defaultMessage: 'Color By' },
  partisan_code: { id: 'linkmap.colorby.partisan', defaultMessage: 'Partisan Code' },
  media_type: { id: 'linkmap.colorby.media', defaultMessage: 'Media Type' },
  media: { id: 'linkmap.media', defaultMessage: 'Media' },
  weightEdges: { id: 'linkmap.weightEdges', defaultMessage: 'Weight Edges' },
  outlinks: { id: 'linkmap.outlinks', defaultMessage: 'Outlinks/Media' },
  errorNameYourFocus: { id: 'linkmap.error.noName', defaultMessage: 'You need to name your Focus.' },
};

const LinkMapForm = (props) => {
  const { renderTextField, renderSelectField, renderCheckbox, buttonLabel, initialValues, pristine, submitting, handleSubmit, onFetch } = props;
  const { formatMessage } = props.intl;
  // if they pick "make a new focal set" then let them enter name and description
  return (
    <form className="app-form link-map-form" name="linkMapForm" onSubmit={handleSubmit(onFetch.bind(this))}>
      <Row>
        <Col lg={3} xs={12}>
          <Field
            name="color_field"
            values={initialValues.color_field}
            component={renderSelectField}
            floatingLabelText={formatMessage(localMessages.colorBy)}
          >
            <MenuItem
              key={0}
              value={'partisan_code'}
              primaryText={formatMessage(localMessages.partisan_code)}
            />
            <MenuItem
              key={1}
              value={'media_type'}
              primaryText={formatMessage(localMessages.media_type)}
            />
          </Field>
        </Col>
      </Row>
      <Row>
        <Col lg={3} xs={12}>
          <Field
            values={initialValues.media}
            name="num_media"
            component={renderTextField}
            floatingLabelText={formatMessage(localMessages.media)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3} xs={12}>
          <Field
            name="include_weights"
            initialValues={initialValues.include_weights}
            component={renderCheckbox}
            floatingLabelText={formatMessage(localMessages.weightEdges)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3} xs={12}>
          <Field
            name="num_links_per_medium"
            component={renderTextField}
            floatingLabelText={formatMessage(localMessages.outlinks)}
          />
        </Col>

      </Row>
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
    </form>
  );
};

LinkMapForm.propTypes = {
  // from parent
  topicId: React.PropTypes.number,
  initialValues: React.PropTypes.object.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  renderTextField: React.PropTypes.func.isRequired,
  renderCheckbox: React.PropTypes.func.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func,
  onFetch: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  buttonLabel: React.PropTypes.string,
};

const mapStateToProps = () => ({
});

function validate() {
  const errors = {};
  return errors;
}

const reduxFormConfig = {
  form: 'linkMapForm', // make sure this matches the sub-components and other wizard steps
  validate,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps)(
          LinkMapForm
        )
      )
    )
  );
