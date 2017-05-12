
// tags indicating how the date on a story was guessed
export const TAG_SET_DATE_GUESS_METHOD = 508;

// tags indicating what extractor was used to pull content out of the story url
export const TAG_SET_EXTRACTOR_VERSION = 1354;

// tags indicating which version of the geocoder this was geocoded with
export const TAG_SET_GEOCODER_VERSION = 1937;


// tag sets that hold collections we want to show to the user
export const TAGS_SET_MC_ID = 5;
export const TAGS_SET_EMM_ID = 556;
export const TAGS_SET_GV_ID = 597;
const VALID_COLLECTION_IDS = [TAGS_SET_EMM_ID, TAGS_SET_GV_ID, TAGS_SET_MC_ID];

// tags for each country, allowed us to indicate which country a media source was published in
export const TAG_SET_PUBLICATION_COUNTRY = 1935;
export const TAG_SET_PUBLICATION_STATE = 1962;
export const TAG_SET_PRIMARY_LANGUAGE = 1967;

const VALID_METADATA_IDS = [TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE];

/**
 * Call this to verify a tag set id is one of the metadata options for a media source
 */
export function isMetaDataTagSet(metadataTagSetsId) {
  return VALID_METADATA_IDS.includes(metadataTagSetsId);
}

/**
 * Call this to verify a tag set id holds media source collections we want to show to the user
 */
export function isCollectionTagSet(tagSetsId) {
  return VALID_COLLECTION_IDS.includes(tagSetsId);
}
