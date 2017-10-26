import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';

const localMessages = {
  pickCollections: { id: 'system.mediaPicker.select.pickCollections', defaultMessage: 'Search For Collections' },
  pickSources: { id: 'system.mediaPicker.select.pickSources', defaultMessage: 'Search For Sources' },
  search: { id: 'system.mediaPicker.select.search', defaultMessage: 'Search' },
};

// const formSelector = formValueSelector('queryForm');

class MediaPickerSearchForm extends React.Component {

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
        evt.preventDefault(); // don't type the enter into the field
        onSearch({ mediaKeyword: evt.target.value });
        break;
      default: break;
    }
  };

  handleSearchButtonClick = (evt) => {
    const { onSearch } = this.props;
    evt.preventDefault();
    const searchStr = document.getElementsByTagName('input')[0].value;  // note: this is a brittle hack
    onSearch({ mediaKeyword: searchStr });
  }

  render() {
    const { initValues, hintText } = this.props;
    const { formatMessage } = this.props.intl;

    const storedKeyword = initValues.storedKeyword;
    if (storedKeyword.mediaKeyword === undefined || storedKeyword.mediaKeyword === null) {
      storedKeyword.mediaKeyword = '';
    }
    return (
      <Row>
        <Col lg={6}>
          <TextField
            name="mediaKeyword"
            defaultValue={storedKeyword.mediaKeyword}
            onKeyPress={this.handleMenuItemKeyDown}
            ref={this.focusUsernameInputField}
            fullWidth
            hintText={hintText}
          />
        </Col>
        <Col lg={2}>
          <AppButton
            style={{ marginTop: 10 }}
            label={formatMessage(localMessages.search)}
            onClick={this.handleSearchButtonClick}
            primary
          />
        </Col>
      </Row>
    );
  }
}

MediaPickerSearchForm.propTypes = {
  intl: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  isEditable: PropTypes.bool,
  initValues: PropTypes.array,
  submitting: PropTypes.bool,
  hintText: PropTypes.string,
};

export default
  injectIntl(
    MediaPickerSearchForm
  );

