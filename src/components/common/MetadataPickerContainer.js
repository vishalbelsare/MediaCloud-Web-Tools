import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from './AsyncContainer';
import { fetchMetadataValues } from '../../actions/sourceActions';
import composeIntlForm from './IntlForm';

const MODE_SELECT = 'MODE_SELECT';
const MODE_AUTOCOMPLETE = 'MODE_AUTOCOMPLETE';

const localMessages = {
  hintText: { id: 'metadata.pick.hint', defaultMessage: 'Pick a {label}' },
};

const MetadataPickerContainer = (props) => {
  const { label, name, tags, renderSelectField, renderAutoComplete, autocomplete, initialValues, floatingLabelText } = props;
  const { formatMessage } = props.intl;
  const mode = autocomplete ? MODE_AUTOCOMPLETE : MODE_SELECT;
  let content = null;
  switch (mode) {
    case MODE_SELECT:
      content = (
        <Field name={name} component={renderSelectField} floatingLabelText={floatingLabelText || label}>
          <MenuItem value={null} primaryText={''} />
          {tags.map(t => <MenuItem key={t.tags_id} value={t.tags_id} primaryText={t.label} />)}
        </Field>
      );
      break;
    case MODE_AUTOCOMPLETE:
      // need to figure out autocomplete text to prepopulate here
      let initialText = '';
      if ((initialValues) && (initialValues[name]) && (tags.length > 0)) {
        const matchingItem = tags.find(t => t.tags_id === initialValues[name]);
        if (matchingItem) {
          initialText = matchingItem.label;
        }
      }
      content = (
        <Field
          searchText={initialText}
          name={name}
          component={renderAutoComplete}
          hintText={formatMessage(localMessages.hintText, { label })}
          floatingLabelText={floatingLabelText || label}
          openOnFocus
          dataSource={tags}
          dataSourceConfig={{ text: 'label', value: 'tags_id' }}
          maxSearchResults={10}
        />
      );
      break;
    default:
      content = '';
      break;
  }
  return (<div className={`metadata-picker-${name}`}>{content}</div>);
};

MetadataPickerContainer.propTypes = {
  // from parent
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  initialValues: React.PropTypes.object,
  autocomplete: React.PropTypes.bool,
  floatingLabelText: React.PropTypes.string,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  renderSelectField: React.PropTypes.func.isRequired,
  renderAutoComplete: React.PropTypes.func.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string,
  tags: React.PropTypes.array,
  label: React.PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.system.metadata[ownProps.name].fetchStatus,
  label: state.system.metadata[ownProps.name].label,
  tags: state.system.metadata[ownProps.name].tags,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchMetadataValues(ownProps.id));
  },
});

export default
  connect(mapStateToProps, mapDispatchToProps)(
    composeIntlForm(
      composeAsyncContainer(
        MetadataPickerContainer
      )
    )
  );
