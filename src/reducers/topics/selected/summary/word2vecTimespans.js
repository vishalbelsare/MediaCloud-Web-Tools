import moment from 'moment';
import { FETCH_TOPIC_WORD2VEC_TIMESPANS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

function addJsDates(list) {
  const updatedList = list;
  updatedList.forEach((info) => {
    const updatedInfo = info;
    updatedInfo.timespan.startDateMoment = moment(info.timespan.start_date);
    updatedInfo.timespan.endDateMoment = moment(info.timespan.end_date);
    updatedInfo.timespan.startDateObj = moment(info.timespan.start_date).toDate();
    updatedInfo.timespan.endDateObj = moment(info.timespan.end_date).toDate();
  });
  return updatedList;
}

const word2VecTimespanEmbeddings = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOPIC_WORD2VEC_TIMESPANS,
  handleSuccess: (payload) => {
    const list = addJsDates(payload.list);
    return { list };
  },
});

export default word2VecTimespanEmbeddings;
