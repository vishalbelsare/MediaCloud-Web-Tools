import { createAction } from 'redux-actions';
import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/serverApi/sources';

export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_COLLECTION_LIST = 'FETCH_COLLECTION_LIST';
export const FETCH_FEATURED_COLLECTIONS_LIST = 'FETCH_FEATURED_COLLECTIONS_LIST';
export const FETCH_POPULAR_COLLECTIONS_LIST = 'FETCH_POPULAR_COLLECTIONS_LIST';
export const FETCH_SOURCES_BY_IDS = 'FETCH_SOURCES_BY_IDS';
export const RESET_SOURCES_BY_IDS = 'RESET_SOURCES_BY_IDS';
export const FETCH_COLLECTION_SOURCES_BY_IDS = 'FETCH_COLLECTION_SOURCES_BY_IDS';
export const RESET_COLLECTIONS_BY_IDS = 'RESET_COLLECTIONS_BY_IDS';
export const FETCH_SOURCE_DETAILS = 'FETCH_SOURCE_DETAILS';
export const FETCH_COLLECTION_DETAILS = 'FETCH_COLLECTION_DETAILS';
export const SELECT_COLLECTION = 'SELECT_COLLECTION';
export const SELECT_SOURCE = 'SELECT_SOURCE';
export const FETCH_SOURCE_TOP_WORDS = 'FETCH_SOURCE_TOP_WORDS';
export const FETCH_COLLECTION_TOP_WORDS = 'FETCH_COLLECTION_TOP_WORDS';
export const FETCH_SOURCE_SENTENCE_COUNT = 'FETCH_SOURCE_SENTENCE_COUNT';
export const FETCH_COLLECTION_SENTENCE_COUNT = 'FETCH_COLLECTION_SENTENCE_COUNT';
export const FETCH_SOURCE_GEO = 'FETCH_SOURCE_GEO';
export const FETCH_COLLECTION_GEO = 'FETCH_COLLECTION_GEO';
export const FETCH_SOURCE_SEARCH = 'FETCH_SOURCE_SEARCH';
export const RESET_SOURCE_SEARCH = 'RESET_SOURCE_SEARCH';
export const FETCH_COLLECTION_SEARCH = 'FETCH_COLLECTION_SEARCH';
export const RESET_COLLECTION_SEARCH = 'RESET_COLLECTION_SEARCH';
export const FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS = 'FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS';
export const CREATE_NEW_COLLECTION = 'CREATE_NEW_COLLECTION';
export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const CREATE_NEW_SOURCE = 'CREATE_NEW_SOURCE';
export const UPDATE_SOURCE = 'UPDATE_SOURCE';
export const FETCH_METADATA_VALUES = 'FETCH_METADATA_VALUES';
export const FETCH_COLLECTION_TO_COPY = 'FETCH_COLLECTION_TO_COPY';
export const FETCH_SOURCE_BY_METADATA = 'FETCH_SOURCE_BY_METADATA';
export const FETCH_COLLECTION_BY_METADATA = 'FETCH_COLLECTION_BY_METADATA';
export const SELECT_ADVANCED_SEARCH_SOURCE = 'SELECT_ADVANCED_SEARCH_SOURCE';
export const SELECT_ADVANCED_SEARCH_COLLECTION = 'SELECT_ADVANCED_SEARCH_COLLECTION';
export const RESET_ADVANCED_SEARCH_COLLECTION = 'RESET_ADVANCED_SEARCH_COLLECTION';
export const RESET_ADVANCED_SEARCH_SOURCE = 'RESET_ADVANCED_SEARCH_SOURCE';
export const FETCH_SOURCE_FEEDS = 'FETCH_SOURCE_FEEDS';
export const FETCH_SOURCE_FEED = 'FETCH_SOURCE_FEED';
export const SELECT_SOURCE_FEED = 'SELECT_SOURCE_FEED';
export const CREATE_FEED = 'CREATE_FEED';
export const UPDATE_FEED = 'UPDATE_FEED';
export const FETCH_SIMILAR_COLLECTIONS = 'FETCH_SIMILAR_COLLECTIONS';
export const SUGGEST_SOURCE = 'SUGGEST_SOURCE';
export const UPDATE_SOURCE_SUGGESTION = 'UPDATE_SOURCE_SUGGESTION';
export const FETCH_SOURCE_SUGGESTIONS = 'FETCH_SOURCE_SUGGESTIONS';
export const UPLOAD_SOURCE_LIST_FROM_TEMPLATE = 'UPLOAD_SOURCE_LIST_FROM_TEMPLATE';
export const SET_FAVORITE_SOURCE = 'SET_FAVORITE_SOURCE';
export const FETCH_FAVORITE_COLLECTIONS = 'FETCH_FAVORITE_COLLECTIONS';
export const SET_FAVORITE_COLLECTION = 'SET_FAVORITE_COLLECTION';
export const FETCH_FAVORITE_SOURCES = 'FETCH_FAVORITE_SOURCES';
export const FETCH_SYSTEM_STATS = 'FETCH_SYSTEM_STATS';
export const SCRAPE_SOURCE_FEEDS = 'SCRAPE_SOURCE_FEEDS';
export const CREATE_SOURCES_FROM_URLS = 'CREATE_SOURCES_FROM_URLS';

export const fetchSystemStats = createAsyncAction(FETCH_SYSTEM_STATS, api.systemStats);

export const favoriteCollection = createAsyncAction(SET_FAVORITE_COLLECTION, api.favoriteCollection);

export const favoriteSource = createAsyncAction(SET_FAVORITE_SOURCE, api.favoriteSource);

export const fetchFavoriteCollections = createAsyncAction(FETCH_FAVORITE_COLLECTIONS, api.fetchFavoriteCollections);

export const fetchFavoriteSources = createAsyncAction(FETCH_FAVORITE_SOURCES, api.fetchFavoriteSources);

export const selectCollection = createAction(SELECT_COLLECTION, id => id);

export const selectSource = createAction(SELECT_SOURCE, id => id);

export const fetchSourceList = createAsyncAction(FETCH_SOURCE_LIST, api.sourceList);

export const fetchCollectionList = createAsyncAction(FETCH_COLLECTION_LIST, api.collectionList, id => id);

export const fetchFeaturedCollectionList = createAsyncAction(FETCH_FEATURED_COLLECTIONS_LIST, api.featuredCollectionList);

export const fetchPopularCollectionList = createAsyncAction(FETCH_POPULAR_COLLECTIONS_LIST, api.popularCollectionList);

export const fetchSourcesByIds = createAsyncAction(FETCH_SOURCES_BY_IDS, api.sourcesByIds, props => props);

export const resetSourcesByIds = createAction(RESET_SOURCES_BY_IDS);

export const fetchCollectionSourcesByIds = createAsyncAction(FETCH_COLLECTION_SOURCES_BY_IDS, api.collectionsByIds, props => props);

export const resetCollectionsByIds = createAction(RESET_COLLECTIONS_BY_IDS);

export const fetchSourceDetails = createAsyncAction(FETCH_SOURCE_DETAILS, api.sourceDetails, id => id);

export const fetchCollectionDetails = createAsyncAction(FETCH_COLLECTION_DETAILS, api.collectionDetails, id => id);

export const fetchCollectionToCopy = createAsyncAction(FETCH_COLLECTION_TO_COPY, api.collectionDetails, id => id);

export const fetchSourceSentenceCount = createAsyncAction(FETCH_SOURCE_SENTENCE_COUNT, api.sourceSentenceCount, id => id);

export const fetchCollectionSentenceCount = createAsyncAction(FETCH_COLLECTION_SENTENCE_COUNT, api.collectionSentenceCount, id => id);

export const fetchSourceTopWords = createAsyncAction(FETCH_SOURCE_TOP_WORDS, api.sourceWordCount, id => id);

export const fetchCollectionTopWords = createAsyncAction(FETCH_COLLECTION_TOP_WORDS, api.collectionWordCount, id => id);

export const fetchSourceGeo = createAsyncAction(FETCH_SOURCE_GEO, api.sourceGeography, id => id);

export const fetchCollectionGeo = createAsyncAction(FETCH_COLLECTION_GEO, api.collectionGeography, id => id);

export const fetchSourceSearch = createAsyncAction(FETCH_SOURCE_SEARCH, api.sourceSearch, string => string);

export const resetSourceSearch = createAction(RESET_SOURCE_SEARCH);

export const fetchCollectionSearch = createAsyncAction(FETCH_COLLECTION_SEARCH, api.collectionSearch, string => string);

export const resetCollectionSearch = createAction(RESET_COLLECTION_SEARCH);

export const fetchCollectionSourceSentenceCounts = createAsyncAction(FETCH_COLLECTION_SOURCE_SENTENCE_COUNTS, api.collectionSourceStoryCounts, id => id);

export const createCollection = createAsyncAction(CREATE_NEW_COLLECTION, api.createCollection, props => props);

export const updateCollection = createAsyncAction(UPDATE_COLLECTION, api.updateCollection, props => props);

export const createSource = createAsyncAction(CREATE_NEW_SOURCE, api.createSource);

export const updateSource = createAsyncAction(UPDATE_SOURCE, api.updateSource, props => props);

export const fetchMetadataValues = createAsyncAction(FETCH_METADATA_VALUES, api.metadataValues);

export const fetchSourceByMetadata = createAsyncAction(FETCH_SOURCE_BY_METADATA, api.sourceAdvancedSearch, payload => payload);

export const fetchCollectionByMetadata = createAsyncAction(FETCH_COLLECTION_BY_METADATA, api.collectionSearch, string => string);

export const selectAdvancedSearchSource = createAction(SELECT_ADVANCED_SEARCH_SOURCE, payload => payload);

export const selectAdvancedSearchCollection = createAction(SELECT_ADVANCED_SEARCH_COLLECTION, payload => payload);

export const resetAdvancedSearchSource = createAction(RESET_ADVANCED_SEARCH_SOURCE);

export const resetAdvancedSearchCollection = createAction(RESET_ADVANCED_SEARCH_COLLECTION);

export const fetchSourceFeeds = createAsyncAction(FETCH_SOURCE_FEEDS, api.sourceFeeds, id => id);

export const fetchSourceFeed = createAsyncAction(FETCH_SOURCE_FEED, api.sourceFeed, id => id);

export const selectSourceFeed = createAction(SELECT_SOURCE_FEED, id => id);

export const createFeed = createAsyncAction(CREATE_FEED, api.createFeed, id => id);

export const updateFeed = createAsyncAction(UPDATE_FEED, api.updateFeed, id => id);

export const fetchSimilarCollections = createAsyncAction(FETCH_SIMILAR_COLLECTIONS, api.similarCollections, id => id);

export const suggestSource = createAsyncAction(SUGGEST_SOURCE, api.suggestSource);

export const updateSourceSuggestion = createAsyncAction(UPDATE_SOURCE_SUGGESTION, api.updateSourceSuggestion, payload => payload);

// accepts an 'all' boolean property
export const fetchSourceSuggestions = createAsyncAction(FETCH_SOURCE_SUGGESTIONS, api.listSourceSuggestions);

export const uploadSourceListFromTemplate = createAsyncAction(UPLOAD_SOURCE_LIST_FROM_TEMPLATE, api.collectionUploadSourceListFromTemplate, props => props);

export const scrapeSourceFeeds = createAsyncAction(SCRAPE_SOURCE_FEEDS, api.scrapeSourceFeeds, id => id);

export const createSourcesByUrl = createAsyncAction(CREATE_SOURCES_FROM_URLS, api.createSourcesByUrl, urls => urls);
