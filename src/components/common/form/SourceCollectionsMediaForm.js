import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import withIntlForm from '../hocs/IntlForm';
import SourceOrCollectionWidget from '../SourceOrCollectionWidget';

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
  fields: PropTypes.object,
  meta: PropTypes.object,
  allowRemoval: PropTypes.bool,
  validate: PropTypes.func,
  onDelete: PropTypes.func,
};

const SourceCollectionsMediaForm = (props) => {
  const { name, initialValues, allowRemoval, onDelete } = props;
  return (
    <div className="explorer-source-collection-form">
      <FieldArray
        form={propTypes.form}
        name={name}
        validate={propTypes.validate}
        allowRemoval={allowRemoval}
        component={renderCollectionSelector}
        initialValues={initialValues}
        onDelete={onDelete} // call back up to update the selected media array and hence sources and collections
      />
    </div>
  );
};

SourceCollectionsMediaForm.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.array,
  selected: PropTypes.object,
  allowRemoval: PropTypes.bool,
  name: PropTypes.string,
  onDelete: PropTypes.func,
};

export default
injectIntl(
  withIntlForm(
    reduxForm({ propTypes })(
      SourceCollectionsMediaForm
    )
  )
);
