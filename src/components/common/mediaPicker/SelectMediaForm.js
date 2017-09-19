import React from 'react';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
// import MetadataPickerContainer from '../../../common/MetadataPickerContainer';
// import AppButton from '../../../common/AppButton';
// import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE } from '../../../../lib/tagUtil';

class SelectMediaForm extends React.Component {
  shouldComponentUpdate = () => false;

  focusUsernameInputField = (input) => {
    if (input) {
      setTimeout(() => { input.focus(); }, 100);
    }
  }
  handleMenuItemKeyDown = (evt) => {
    const { onSearch } = this.props;
    switch (evt.key) {
      case 'Enter':
        onSearch({ mediaKeyword: evt.target.value });
        evt.preventDefault();
        break;
      default: break;
    }
  };

  render() {
    const { initValues } = this.props;

    const cleanedInitialValues = initValues ? { ...initValues } : {};
    if (cleanedInitialValues.mediaKeyword === undefined || cleanedInitialValues.mediaKeyword === null) {
      cleanedInitialValues.mediaKeyword = '';
    }
    return (
      <TextField
        name="mediaKeyword"
        defaultValue={cleanedInitialValues.mediaKeyword}
        onKeyPress={this.handleMenuItemKeyDown}
        ref={this.focusUsernameInputField}
      />
    );
  }
}


SelectMediaForm.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onSearch: React.PropTypes.func,
  isEditable: React.PropTypes.bool,
  initValues: React.PropTypes.object,
};

export default
  injectIntl(
    SelectMediaForm
  );

