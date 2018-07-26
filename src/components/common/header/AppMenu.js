import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import { ArrowDropDownButton, ArrowDropUpButton } from '../IconButton';

class AppMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, iconDown: true };
  }

  whichArrowIcon = () => {
    if (this.state.iconDown) {
      return <ArrowDropDownButton color="#FFFFFF" />;
    }
    return <ArrowDropUpButton color="#FFFFFF" />;
  };

  toggleMenu = (event) => {
    this.setState(prevState => ({
      open: !prevState.open,
      anchorEl: event.currentTarget,
      iconDown: !prevState.iconDown,
    }));
  };

  close = () => this.setState({ open: false, iconDown: true });

  // ES6
  flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? this.flatten(b) : b), []
  );

  render() {
    const { titleMsg, showMenu, onTitleClick, menuComponent } = this.props;
    const { formatMessage } = this.props.intl;
    // const closeFxn = this.close;
    let newItems;
    if (menuComponent && menuComponent.props) {
      const flattenedMenu = this.flatten(menuComponent.props.children);
      newItems = flattenedMenu.map(m => ({ // for each MenuItem, update the onClick event
        ...m,
        props: {
          ...m.props,
          onClick: () => {
            this.setState({ open: false, iconDown: true });
            m.props.onClick();
          },
        },
      }));
    }
    // let titleButtonClickHandler;
    let menuHeader = (
      <FlatButton
        onClick={event => onTitleClick(event)}
        label={formatMessage(titleMsg)}
      />
    );
    if (showMenu) {
      const whichIcon = this.whichArrowIcon();
      menuHeader = (
        <FlatButton
          onClick={this.toggleMenu}
          label={formatMessage(titleMsg)}
          icon={whichIcon}
        />
      );
    }
    return (
      <div className="app-menu">
        {menuHeader}
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.close}
        >
          {newItems}
        </Popover>
      </div>
    );
  }
}

AppMenu.propTypes = {
  // parent
  titleMsg: PropTypes.object.isRequired,
  showMenu: PropTypes.bool,
  onTitleClick: PropTypes.func.isRequired,
  menuComponent: PropTypes.object,
  // from dispatch
  children: PropTypes.node,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  AppMenu
);
