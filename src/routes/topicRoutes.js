import React from 'react';
import Route from 'react-router/lib/Route';
import TopicListContainer from '../components/topic/TopicListContainer';
import TopicContainer from '../components/topic/TopicContainer';
import TopicSummaryContainer from '../components/topic/summary/TopicSummaryContainer';
import InfluentialMediaContainer from '../components/topic/media/InfluentialMediaContainer';
import InfluentialStoriesContainer from '../components/topic/stories/InfluentialStoriesContainer';
import StoryContainer from '../components/topic/stories/StoryContainer';
import MediaContainer from '../components/topic/media/MediaContainer';
import requireAuth from './routes.js';

const topicRoutes = (
  <Route path="/">
    <Route path="/home" component={TopicListContainer} onEnter={requireAuth} />
    <Route path="/topics/:topicId" component={TopicContainer} onEnter={requireAuth} >
      <Route path="/topics/:topicId/summary" component={TopicSummaryContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/media" component={InfluentialMediaContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/media/:mediaId" component={MediaContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/stories" component={InfluentialStoriesContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/stories/:storiesId" component={StoryContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default topicRoutes;
