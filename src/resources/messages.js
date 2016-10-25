
const messages = {

  suiteName: { id: 'suite.name', defaultMessage: 'Media Cloud' },

  dashboardToolShortName: { id: 'tool.dashboard.name.short', defaultMessage: 'Dashboard' },
  dashboardToolName: { id: 'tool.dashboard.name', defaultMessage: 'Dashboard' },
  dashboardToolDescription: { id: 'tool.dashboard.description', defaultMessage: 'examine how much attention online media gives a topic' },
  sourcesToolShortName: { id: 'tool.sources.name.short', defaultMessage: 'Source Manager' },
  sourcesToolName: { id: 'tool.sources.name', defaultMessage: 'Source Manager' },
  sourcesToolDescription: { id: 'tool.sources.description', defaultMessage: 'explore the variety of sources Media Cloud covers' },
  topicsToolShortName: { id: 'tool.topics.name.short', defaultMessage: 'Topic Mapper' },
  topicsToolName: { id: 'tool.topics.name', defaultMessage: 'Topic Mapper' },
  topicsToolDescription: { id: 'tool.topics.description', defaultMessage: 'analyze how online media focuses on a topic' },

  c4cmName: { id: 'c4cm.name', defaultMessage: 'MIT Center for Civic Media' },
  berkmanName: { id: 'berkman.name', defaultMessage: 'Berkman Klein Center for Internet and Society at Harvard University' },
  userLogin: { id: 'user.login', defaultMessage: 'Login' },
  userLogout: { id: 'user.logout', defaultMessage: 'Logout' },

  topicName: { id: 'topic.title.default', defaultMessage: 'Topic' },
  topicSnapshot: { id: 'topic.snapshot', defaultMessage: 'Snapshot' },
  topicTimespan: { id: 'topic.timespan', defaultMessage: 'Timespan' },

  topicNameProp: { id: 'topic.prop.name', defaultMessage: 'Name' },
  topicDescriptionProp: { id: 'topic.prop.description', defaultMessage: 'Description' },
  topicStartDateProp: { id: 'topic.prop.startDate', defaultMessage: 'Start Date' },
  topicEndDateProp: { id: 'topic.prop.endDate', defaultMessage: 'End Date' },
  topicQueryProp: { id: 'topic.prop.query', defaultMessage: 'Query' },
  topicValidationProp: { id: 'topic.prop.validationPattern', defaultMessage: 'Validation Pattern' },
  topicIterationsProp: { id: 'topic.prop.iteration', defaultMessage: 'Iterations' },
  toicSkipSolrQueryProp: { id: 'topic.prop.public', defaultMessage: 'Skip SOLR Query' },
  topicPublicProp: { id: 'topic.prop.public', defaultMessage: 'Public' },

  snapshotAge: { id: 'topic.snapshot.age', defaultMessage: 'Snapshot taken {age}' },
  snapshotChange: { id: 'topic.snapshot.change', defaultMessage: 'pick a different Snapshot' },
  snapshotGenerate: { id: 'needSnapshot.generate', defaultMessage: 'Generate Snapshot' },
  snapshotGenerating: { id: 'topic.snapshot.generating', defaultMessage: 'We are generating a new Snapshot; it could take a few minutes.' },

  sourceName: { id: 'source.title.default', defaultMessage: 'Media Source' },

  timespan: { id: 'common.timespan', defaultMessage: 'Timespan' },

  collectionName: { id: 'collection.title.default', defaultMessage: 'Collection' },

  inlinks: { id: 'common.inlinks', defaultMessage: 'Inlinks' },
  sortByMediaInlinks: { id: 'common.inlinks', defaultMessage: 'sort by media inlinks' },
  mediaInlinks: { id: 'common.inlinks', defaultMessage: 'Media Inlinks' },
  outlinks: { id: 'common.outlinks', defaultMessage: 'Outlinks' },
  clicks: { id: 'common.clicks', defaultMessage: 'Clicks' },
  bitlyClicks: { id: 'common.bitlyClicks', defaultMessage: 'Bit.ly Clicks' },
  sortByBitlyClicks: { id: 'common.inlinks', defaultMessage: 'sort by Bit.ly clicks' },
  facebookShares: { id: 'common.facebookShares', defaultMessage: 'Facebook Shares' },
  publishDate: { id: 'common.publishDate', defaultMessage: 'Publish Data' },

  topWords: { id: 'topWords', defaultMessage: 'Top Words' },
  wordcloudHelpText: { id: 'wordcloud.help.text',
    defaultMessage: '<p>This is an ordered word cloud. The words that show up more often appear bigger, and show up first in the list.  This is based on a sample of the stories in the overall Topic.  We have done extensive testing to validate that the sample size is representative of the entire Topic.</p><p>You can click the download button to download a CSV file of word counts from a larger sample of stories from the Topic.</p><p>We count words based on their stem, but show you the most commonly used stem within the sample.  To be concrete, that means if you see a word like "education" as the top word, that includes any variations of the "educ" stem (ie. educated, education, etc).</p>',
  },

  media: { id: 'media', defaultMessage: 'Media Source' },
  mediaPlural: { id: 'media.plural', defaultMessage: 'Media Sources' },
  mediaName: { id: 'media.name', defaultMessage: 'Name' },

  focus: { id: 'focus', defaultMessage: 'Focus' },
  focusCreate: { id: 'focus.create', defaultMessage: 'create a new Focus' },
  backToTopic: { id: 'backToTopic', defaultMessage: 'back to Topic' },

  story: { id: 'story', defaultMessage: 'Story' },
  storyPlural: { id: 'stories', defaultMessage: 'Stories' },
  storyTitle: { id: 'story.title', defaultMessage: 'Title' },
  storyDate: { id: 'story.date', defaultMessage: 'Publish Data' },
  storiesTableHelpTitle: { id: 'stories.help.title', defaultMessage: 'About Stories' },
  storiesTableHelpText: { id: 'stories.help.text',
    defaultMessage: '<p>This table has one row for each Story.  The column currently being used to sort the results has a little down arrow next to it.  Click one of the green column headers to change how it is sorted.  Here is a summary of the columns:</p><ul><li>Title: the title of the story; click to see details about this story</li><li>Media Source: the name of the Media Source; click to see details about this source\'s content within this Topic</li><li>Publish Date: our best guess of the date and time this content was published</li><li>Media Inlinks: how many unique other Media Sources have links to this content in the Topic</li><li>Outlinks: the number of links in this story to other stories</li><li>Bit.ly Clicks: the number of clicks on links to this story shortened using the Bit.ly URL shortening service</li><li>Facebook Shares: the number of times this story was shared on Facebook</li></ul><p>Click the download button in the top right to download a CSV of the full list of stories</p>',
  },

  ok: { id: 'ok', defaultMessage: 'OK' },
  error: { id: 'error', defaultMessage: 'Error' },
  details: { id: 'details', defaultMessage: 'Details' },
  search: { id: 'search', defaultMessage: 'Search' },
  settings: { id: 'settings', defaultMessage: 'Settings' },
  searchByKeywords: { id: 'source.title.query', defaultMessage: 'Search By Keywords' },
  next: { id: 'bext', defaultMessage: 'Next' },
  manage: { id: 'manage', defaultMessage: 'manage' },
  help: { id: 'help', defaultMessage: 'Help' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  add: { id: 'add', defaultMessage: 'Add' },
  open: { id: 'open', defaultMessage: 'Open' },
  close: { id: 'close', defaultMessage: 'Close' },
  download: { id: 'download', defaultMessage: 'Download' },
  favorite: { id: 'favorite', defaultMessage: 'Favorite' },
  unfavorite: { id: 'unfavorite', defaultMessage: 'Unfavorite' },
  explore: { id: 'explore', defaultMessage: 'Explore' },
  nextPage: { id: 'paging.next', defaultMessage: 'Next Page' },
  previousPage: { id: 'paging.previous', defaultMessage: 'Previous Page' },

  topicFavorited: { id: 'topics.favorited', defaultMessage: 'Added it as a favorite.' },
  topicUnfavorited: { id: 'topics.unfavorited', defaultMessage: 'Removed it from your favorites.' },

  focusPick: { id: 'focus.pick', defaultMessage: 'Pick a Focus' },
  removeFocus: { id: 'focus.pick', defaultMessage: 'Don\'t use any focus' },

  menuOpenTooltip: { id: 'menu.open.tooltip', defaultMessage: 'Open Main Menu' },
  menuTitle: { id: 'menu.title', defaultMessage: 'Main Menu' },
  menuAbout: { id: 'menu.about', defaultMessage: 'About Topic Mapper' },

  userEmail: { id: 'user.email', defaultMessage: 'Email' },
  userPassword: { id: 'user.password', defaultMessage: 'Password' },

  attentionChartHelpText: { id: 'attentionChart.help.text',
    defaultMessage: '<p>This chart shows sentences over time. The vertical axis shows the number of sentences that are about the topic in the stories we have collected.</p><p>Roll over the line chart to see the sentences per day in each timespan shown on the graph.</p><p>Click the download button in the top right to download the raw counts in a CSV spreadsheet.  Click the three lines in the top right of the chart to export the chart as an image file.</p>',
  },

};

export default messages;
