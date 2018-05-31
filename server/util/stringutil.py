import logging
from datetime import datetime
from server import mc 

logger = logging.getLogger(__name__)


def ids_from_comma_separated_str(comma_separated_string):
    id_list = []
    if len(comma_separated_string) > 0:
        id_list = [int(cid) for cid in comma_separated_string.split(",") if len(cid) > 0]
    return id_list

def trimSolrDate(dateStr):
  return datetime.strptime(dateStr, mc.SENTENCE_PUBLISH_DATE_FORMAT).strftime("%Y-%m-%d")