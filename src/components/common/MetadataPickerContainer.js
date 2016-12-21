import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from './AsyncContainer';
import { fetchMetadataValues } from '../../actions/sourceActions';
import composeIntlForm from './IntlForm';

const MetadataPickerContainer = (props) => {
  const { label, name, tags, renderSelectField } = props;
  return (
    <div>
      <Field name={name} component={renderSelectField} floatingLabelText={label}>
        <MenuItem value={null} primaryText={''} />
        {tags.map(t => <MenuItem key={t.tags_id} value={t.tags_id} primaryText={t.label} />)}
      </Field>
    </div>
  );
};

MetadataPickerContainer.propTypes = {
  // from parent
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string,
  tags: React.PropTypes.array,
  label: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.metadata[ownProps.name].fetchStatus,
  label: state.metadata[ownProps.name].label,
  tags: state.metadata[ownProps.name].tags,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchMetadataValues(ownProps.id));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeIntlForm(
        reduxForm()(
          composeAsyncContainer(
            MetadataPickerContainer
          )
        )
      )
    )
  );
