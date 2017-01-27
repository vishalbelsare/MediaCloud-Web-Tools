COLLECTIONS_TEMPLATE_PROPS = ['URL','NAME','MEDIA_ID','PUB_COUNTRY']
# some useful tag sets
COLLECTIONS_TAG_SET_ID = 5
GV_TAG_SET_ID = 556
EMM_TAG_SET_ID = 597

# metadata tag sets
TAG_SETS_ID_PUBLICATION_COUNTRY = 1935

VALID_METADATA_IDS = [{'pub_country':TAG_SETS_ID_PUBLICATION_COUNTRY}]

def isMetaDataTagSet(metadataTagSetsId):
  for eachMetadataItem in VALID_METADATA_IDS:
  	if metadataTagSetsId in eachMetadataItem.values():
  		return 1
  return 0
