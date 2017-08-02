
const messages = {

  suiteName: { id: 'suite.name', defaultMessage: 'Media Cloud' },

  blogToolName: { id: 'app.blog.name', defaultMessage: 'Blog' },
  blogToolDescription: { id: 'app.blog.description', defaultMessage: 'Read updates on our research, projects, and ideas from us and our partners' },
  dashboardToolName: { id: 'app.dashboard.name', defaultMessage: 'Dashboard' },
  dashboardToolDescription: { id: 'app.dashboard.description', defaultMessage: 'Get a quick overview of how your topic of interest is covered by digital news media' },
  sourcesToolName: { id: 'app.sources.name', defaultMessage: 'Source Manager' },
  sourcesToolDescription: { id: 'app.sources.description', defaultMessage: 'Browse the media sources and collections in our database, and suggest more to add' },
  topicsToolName: { id: 'app.topics.name', defaultMessage: 'Topic Mapper' },
  topicsToolDescription: { id: 'app.topics.description', defaultMessage: 'Investigate a specific media topic in-depth, seeing the most influential sources, stories, and how language is used' },
  toolsAppName: { id: 'app.tools.name', defaultMessage: 'Tools' },
  toolsAppDescription: { id: 'app.tools.description', defaultMessage: 'Find out more about our tools and how to use them' },

  c4cmName: { id: 'c4cm.name', defaultMessage: 'MIT Center for Civic Media' },
  berkmanName: { id: 'berkman.name', defaultMessage: 'Berkman Klein Center for Internet and Society at Harvard University' },
  userLogin: { id: 'user.login', defaultMessage: 'Login' },
  userLogout: { id: 'user.logout', defaultMessage: 'Logout' },
  unlimited: { id: 'user.unlimited', defaultMessage: 'Unlimited' },
  userProfile: { id: 'user.profile', defaultMessage: 'Profile' },

  topicName: { id: 'topic.title.default', defaultMessage: 'Topic' },
  topicSnapshot: { id: 'topic.snapshot', defaultMessage: 'Snapshot' },
  topicTimespan: { id: 'topic.timespan', defaultMessage: 'Timespan' },

  topicNameProp: { id: 'topic.prop.name', defaultMessage: 'Name' },
  topicDescriptionProp: { id: 'topic.prop.description', defaultMessage: 'Description' },
  topicStartDateProp: { id: 'topic.prop.startDate', defaultMessage: 'Start Date' },
  topicEndDateProp: { id: 'topic.prop.endDate', defaultMessage: 'End Date' },
  topicQueryProp: { id: 'topic.prop.query', defaultMessage: 'Query' },
  topicSourceCollectionsProp: { id: 'topic.prop.query', defaultMessage: 'Sources and Collections' },
  topicValidationProp: { id: 'topic.prop.validationPattern', defaultMessage: 'Validation Pattern' },
  topicIterationsProp: { id: 'topic.prop.iteration', defaultMessage: 'Iterations' },
  toicSkipSolrQueryProp: { id: 'topic.prop.public', defaultMessage: 'Skip SOLR Query' },
  topicPublicProp: { id: 'topic.prop.public', defaultMessage: 'Public' },

  snapshotAge: { id: 'topic.snapshot.age', defaultMessage: 'Snapshot taken {age}' },
  snapshotChange: { id: 'topic.snapshot.change', defaultMessage: 'pick a different Snapshot' },
  snapshotGenerate: { id: 'needSnapshot.generate', defaultMessage: 'Generate Snapshot' },
  snapshotGenerating: { id: 'topic.snapshot.generating', defaultMessage: 'We are generating a new Snapshot; it could take a few minutes.' },

  sourceName: { id: 'source.title.default', defaultMessage: 'Media Source' },
  sourceNameProp: { id: 'source.prop.name', defaultMessage: 'Name' },
  sourceUrlProp: { id: 'source.prop.url', defaultMessage: 'URL' },
  sourceDescription: { id: 'source.description.default', defaultMessage: 'Description' },
  sourceLink: { id: 'source.link.default', defaultMessage: 'Media Source Link' },
  sourceIcon: { id: 'source.icon.default', defaultMessage: 'Logo' },

  favoritedCollectionsTitle: { id: 'favorited.collections.title', defaultMessage: 'Starred Collections' },
  favoritedSourcesTitle: { id: 'favorited.souces.title', defaultMessage: 'Starred Sources' },
  exploreFavorites: { id: 'favorited.explore', defaultMessage: 'View Starred Sources And Collections' },

  feedName: { id: 'feed.name', defaultMessage: 'Name' },
  feedUrl: { id: 'feed.url', defaultMessage: 'URL' },
  feedType: { id: 'feed.type', defaultMessage: 'Type' },
  feedStatus: { id: 'feed.status', defaultMessage: 'Status' },

  timespan: { id: 'common.timespan', defaultMessage: 'Timespan' },

  collectionName: { id: 'collection.title.default', defaultMessage: 'Collection' },
  collectionNameProp: { id: 'collection.prop.name', defaultMessage: 'Name' },
  collectionDescriptionProp: { id: 'collection.prop.description', defaultMessage: 'Description' },

  inlinks: { id: 'common.inlinks', defaultMessage: 'Inlinks' },
  sortByMediaInlinks: { id: 'common.sortByMediaInlinks', defaultMessage: 'sort by media inlinks' },
  mediaInlinks: { id: 'common.mediaInlinks', defaultMessage: 'Media Inlinks' },
  outlinks: { id: 'common.outlinks', defaultMessage: 'Outlinks' },
  clicks: { id: 'common.clicks', defaultMessage: 'Clicks' },
  bitlyClicks: { id: 'common.bitlyClicks', defaultMessage: 'Bit.ly Clicks' },
  sortByBitlyClicks: { id: 'common.sortByBitlyClicks', defaultMessage: 'sort by Bit.ly clicks' },
  facebookShares: { id: 'common.facebookShares', defaultMessage: 'Facebook Shares' },
  publishDate: { id: 'common.publishDate', defaultMessage: 'Publish Data' },
  public: { id: 'common.public', defaultMessage: 'Public' },
  private: { id: 'common.private', defaultMessage: 'Private' },
  language: { id: 'common.language', defaultMessage: 'Language' },

  topWords: { id: 'topWords', defaultMessage: 'Top Words' },
  wordcloudHelpText: { id: 'wordcloud.help.text',
    defaultMessage: '<p>This is an ordered word cloud. The words that show up more often appear bigger, and show up first in the list.  This is based on a sample of the stories, not all of them. We have done extensive testing to validate that the sample size is representative of the entire set of results.</p><p>You can click the download button to download a CSV file of word counts from a larger sample of stories.</p><p>We count words based on their stem, but show you the most commonly used stem within the sample.  To be concrete, that means if you see a word like "education" as the top word, that includes any variations of the "educ" stem (ie. educated, education, etc).</p><p>We have removed common english stop-words (ie. "if", "the", etc.), but you might see words in other languages that we don\'t have stop-word lists for.</p>',
  },

  media: { id: 'media', defaultMessage: 'Media Source' },
  mediaPlural: { id: 'media.plural', defaultMessage: 'Media Sources' },
  mediaName: { id: 'media.name', defaultMessage: 'Name' },

  focus: { id: 'focus', defaultMessage: 'Subtopic' },
  focusHeader: { id: 'focus', defaultMessage: 'Subtopics' },
  focusCreate: { id: 'focus.create', defaultMessage: 'create a new Subtopic' },
  backToTopic: { id: 'backToTopic', defaultMessage: 'back to Topic' },
  addFocus: { id: 'focus.add', defaultMessage: 'Add a New Subtopic' },

  story: { id: 'story', defaultMessage: 'Story' },
  storyPlural: { id: 'stories', defaultMessage: 'Stories' },
  storyTitle: { id: 'story.title', defaultMessage: 'Title' },
  storyDate: { id: 'story.date', defaultMessage: 'Publish Data' },
  storiesTableHelpTitle: { id: 'stories.help.title', defaultMessage: 'About Stories' },
  storiesTableHelpText: { id: 'stories.help.text',
    defaultMessage: '<p>This table has one row for each Story.  The column currently being used to sort the results has a little down arrow next to it.  Click one of the green column headers to change how it is sorted.  Here is a summary of the columns:</p><ul><li>Title: the title of the story; click to see details about this story</li><li>Media Source: the name of the Media Source; click to see details about this source\'s content within this Topic</li><li>Publish Date: our best guess of the date and time this content was published</li><li>Media Inlinks: how many unique other Media Sources have links to this content in the Topic</li><li>Outlinks: the number of links in this story to other stories</li><li>Bit.ly Clicks: the number of clicks on links to this story shortened using the Bit.ly URL shortening service</li><li>Facebook Shares: the number of times this story was shared on Facebook</li></ul><p>Click the download button in the top right to download a CSV of the full list of stories</p>',
  },
  heatMapHelpText: { id: 'heatmap.help.text',
    defaultMessage: '<p>The country map shows you an intensity of how often countries are mentioned in the results. This uses our CLIFF-CLAVIN geolocation engine to find mentions of known places in the text of the news articles. The darker the color, the more it was mentioned. Note that this is using a sampling of the sentences, not all of them. If you download a CSV of the results, the counts you see are also based on this sampling.</p><p>We have been tagging all english language stories with the places they mention since June 1, 2016.</p>',
  },
  geoHelpTitle: { id: 'source.summary.geo.help.title', defaultMessage: 'Geographic Focus' },
  geoHelpContent: { id: 'source.summary.geo.help.content', defaultMessage: '<p>We can analyze how often countries are mentioned in a story. This uses our CLIFF-CLAVIN geolocation engine to find mentions of known places in the text of the news articles. We have been tagging all english language stories with the places they mention since June 1, 2016.</p>' },
  themeHelpTitle: { id: 'source.summary.geo.theme.title', defaultMessage: 'Thematic Focus' },
  themeHelpContent: { id: 'source.summary.geo.theme.title', defaultMessage: '<p>We can analyze the main themes covered in a story.  We\'ve trained a set of machine learning models based on the NYT Corpus.  This lets us take an article and have these models guess what themes the article is about.  We filter for themes that have the highest relevace scores, and tag each story with those themes.</p>' },

  word: { id: 'word', defaultMessage: 'Word Source' },
  ok: { id: 'ok', defaultMessage: 'OK' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  reset: { id: 'reset', defaultMessage: 'Reset' },
  error: { id: 'error', defaultMessage: 'Error' },
  details: { id: 'details', defaultMessage: 'Details' },
  search: { id: 'search', defaultMessage: 'Search' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  settings: { id: 'settings', defaultMessage: 'Settings' },
  searchByKeywords: { id: 'source.title.query', defaultMessage: 'Search By Keywords' },
  next: { id: 'next', defaultMessage: 'Next' },
  previous: { id: 'previous', defaultMessage: 'Previous' },
  manage: { id: 'manage', defaultMessage: 'manage' },
  help: { id: 'help', defaultMessage: 'Help' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  save: { id: 'save', defaultMessage: 'Save' },
  home: { id: 'save', defaultMessage: 'Home' },
  preview: { id: 'preview', defaultMessage: 'Preview' },
  confirm: { id: 'confirm', defaultMessage: 'Confirm' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  add: { id: 'add', defaultMessage: 'Add' },
  open: { id: 'open', defaultMessage: 'Open' },
  close: { id: 'close', defaultMessage: 'Close' },
  yes: { id: 'yes', defaultMessage: 'Yes' },
  no: { id: 'no', defaultMessage: 'No' },
  monitored: { id: 'monitored', defaultMessage: 'Monitored' },
  none: { id: 'none', defaultMessage: 'None' },
  editWordCloud: { id: 'editWordCloud', defaultMessage: 'Edit this Word Cloud' },
  viewWordCloud: { id: 'viewWordCloud', defaultMessage: 'View this Word Cloud' },
  download: { id: 'download', defaultMessage: 'Download' },
  downloadSVG: { id: 'downloadsvg', defaultMessage: 'Download a SVG' },
  downloadCSV: { id: 'downloadcsv', defaultMessage: 'Download a CSV' },
  favorite: { id: 'favorite', defaultMessage: 'Star' },
  unfavorite: { id: 'unfavorite', defaultMessage: 'Un-star' },
  explore: { id: 'explore', defaultMessage: 'Explore' },
  nextPage: { id: 'paging.next', defaultMessage: 'Next Page' },
  previousPage: { id: 'paging.previous', defaultMessage: 'Previous Page' },
  readItNow: { id: 'readItNow', defaultMessage: 'Read It Now' },
  moreOptions: { id: 'moreOptions', defaultMessage: 'More Options' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  upload: { id: 'upload', defaultMessage: 'Upload' },
  other: { id: 'other', defaultMessage: 'Other' },
  required: { id: 'required', defaultMessage: 'Required' },

  topicFavorited: { id: 'topics.favorited', defaultMessage: 'Starred this topic.' },
  topicUnfavorited: { id: 'topics.unfavorited', defaultMessage: 'Unstarred this topic.' },

  focusPick: { id: 'focus.pick', defaultMessage: 'Pick a Subtopic' },
  removeFocus: { id: 'focus.pick', defaultMessage: 'Don\'t use any Subtopic' },

  menuOpenTooltip: { id: 'menu.open.tooltip', defaultMessage: 'Open Main Menu' },
  menuTitle: { id: 'menu.title', defaultMessage: 'Main Menu' },
  menuAbout: { id: 'menu.about', defaultMessage: 'About' },

  userEmail: { id: 'user.email', defaultMessage: 'Email' },
  userPassword: { id: 'user.password', defaultMessage: 'Password' },
  userOldPassword: { id: 'user.oldpPassword', defaultMessage: 'Old Password' },
  userNewPassword: { id: 'user.newPassword', defaultMessage: 'New Password' },
  userConfirmPassword: { id: 'user.confirmPassword', defaultMessage: 'Confirm Password' },
  userChangePassword: { id: 'user.changePassword', defaultMessage: 'Change Password' },
  userResetPassword: { id: 'user.resetPassword', defaultMessage: 'Reset Password' },
  userSignup: { id: 'user.signup', defaultMessage: 'Sign Up' },
  userFullName: { id: 'user.fullName', defaultMessage: 'Full Name' },
  userNotes: { id: 'user.notes', defaultMessage: 'Notes' },
  passwordTooShort: { id: 'user.paswordTooShort', defaultMessage: 'Your password must be at least 8 characters.' },
  passwordsMismatch: { id: 'user.mismatchPassword', defaultMessage: 'Passwords do not match.' },
  resendActivation: { id: 'user.resendActivation.action', defaultMessage: 'Resend Activation Email' },

  attentionChartHelpText: { id: 'attentionChart.help.text',
    defaultMessage: '<p>This chart shows sentences over time. This is the number of sentences in stories where at least one sentence matched your topic query. This is NOT the number of sentences that matched your query.</p><p>Roll over the line chart to see the sentences per day in that period of time in each timespan shown on the graph.</p><p>Click the download button in the top right to download the raw counts in a CSV spreadsheet.  Click the three lines in the top right of the chart to export the chart as an image file.</p>',
  },

  wordTreeHelpText: { id: 'wordTree.help.text',
    defaultMessage: '<p>This "word tree" visualization lets you explore the use of this word in context.  Revealing the words it is used with can be far more revealing than the simple word cloud presented.  The word is at the center, with the words that are most often used just before it on the left, and the words used most often just after on the right.</p><p>Notes:</p><ul><li>This is based on a random sample of 1000 sentences fragments, which we haven\'t exhaustively tested to see if is a representative sample (but seems to work well).</li><li>This only includes the 5 words before and after the use of the keyword you are looking at (due to copywrite sensitivities).</li><li>This uses the term, not the stem.</li></ul><p>Those caveat noted, it can still be useful to get a sense of <b>how</b> this word is being used.</p>',
  },

  totalStoriesStat: { id: 'totalStories', defaultMessage: 'Total Stories' },
  totalDownloadsStat: { id: 'totalDownloads', defaultMessage: 'Total Downloads' },
  totalSentencesStat: { id: 'totalSentences', defaultMessage: 'Total Sentences' },
  crawledMediaStat: { id: 'crawledMedia', defaultMessage: 'Active Crawled Media' },
  crawledFeedsStat: { id: 'crawledFeeds', defaultMessage: 'Active Crawled Feeds' },
  dailyStoriesStat: { id: 'dailyStories', defaultMessage: 'Daily Stories' },
  dailyDownloadsStat: { id: 'dailyDownloads', defaultMessage: 'Daily Downloads' },

  word2vecChartHelpText: { id: 'word2vecChart.help.text', defaultMessage: '<p>This data is generated by querying the Google News word2vec model.  This turns each word into a vector telling us information about other words it is commonly used with in the online news shown by Google News. We take that information and turn it into a 2d representation to show how the words in your query are used together in common news reporting.<p>' },
};

export default messages;
