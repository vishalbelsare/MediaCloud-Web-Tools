import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import composeIntlForm from '../../common/IntlForm';
import SourceOrCollectionWidget from '../../common/SourceOrCollectionWidget';

const renderCollectionSelector = ({ allowRemoval, fields, onDelete }) => (
  <div>
    {fields.map((name, index) => (
      <Field
        key={name}
        name={name}
        component={(info) => {
          const handleDelete = (allowRemoval || info.meta.dirty) && fields.length > 1 ? () => { fields.remove(index); onDelete(info.input.value); } : undefined;
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
  onDelete: React.PropTypes.func,
};

const SourceCollectionsForm = (props) => {
  const { initialValues, allowRemoval, onDelete } = props;
  return (
    <div className="explorer-source-collection-form">
      <FieldArray
        form={propTypes.form}
        name="media"
        validate={propTypes.validate}
        allowRemoval={allowRemoval}
        component={renderCollectionSelector}
        initialValues={initialValues}
        onDelete={onDelete} // call back up to update the selected media array and hence sources and collections
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
  onDelete: React.PropTypes.func,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm({ propTypes })(
        SourceCollectionsForm
      )
    )
  );

