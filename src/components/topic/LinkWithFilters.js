import React from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';

/**
 * Use to include filters in a topic-related link by default.  Treat this as a drop-in
 * replacement for the react-router Link tag.
 **/
const LinkWithFilters = (props) => {
  const { to, style, children, filters } = props;
  const linkLocation = {
    pathname: to,
    query: {
      snapshotId: filters.snapshotId,
      timespanId: filters.timespanId,
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
  // from state
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  filters: state.topics.selected.filters,
});

export default connect(
  mapStateToProps,
  null
)(LinkWithFilters);
