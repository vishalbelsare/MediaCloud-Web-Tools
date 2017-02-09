COLLECTIONS_TEMPLATE_PROPS_CREATE = ['url','name', 'pub_country', 'public_notes', 'is_monitored']
COLLECTIONS_TEMPLATE_PROPS_VIEW = ['url','name','media_id', 'pub_country', 'public_notes', 'is_monitored']
COLLECTIONS_TEMPLATE_PROPS_EDIT = ['url','name','media_id', 'pub_country', 'public_notes', 'is_monitored', 'editor_notes']
# some useful tag sets
COLLECTIONS_TAG_SET_ID = 5
GV_TAG_SET_ID = 556
EMM_TAG_SET_ID = 597

FEATURED_COLLECTION_LIST = [8875027, 2453107, 8878332, 9201395]
POPULAR_COLLECTION_LIST = [8875027, 2453107, 8878332, 9201395, 8877968, 9094533, 9173065, 8878293, 8878292, 8878294, 9139487, 9139458 ]
# metadata tag sets
TAG_SETS_ID_PUBLICATION_COUNTRY = 1935

VALID_METADATA_IDS = [{'pub_country':TAG_SETS_ID_PUBLICATION_COUNTRY}]

def isMetaDataTagSet(metadataTagSetsId):
  for eachMetadataItem in VALID_METADATA_IDS:
  	if int(metadataTagSetsId) in eachMetadataItem.values():
  		return True
  return False
