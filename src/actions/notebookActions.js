import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/notebook';

export const SAVE_TO_NOTEBOOK = 'SAVE_TO_NOTEBOOK';

export const saveToNotebook = createAsyncAction(SAVE_TO_NOTEBOOK, api.saveToNotebook);
