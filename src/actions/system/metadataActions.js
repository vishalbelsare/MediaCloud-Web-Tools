import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';

export const FETCH_METADATA_VALUES_FOR_MEDIA_TYPE = 'FETCH_METADATA_VALUES_FOR_MEDIA_TYPE';

export const fetchMetadataValuesForMediaType = createAsyncAction(FETCH_METADATA_VALUES_FOR_MEDIA_TYPE, api.metadataValuesForMediaType);
