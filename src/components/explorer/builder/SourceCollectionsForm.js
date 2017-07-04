import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import composeIntlForm from '../../common/IntlForm';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';

const renderCollectionSelector = ({ allowRemoval, fields }) => (
  <div>
    <Row>
      <Col lg={8}>
        {fields.map((name, index) => (
          <Field
            key={name}
            name={name}
            component={(info) => {
              const handleDelete = (allowRemoval || info.meta.dirty) ? () => { fields.remove(index); } : undefined;
              const val = info.input.value;
              return (
                <SourceOrCollectionChip object={val} onDelete={handleDelete} />
              );
            }}
          />
        ))}
      </Col>
    </Row>
  </div>
);
renderCollectionSelector.propTypes = {
  fields: React.PropTypes.object,
  meta: React.PropTypes.object,
  allowRemoval: React.PropTypes.bool,
  validate: React.PropTypes.func,
};

const SourceCollectionsForm = (props) => {
  const { initialValues, allowRemoval } = props;
  return (
    <div className="form-section explorer-source-collection-form">
      <FieldArray
        form={propTypes.form}
        name="collections"
        validate={propTypes.validate}
        allowRemoval={allowRemoval}
        component={renderCollectionSelector}
        initialValues={initialValues}
      />
    </div>
  );
};

SourceCollectionsForm.propTypes = {
  // from parent
  intl: React.PropTypes.object.isRequired,
  initialValues: React.PropTypes.object,
  allowRemoval: React.PropTypes.bool,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm({ propTypes })(
        SourceCollectionsForm
      )
    )
  );

