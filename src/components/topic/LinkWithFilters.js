import React from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { filteredLinkTo } from '../util/location';

/**
 * Use to include filters in a topic-related link by default.  Treat this as a drop-in
 * replacement for the react-router Link tag.
 **/
const LinkWithFilters = (props) => {
  const { to, style, children, existingFilters, filters } = props;
  let updatedFilters;
  if (filters) {
    updatedFilters = { ...existingFilters, ...filters };
  } else {
    updatedFilters = existingFilters;
  }
  const linkLocation = filteredLinkTo(to, updatedFilters);
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
  existingFilters: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  existingFilters: state.topics.selected.filters,
});

export default
  connect(mapStateToProps)(
    LinkWithFilters
  );
