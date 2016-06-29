import React from 'react';
import { Route } from 'react-router';
import TopicListContainer from '../components/topic/TopicListContainer';
import TopicContainer from '../components/topic/TopicContainer';
import TopicSummaryContainer from '../components/topic/summary/TopicSummaryContainer';
import TopicInfluentialMediaContainer from '../components/topic/media/TopicInfluentialMediaContainer';
import TopicInfluentialStoriesContainer from '../components/topic/stories/TopicInfluentialStoriesContainer';
import requireAuth from './routes.js';

const topicRoutes = (
  <Route path="/">
    <Route path="/home" component={TopicListContainer} onEnter={requireAuth} />
    <Route path="/topics/:topicId" component={TopicContainer} >
      <Route path="/topics/:topicId/summary" component={TopicSummaryContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/media" component={TopicInfluentialMediaContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/stories" component={TopicInfluentialStoriesContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default topicRoutes;
