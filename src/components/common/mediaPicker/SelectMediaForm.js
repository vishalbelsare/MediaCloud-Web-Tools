import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid/lib';
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

    const storedKeyword = initValues.storedKeyword;
    const instruction = initValues.type ? localMessages.pickCollections : localMessages.pickSources;
    if (storedKeyword.mediaKeyword === undefined || storedKeyword.mediaKeyword === null) {
      storedKeyword.mediaKeyword = '';
    }
    return (
      <Row>
        <Col lg={2} className="media-picker-type-instruction">
          <FormattedMessage {...instruction} />
        </Col>
        <Col lg={4}>
          <TextField
            name="mediaKeyword"
            defaultValue={storedKeyword.mediaKeyword}
            onKeyPress={this.handleMenuItemKeyDown}
            ref={this.focusUsernameInputField}
          />
        </Col>
        <Col lg={1}>
          <AppButton
            style={{ marginTop: 0 }}
            type="submit"
            label={formatMessage(localMessages.search)}
            disabled={submitting}
            onClick={this.handleMenuItemKeyDown}
            primary
          />
        </Col>
      </Row>
    );
  }
}


SelectMediaForm.propTypes = {
  intl: React.PropTypes.object.isRequired,
  onSearch: React.PropTypes.func,
  isEditable: React.PropTypes.bool,
  initValues: React.PropTypes.array,
  submitting: React.PropTypes.bool,
};

export default
  injectIntl(
    SelectMediaForm
  );

