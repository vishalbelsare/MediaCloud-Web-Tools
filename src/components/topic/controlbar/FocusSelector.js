import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import IconButton from 'material-ui/IconButton';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';
import FocusListItem from './FocusListItem';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { getBrandDarkColor } from '../../../styles/colors';
import { REMOVE_FOCUS } from './FocusSelectorContainer';

const localMessages = {
  pickFocus: { id: 'focus.pick', defaultMessage: 'Pick a Focus' },
  noFocus: { id: 'focus.none', defaultMessage: 'No Focus' },
  helpTitle: { id: 'focus.selector.help.title', defaultMessage: 'About Foci' },
  helpText: { id: 'focus.selector.help.text',
    defaultMessage: '<p>Foci let you slice and dice your Topic.</p>',
  },
};

class FocusSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  handlePopupOpenClick = (event) => {
    event.preventDefault();
    this.setState({
      isPopupOpen: !this.state.isPopupOpen,
      anchorEl: event.currentTarget,
    });
  }

  handlePopupRequestClose = () => {
    this.setState({
      isPopupOpen: false,
    });
  }

  handleFocusSelected = (focusId) => {
    this.handlePopupRequestClose();
    const { onFocusSelected } = this.props;
    onFocusSelected(focusId);
  }

  render() {
    const { foci, selectedId, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    const icon = (this.state.isPopupOpen) ? 'arrow_drop_up' : 'arrow_drop_down';
    // default to none
    const selected = foci.find(focus => (focus.foci_id === selectedId));
    const selectedSummary = (selected) ? selected.name : <FormattedMessage {...localMessages.pickFocus} />;
    return (
      <div className="focus-selector-wrapper">
        <div className="popup-selector focus-selector">
          <div className="label">
            {selectedSummary}
          </div>
          <IconButton
            iconClassName="material-icons"
            tooltip={formatMessage(localMessages.pickFocus)}
            onClick={this.handlePopupOpenClick}
            iconStyle={{ color: getBrandDarkColor() }}
          >
            {icon}
          </IconButton>
          <Popover
            open={this.state.isPopupOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            onRequestClose={this.handlePopupRequestClose}
            animation={PopoverAnimationVertical}
            className="popup-list"
          >
            {foci.map(focus =>
              <FocusListItem
                key={focus.foci_id}
                id={focus.foci_id}
                focus={focus}
                selected={focus.foci_id === selectedId}
                onSelected={() => { this.handleFocusSelected(focus.foci_id); }}
              />
            )}
            <FocusListItem
              key={REMOVE_FOCUS}
              id={REMOVE_FOCUS}
              focus={{ foci_id: REMOVE_FOCUS, name: formatMessage(localMessages.noFocus) }}
              selected={false}
              onSelected={() => { this.handleFocusSelected(focus.foci_id); }}
            />
          </Popover>
        </div>
        {helpButton}
      </div>
    );
  }

}

FocusSelector.propTypes = {
  foci: React.PropTypes.array.isRequired,
  selectedId: React.PropTypes.number,
  intl: React.PropTypes.object.isRequired,
  onFocusSelected: React.PropTypes.func,
  helpButton: React.PropTypes.node.isRequired,
};

export default
  injectIntl(
    composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
      FocusSelector
    )
  );
