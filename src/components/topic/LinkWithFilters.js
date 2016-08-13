import React from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';

/**
 * Use to include filters in a topic-related link by default.  Treat this as a drop-in
 * replacement for the react-router Link tag.
 **/
const LinkWithFilters = (props) => {
  const { to, style, children, defaultFilters, filters } = props;
  const filtersToUse = ((filters !== undefined) && (filters !== null)) ? filters : defaultFilters;
  const linkLocation = {
    pathname: to,
    query: {
      snapshotId: filtersToUse.snapshotId,
      timespanId: filtersToUse.timespanId,
      focusId: filtersToUse.focusId,
    },
  };
  return (
    <Link to={linkLocation} style={style}>{children}</Link>
  );
};

LinkWithFilters.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
  to: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
  filters: React.PropTypes.object,  // use this to override
  // from state
  defaultFilters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  defaultFilters: state.topics.selected.filters,
});

export default connect(
  mapStateToProps,
  null
)(LinkWithFilters);
