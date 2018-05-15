import logging
from flask import jsonify, request
import flask_login
from server import app
from server.util.request import api_error_handler
import server.views.explorer.apicache as apicache
from server.views.explorer import parse_query_with_keywords

logger = logging.getLogger(__name__)


@app.route('/api/explorer/sentences/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_sentences_list():
    solr_q, solr_fq = parse_query_with_keywords(request.args)
    results = apicache.sentence_list(solr_q, solr_fq, rows=10)
    sentences = []
    if 'docs' in results['response']:
        sentences = [s for s in results['response']['docs'] if s['sentence']]
    return jsonify({'results': sentences})
