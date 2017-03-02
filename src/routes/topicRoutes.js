import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import IndexRoute from 'react-router/lib/IndexRoute';
import HomeContainer from '../components/topic/HomeContainer';
import PublicHomeContainer from '../components/topic/PublicHomeContainer';
import TopicContainer from '../components/topic/TopicContainer';
import FilteredTopicContainer from '../components/topic/FilteredTopicContainer';
import TopicSummaryContainer from '../components/topic/summary/TopicSummaryContainer';
import PublicTopicSummaryContainer from '../components/topic/summary/PublicTopicSummaryContainer';
import InfluentialMediaContainer from '../components/topic/media/InfluentialMediaContainer';
import InfluentialStoriesContainer from '../components/topic/stories/InfluentialStoriesContainer';
import InfluentialStoryExplorerContainer from '../components/topic/stories/InfluentialStoryExplorerContainer';
import StoryContainer from '../components/topic/stories/StoryContainer';
import MediaContainer from '../components/topic/media/MediaContainer';
import CreateFocusContainer from '../components/topic/snapshots/foci/CreateFocusContainer';
import EditFocusContainer from '../components/topic/snapshots/foci/EditFocusContainer';
import ManageFocalSetsContainer from '../components/topic/snapshots/foci/ManageFocalSetsContainer';
import { requireAuth, redirectHomeIfLoggedIn } from './routes';
import userRoutes from './userRoutes';
import TopicsApp from '../components/topic/TopicsApp';
import About from '../components/topic/About';
import CreateTopicContainer from '../components/topic/create/CreateTopicContainer';
import SuggestTopicContainer from '../components/topic/create/SuggestTopicContainer';
import EditTopicContainer from '../components/topic/create/EditTopicContainer';
import AttentionContainer from '../components/topic/attention/AttentionContainer';
import WordContainer from '../components/topic/words/WordContainer';
import TopicSettingsContainer from '../components/topic/settings/TopicSettingsContainer';
import SnapshotBuilder from '../components/topic/snapshots/SnapshotBuilder';
import SnapshotHome from '../components/topic/snapshots/SnapshotHome';
import ManageTimespansContainer from '../components/topic/snapshots/timespans/ManageTimespansContainer';
import InfluentialWordsContainer from '../components/topic/words/InfluentialWordsContainer';

const topicRoutes = (
  <Route path="/" component={TopicsApp}>

    <IndexRedirect to="/topics/public/home" />

    <Route path="/about" component={About} />

    <Route path="/home" component={HomeContainer} onEnter={requireAuth} />

    <Route path="/topics/create" component={CreateTopicContainer} onEnter={requireAuth} />

    <Route path="/topics/suggest" component={SuggestTopicContainer} onEnter={requireAuth} />

    {userRoutes}

    <Route path="/topics/:topicId" component={TopicContainer} onEnter={requireAuth} >
      <Route path="edit" component={EditTopicContainer} onEnter={requireAuth} />
      <Route path="/topics/:topicId/test-filters" component={FilteredTopicContainer} onEnter={requireAuth} >
        <Route path="/topics/:topicId/summary" component={TopicSummaryContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/media" component={InfluentialMediaContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/media/:mediaId" component={MediaContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/stories" component={InfluentialStoriesContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/stories/explore" component={InfluentialStoryExplorerContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/stories/:storiesId" component={StoryContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/attention" component={AttentionContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/words" component={InfluentialWordsContainer} onEnter={requireAuth} />
        <Route path="/topics/:topicId/words/:word" component={WordContainer} onEnter={requireAuth} />
      </Route>

      <Route path="/topics/:topicId/snapshot" component={SnapshotBuilder} >
        <IndexRoute component={SnapshotHome} />
        <Route path="/topics/:topicId/snapshot/foci" component={ManageFocalSetsContainer} />
        <Route path="/topics/:topicId/snapshot/foci/create" component={CreateFocusContainer} />
        <Route path="/topics/:topicId/snapshot/foci/:focusDefId/edit" component={EditFocusContainer} />
        <Route path="/topics/:topicId/snapshot/timespans" component={ManageTimespansContainer} />
      </Route>

      <Route path="/topics/:topicId/settings" component={TopicSettingsContainer} />

    </Route>

    <Route path="/topics/public/home" component={PublicHomeContainer} onEnter={redirectHomeIfLoggedIn} />
    <Route path="/topics/public/:topicId" component={TopicContainer}>
      <Route path="/topics/public/:topicId/summary" component={PublicTopicSummaryContainer} />
    </Route>

  </Route>

);

export default topicRoutes;
