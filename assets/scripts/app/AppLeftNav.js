import React from 'react';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import { connect } from 'react-redux';
// import Divider from 'material-ui/lib/divider';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';
import { Spacing, Typography } from 'material-ui/lib/styles';
import zIndex from 'material-ui/lib/styles/zIndex';
import { purple400 } from 'material-ui/lib/styles/colors';
import { openLeftNav } from './appActions';
import { FormattedMessage, injectIntl } from 'react-intl';

const messages = {
  menuMeta: { id: 'menu.meta', defaultMessage: 'Meta' },
  appTitle: { id: 'app.title', defaultMessage: 'MediaMeter' },
  menuControversies: { id: 'menu.controversies', defaultMessage: 'All Topics' },
};

const SelectableList = SelectableContainerEnhance(List);

const AppLeftNav = React.createClass({

  propTypes: {
    location: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    onRequestChangeLeftNav: React.PropTypes.func,
    onRequestChangeList: React.PropTypes.func.isRequired,
    open: React.PropTypes.bool.isRequired,
    docked: React.PropTypes.bool.isRequired,
    style: React.PropTypes.object,
    intl: React.PropTypes.object.isRequired,
  },

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
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
      backgroundColor: purple400,
      paddingLeft: Spacing.desktopGutter,
      marginBottom: 8,
    },
  },

  render() {
    const {
      location,
      docked,
      onRequestChangeLeftNav,
      onRequestChangeList,
      open,
      style,
    } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <LeftNav
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeLeftNav}
        containerStyle={{ zIndex: zIndex.leftNav - 100 }}
      >
        <div style={this.styles.logo} onTouchTap={this.onHeaderTouchTap}>
          <FormattedMessage {...messages.appTitle} />
        </div>

        <SelectableList
          valueLink={{ value: location.pathname, requestChange: onRequestChangeList }}
          subheader={formatMessage(messages.menuMeta)}
        >
          <ListItem primaryText={formatMessage(messages.menuControversies)} value="controversies" />
        </SelectableList>
      </LeftNav>
    );
  },
});

const mapStateToProps = (state) => ({
  open: state.app.leftNav.open,
  docked: state.app.leftNav.docked,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  onRequestChangeLeftNav: (open) => {
    dispatch(openLeftNav(open));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLeftNav));
