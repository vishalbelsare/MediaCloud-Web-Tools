import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

const RecentNewsItem = props => (
  <div className="recent-news-item">
    <span className={`news-type news-${props.item.type.toLowerCase()}`}>{props.item.type}</span>
    {props.item.note}
    {props.includeDetails && (
      <span className="news-details">{props.item.details}</span>
    )}
  </div>
);

RecentNewsItem.propTypes = {
  // from parent
  item: PropTypes.object,
  includeDetails: PropTypes.boolean,
};

export default
  injectIntl(
    RecentNewsItem
  );
