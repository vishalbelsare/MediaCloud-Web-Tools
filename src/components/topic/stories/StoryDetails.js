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
        <li>Bit.ly: {story.process_with_bitly}</li>
      </ul>
    </DataCard>
  );
};

StoryDetails.propTypes = {
  story: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(StoryDetails);
