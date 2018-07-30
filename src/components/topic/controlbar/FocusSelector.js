import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { REMOVE_FOCUS } from './TopicFilterControlBar';
import { getBrandDarkerColor } from '../../../styles/colors';
import messages from '../../../resources/messages';

const localMessages = {
};

class FocusSelector extends React.Component {

  handleFocusChange = (evt, index, value) => {
    const { foci, onFocusSelected } = this.props;
    const { formatMessage } = this.props.intl;
    let selected;
    if (value === REMOVE_FOCUS) {
      selected = { foci_id: REMOVE_FOCUS, name: formatMessage(localMessages.noFocus) };
    } else {
      selected = foci.find(focus => (focus.foci_id === value));
    }
    onFocusSelected(selected);
  }

  render() {
    const { foci, selectedId } = this.props;
    const { formatMessage } = this.props.intl;
    const focusName = focus => `${focus.focalSet.name}: ${focus.name}`;
    foci.sort((f1, f2) => { // alphabetical
      const f1Name = focusName(f1).toUpperCase();
      const f2Name = focusName(f2).toUpperCase();
      if (f1Name < f2Name) return -1;
      if (f1Name > f2Name) return 1;
      return 0;
    });
    let detailsContent;
    /* if ((selectedId) && (selectedId !== REMOVE_FOCUS)) {
      detailsContent = (
        <div className="selected-focus-details">
          details
        </div>
      );
    }*/
    // default to none
    return (
      <div className="focus-selector-wrapper">
        <Select
          floatingLabelText={formatMessage(messages.focusPick)}
          floatingLabelFixed
          floatingLabelStyle={{ color: 'rgb(224,224,224)', opacity: 0.8 }}
          selectedMenuItemStyle={{ color: getBrandDarkerColor(), fontWeight: 'bold' }}
          labelStyle={{ color: 'rgb(255,255,255)' }}
          value={selectedId}
          fullWidth
          onChange={this.handleFocusChange}
        >
          {foci.map(focus =>
            <MenuItem
              key={focus.foci_id}
              value={focus.foci_id}
              primaryText={focusName(focus)}
            />
          )}
          <MenuItem value={REMOVE_FOCUS} primaryText={formatMessage(messages.removeFocus)} />
        </Select>
        {detailsContent}
      </div>
    );
  }

}

FocusSelector.propTypes = {
  foci: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  intl: PropTypes.object.isRequired,
  onFocusSelected: PropTypes.func,
};

export default
  injectIntl(
    FocusSelector
  );
