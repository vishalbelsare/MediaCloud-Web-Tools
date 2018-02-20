import PropTypes from 'prop-types';
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
          const handleDelete = (allowRemoval || info.meta.dirty) && fields.length > 0 ? () => { fields.remove(index); onDelete(info.input.value); } : undefined;
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

const SourceCollectionsFieldList = (props) => {
  const { initialValues, allowRemoval, onDelete } = props;
  return (
    <div className="explorer-source-collection-form">
      <FieldArray
        form={propTypes.form}
        name="media"
        validate={propTypes.validate}
        warn={propTypes.warn}
        allowRemoval={allowRemoval}
        component={renderCollectionSelector}
        initialValues={initialValues}
        onDelete={onDelete} // call back up to update the selected media array and hence sources and collections
      />
    </div>
  );
};

SourceCollectionsFieldList.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  selected: PropTypes.object,
  allowRemoval: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm({ propTypes })(
        SourceCollectionsFieldList
      )
    )
  );

