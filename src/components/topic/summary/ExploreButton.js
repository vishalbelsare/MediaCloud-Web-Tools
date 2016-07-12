import React from 'react';
import IconButton from 'material-ui/IconButton';
import LinkWithFilters from '../LinkWithFilters';

class ExploreButton extends React.Component {
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { tooltip, to, style } = this.props;
    const styles = this.getStyles();
    return (
    <div style={styles.root}>
      <LinkWithFilters to={to} style={style}>
        <IconButton iconClassName="material-icons" tooltip={tooltip}>
          subdirectory_arrow_right
        </IconButton>
      </LinkWithFilters>
    </div>
    );
  }
}

ExploreButton.propTypes = {
  tooltip: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
};

export default ExploreButton;
