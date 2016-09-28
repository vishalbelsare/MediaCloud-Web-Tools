import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import HomeContainer from '../components/topic/HomeContainer';
import TopicContainer from '../components/topic/TopicContainer';
import FilteredTopicContainer from '../components/topic/FilteredTopicContainer';
import TopicSummaryContainer from '../components/topic/summary/TopicSummaryContainer';
import InfluentialMediaContainer from '../components/topic/media/InfluentialMediaContainer';
import InfluentialStoriesContainer from '../components/topic/stories/InfluentialStoriesContainer';
import StoryContainer from '../components/topic/stories/StoryContainer';
import MediaContainer from '../components/topic/media/MediaContainer';
import CreateFocusContainer from '../components/topic/foci/create/CreateFocusContainer';
import ManageFocalSetsContainer from '../components/topic/foci/ManageFocalSetsContainer';
import { requireAuth } from './routes.js';
import userRoutes from './userRoutes';
import TopicsApp from '../components/topic/TopicsApp';
import About from '../components/topic/About';
import CreateTopicContainer from '../components/topic/create/CreateTopicContainer';
import AttentionContainer from '../components/topic/attention/AttentionContainer';
import TopicSettingsContainer from '../components/topic/settings/TopicSettingsContainer';

const topicRoutes = (
  <Route path="/" component={TopicsApp}>

    <IndexRedirect to="/home" />

    <Route path="/about" component={About} />

    <Route path="/home" component={HomeContainer} onEnter={requireAuth} />

    <Route path="/topics/create" component={CreateTopicContainer} onEnter={requireAuth} />

    {userRoutes}

    <Route path="/topics/:topicId" component={TopicContainer} onEnter={requireAuth} >

      <Route path="/topics/:topicId/test-filters" component={FilteredTopicContainer} onEnter={requireAuth} >
        <Route path="/topics/:topicId/summary" component={TopicSummaryContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/media" component={InfluentialMediaContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/media/:mediaId" component={MediaContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/stories" component={InfluentialStoriesContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/stories/:storiesId" component={StoryContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/attention" component={AttentionContainer} onEnter={requireAuth} />
      </Route>

      <Route path="/topics/:topicId/foci/create" component={CreateFocusContainer} />
      <Route path="/topics/:topicId/foci/manage" component={ManageFocalSetsContainer} />

      <Route path="/topics/:topicId/settings" component={TopicSettingsContainer} />

    </Route>

  </Route>

);

export default topicRoutes;
