import React from 'react';
import langs from 'langs';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import LinkWithFilters from '../LinkWithFilters';

const localMessages = {
  title: { id: 'story.details.title',
    defaultMessage: 'Basic Info',
  },
  meta: { id: 'story.details.meta', defaultMessage: 'It was published in {language}, on {publishDate}, by {source}.' },
  readItNow: { id: 'story.details.otherInfo', defaultMessage: 'Read it now.' },
};

const StoryDetails = (props) => {
  const { topicId, story } = props;
  const { formatDate } = props.intl;
  console.log(langs.all());
  console.log(story.language);
  console.log(langs.where('2', story.language));
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p>
        <FormattedMessage
          {...localMessages.meta}
          values={{
            language: story.language,
            source: (
              <LinkWithFilters to={`/topics/${topicId}/media/${story.media_id}`}>
                {story.media_name}
              </LinkWithFilters>
            ),
            publishDate: formatDate(story.publishDateObj,
              { year: '2-digit', month: 'numeric', day: 'numeric' }),
          }}
        />
        &nbsp;
        <a href={story.url}><FormattedMessage {...localMessages.readItNow} /></a>
      </p>
    </DataCard>
  );
};

StoryDetails.propTypes = {
  // from parent
  topicId: React.PropTypes.number.isRequired,
  story: React.PropTypes.object.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(StoryDetails);
