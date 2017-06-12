import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/notebook';

export const SAVE_TO_NOTEBOOK = 'SAVE_TO_NOTEBOOK';
export const FETCH_NOTEBOOK_CLIPPINGS = 'LIST_NOTEBOOK_CLIPPINGS';

export const saveToNotebook = createAsyncAction(SAVE_TO_NOTEBOOK, api.saveToNotebook);

export const fetchNotebookClippings = createAsyncAction(FETCH_NOTEBOOK_CLIPPINGS, api.allNotebookClippings);
