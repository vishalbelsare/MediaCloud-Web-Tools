import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import { FormattedMessage } from 'react-intl';

const localMessages = {
  about: { id: 'media.about', defaultMessage: 'About the {name}' },
};

const MediaDetails = (props) => {
  const { media } = props;
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.about} values={{ name: media.name }} />
      </h2>
      <ul>
        <li><a href={media.url}>{media.url}</a></li>
        <li>outlink: {media.outlink_count}</li>
        <li>inlinks: {media.inlink_count}</li>
        <li>media inlinks: {media.media_inlink_count}</li>
        <li>sum media inlinks: {media.sum_media_inlink_count}</li>
        <li>bit.ly: {media.bitly_click_count}</li>
      </ul>
    </DataCard>
  );
};

MediaDetails.propTypes = {
  media: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(MediaDetails);
