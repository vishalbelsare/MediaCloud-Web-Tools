import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from './AsyncContainer';
import { fetchMetadataValuesForCountry, fetchMetadataValuesForState, fetchMetadataValuesForPrimaryLanguage, fetchMetadataValuesForCountryOfFocus, fetchMetadataValuesForMediaType } from '../../actions/sourceActions';
import composeIntlForm from './IntlForm';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS, TAG_SET_MEDIA_TYPE } from '../../lib/tagUtil';

const MODE_SELECT = 'MODE_SELECT';
const MODE_AUTOCOMPLETE = 'MODE_AUTOCOMPLETE';

const localMessages = {
  hintText: { id: 'metadata.pick.hint', defaultMessage: 'Pick a {label}' },
};

const MetadataPickerContainer = (props) => {
  const { label, name, tags, renderSelectField, renderAutoComplete, autocomplete, floatingLabelText, disabled, showDescription } = props;
  const { formatMessage } = props.intl;
  const mode = autocomplete ? MODE_AUTOCOMPLETE : MODE_SELECT;
  let content = null;
  switch (mode) {
    case MODE_SELECT:
      if (showDescription) {
        content = (
          <Field
            fullWidth name={name}
            component={renderSelectField}
            disabled={disabled}
            floatingLabelText={floatingLabelText || label}
          >
            <MenuItem value={null} primaryText={''} />
            {tags.map(t =>
              <MenuItem
                className="header-primary-menu"
                key={t.tags_id}
                value={t.tags_id}
                primaryText={
                  <div className="header-primary-label">{t.label}
                    <br /><span className="header-primary-description">{t.description}</span>
                  </div>
                }
              />
            )}
          </Field>
        );
      } else {
        content = (
          <Field
            fullWidth name={name}
            component={renderSelectField}
            disabled={disabled}
            floatingLabelText={floatingLabelText || label}
          >
            <MenuItem value={null} primaryText={''} />
            {tags.map(t => <MenuItem key={t.tags_id} value={t.tags_id} primaryText={t.label} />)}
          </Field>
        );
      }
      break;
    case MODE_AUTOCOMPLETE:
      // need to figure out autocomplete text to prepopulate here
      // commented out because the initialvalues are interfering with the display of the selected values
      /* let initialText = '';
      if ((initialValues) && (initialValues[name]) && (tags.length > 0)) {
        const matchingItem = tags.find(t => t.tags_id === initialValues[name]);
        if (matchingItem) {
          initialText = matchingItem.label;
        }
      }*/
      content = (
        <Field
          className="metadata-picker"
          // searchText={initialText}
          name={name}
          component={renderAutoComplete}
          hintText={formatMessage(localMessages.hintText, { label })}
          floatingLabelText={floatingLabelText || label}
          openOnFocus
          fullWidth
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
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.bool,
  showDescription: PropTypes.bool,
  floatingLabelText: PropTypes.string,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  renderSelectField: PropTypes.func.isRequired,
  renderAutoComplete: PropTypes.func.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string,
  tags: PropTypes.array,
  label: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  fetchStatus: state.system.metadata[ownProps.name].fetchStatus,
  label: state.system.metadata[ownProps.name].label,
  tags: state.system.metadata[ownProps.name].tags,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    switch (ownProps.id) {
      case TAG_SET_PUBLICATION_COUNTRY:
        dispatch(fetchMetadataValuesForCountry(ownProps.id));
        break;
      case TAG_SET_PUBLICATION_STATE:
        dispatch(fetchMetadataValuesForState(ownProps.id));
        break;
      case TAG_SET_PRIMARY_LANGUAGE:
        dispatch(fetchMetadataValuesForPrimaryLanguage(ownProps.id));
        break;
      case TAG_SET_COUNTRY_OF_FOCUS:
        dispatch(fetchMetadataValuesForCountryOfFocus(ownProps.id));
        break;
      case TAG_SET_MEDIA_TYPE:
        dispatch(fetchMetadataValuesForMediaType(ownProps.id));
        break;
      default:
        break;
    }
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
