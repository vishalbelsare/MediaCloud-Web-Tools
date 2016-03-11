import React from 'react';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {connect} from 'react-redux';
//import Divider from 'material-ui/lib/divider';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
import {Spacing, Typography} from 'material-ui/lib/styles';
import zIndex from 'material-ui/lib/styles/zIndex';
import {purple500} from 'material-ui/lib/styles/colors';
import leftNavVisibility from './actions';

const SelectableList = SelectableContainerEnhance(List);

const AppLeftNav = React.createClass({

  propTypes: {
    location: React.PropTypes.object.isRequired,
    docked: React.PropTypes.bool.isRequired,
    onRequestChangeLeftNav: React.PropTypes.func,
    onRequestChangeList: React.PropTypes.func.isRequired,
    open: React.PropTypes.bool,
    style: React.PropTypes.object
  },

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
  },

  onHeaderTouchTap() {
    this.context.router.push('/');
    this.props.onRequestChangeLeftNav(false);
  },

  styles: {
    logo: {
      cursor: 'pointer',
      fontSize: 24,
      color: Typography.textFullWhite,
      lineHeight: `${Spacing.desktopKeylineIncrement}px`,
      fontWeight: Typography.fontWeightLight,
      backgroundColor: purple500,
      paddingLeft: Spacing.desktopGutter,
      marginBottom: 8
    }
  },

  render() {
    const {
      location,
      docked,
      onRequestChangeLeftNav,
      onRequestChangeList,
      open,
      style
    } = this.props;

    return (
      <LeftNav
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeLeftNav}
        containerStyle={{zIndex: zIndex.leftNav - 100}}
      >
        <div style={this.styles.logo} onTouchTap={this.onHeaderTouchTap}>
          Options
        </div>

        <SelectableList 
          valueLink={{value: location.pathname, requestChange: onRequestChangeList}}
          subheader="Meta"
        >
          <ListItem primaryText="About" value="/about" />
        </SelectableList>
      </LeftNav>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    open: state.leftNavVisibility
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRequestChangeLeftNav: (open) => {
      dispatch(leftNavVisibility(open));
    }
  };
};

const ControllableAppLeftNav = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLeftNav);

export default ControllableAppLeftNav;