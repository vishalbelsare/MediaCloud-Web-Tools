import React from 'react';
import { injectIntl } from 'react-intl';
import { reduxForm } from 'redux-form';
import Collapsible from 'react-collapsible';
import composeIntlForm from '../../../common/IntlForm';
import MetadataPickerContainer from '../../../common/MetadataPickerContainer';
// import AppButton from '../../../common/AppButton';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE } from '../../../../lib/tagUtil';


const localMessages = {
  searchByName: { id: 'explorer.media.select.searchby.name', defaultMessage: 'Search by Name/URL' },
  searchByMetadata: { id: 'explorer.media.select.searchby.metadata', defaultMessage: 'Search by Metadata' },
  selectedMedia: { id: 'explorer.media.select.media', defaultMessage: 'Selected Media' },
  pubCountrySuggestion: { id: 'explorer.media.select.pubCountryTip', defaultMessage: 'published in' },
  pubStateSuggestion: { id: 'explorer.media.select.pubStateTip', defaultMessage: 'state published in' },
  pLanguageSuggestion: { id: 'explorer.media.select.pLanguageTip', defaultMessage: 'primary language' },
};

const SelectMediaForm = (props) => {
  const { handleSubmit, onSearch } = props;
  const { formatMessage } = props.intl;
  return (
    <form className="select-media-container" onSubmit={handleSubmit(onSearch.bind(this))}>
      <Collapsible trigger={formatMessage(localMessages.searchByName)}>
        <p>enter name or url</p>
        <p>here</p>
      </Collapsible>
      <Collapsible trigger={formatMessage(localMessages.searchByMetadata)}>
        <MetadataPickerContainer
          id={TAG_SET_PUBLICATION_COUNTRY}
          name={'publicationCountry'}
          form="selectMediaForm"
          floatingLabelText={formatMessage(localMessages.pubCountrySuggestion)}
          autocomplete
        />
        <MetadataPickerContainer
          id={TAG_SET_PUBLICATION_STATE}
          name={'publicationState'}
          form="selectMediaForm"
          floatingLabelText={formatMessage(localMessages.pubStateSuggestion)}
          autocomplete
        />
        <MetadataPickerContainer
          id={TAG_SET_PRIMARY_LANGUAGE}
          name={'primaryLanguage'}
          form="selectMediaForm"
          floatingLabelText={formatMessage(localMessages.pLanguageSuggestion)}
          autocomplete
        />
      </Collapsible>
    </form>
  );
};


SelectMediaForm.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onSearch: React.PropTypes.func,
  isEditable: React.PropTypes.bool,
  initialValues: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'selectMediaForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        SelectMediaForm
      )
    )
  );

