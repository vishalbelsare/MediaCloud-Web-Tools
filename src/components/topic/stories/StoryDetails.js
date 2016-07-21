import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const StoryDetails = (props) => {
  const { story } = props;
  return (
    <DataCard>
      <h2>Details</h2>
      <ul>
        <li>{story.publish_date}</li>
        <li><a href={story.url}>{story.url}</a></li>
        <li>Media Id: {story.media_id}</li>
        <li>Inlinks: {story.inlink_count}</li>
        <li>Media Inlinks: {story.media_inlink_count}</li>
        <li>Bit.ly: {story.bitly_click_count}</li>
        <li>Facebook: {story.facebook_share_count}</li>
        <li>Language: {story.language}</li>
      </ul>
    </DataCard>
  );
};

StoryDetails.propTypes = {
  story: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(StoryDetails);
