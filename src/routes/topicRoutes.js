import React from 'react';
import { Route } from 'react-router';
import TopicListContainer from '../components/topic/TopicListContainer';
import TopicSummaryContainer from '../components/topic/summary/TopicSummaryContainer';
import requireAuth from './routes.js';

const topicRoutes = (
  <Route path="/topics">
    <Route path="/home" component={TopicListContainer} onEnter={requireAuth} />
    <Route path="/topics/:topicId" component={TopicSummaryContainer} onEnter={requireAuth} />
  </Route>
);

export default topicRoutes;
