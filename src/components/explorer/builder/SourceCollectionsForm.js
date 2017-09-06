import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import composeIntlForm from '../../common/IntlForm';
import SourceOrCollectionWidget from '../../common/SourceOrCollectionWidget';

const renderCollectionSelector = ({ allowRemoval, fields }) => (
  <div>
    {fields.map((name, index) => (
      <Field
        key={name}
        name={name}
        component={(info) => {
          const handleDelete = (allowRemoval || info.meta.dirty) && fields.length > 1 ? () => { fields.remove(index); } : undefined;
          const val = info.input.value;
          let tempObj = {};
          if (val && typeof val === 'number') {
            tempObj.id = val;
          } else {
            tempObj = info.input.value;
          }
          return (
            <SourceOrCollectionWidget object={tempObj} onDelete={handleDelete} />
          );
        }}
      />
    ))}
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
    <div className="explorer-source-collection-form">
      <FieldArray
        form={propTypes.form}
        name="media"
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
  selected: React.PropTypes.object,
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

