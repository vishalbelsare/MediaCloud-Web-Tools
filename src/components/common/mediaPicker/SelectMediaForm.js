import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import AppButton from '../../common/AppButton';

const localMessages = {
  pickCollections: { id: 'system.mediaPicker.select.pickCollections', defaultMessage: 'Pick A Collection' },
  pickSources: { id: 'system.mediaPicker.select.pickSources', defaultMessage: 'Pick A Source' },
  search: { id: 'system.mediaPicker.select.search', defaultMessage: 'Search' },
};

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
    const { initValues, submitting } = this.props;
    const { formatMessage } = this.props.intl;

    const cleanedInitialValues = initValues ? { ...initValues } : {};
    const instruction = initValues ? localMessages.pickCollections : localMessages.pickSources;
    if (cleanedInitialValues.mediaKeyword === undefined || cleanedInitialValues.mediaKeyword === null) {
      cleanedInitialValues.mediaKeyword = '';
    }
    return (
      <div>
        <FormattedMessage {...instruction} />
        <TextField
          name="mediaKeyword"
          defaultValue={cleanedInitialValues.mediaKeyword}
          onKeyPress={this.handleMenuItemKeyDown}
          ref={this.focusUsernameInputField}
        />
        <AppButton
          style={{ marginTop: 30 }}
          type="submit"
          label={formatMessage(localMessages.search)}
          disabled={submitting}
          onClick={this.handleMenuItemKeyDown}
          primary
        />
      </div>
    );
  }
}


SelectMediaForm.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onSearch: React.PropTypes.func,
  isEditable: React.PropTypes.bool,
  initValues: React.PropTypes.object,
  submitting: React.PropTypes.bool,
};

export default
  injectIntl(
    SelectMediaForm
  );

