import logging
from flask import jsonify, request
import flask_login
import json

from server import app, TOOL_API_KEY
from server.views import WORD_COUNT_SAMPLE_SIZE, WORD_COUNT_DOWNLOAD_LENGTH, WORD_COUNT_UI_LENGTH
from server.util.request import api_error_handler
import server.util.csv as csv
from server.views.explorer import parse_as_sample, parse_query_with_args_and_sample_search, parse_query_with_keywords, \
    load_sample_searches, file_name_for_download
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)

WORD_CONTEXT_SIZE = 5   # for sentence fragments, this is the amount of words before & after that we return

@app.route('/api/explorer/words/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_words():
    return get_word_count()


@app.route('/api/explorer/demo/words/count', methods=['GET'])
@api_error_handler
def api_explorer_demo_words():
    return get_word_count()


def get_word_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        current_search = sample_searches[search_id]['queries']
        solr_q, solr_fq = parse_query_with_args_and_sample_search(request.args, current_search)
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)
    word_data = query_wordcount(solr_q, solr_fq)
    # return combined data
    return jsonify({"list": word_data})


# if this is a sample search, we will have a search id and a query index
# if this is a custom search, we will have a query will q,start_date, end_date, sources and collections
@app.route('/api/explorer/words/wordcount.csv', methods=['POST'])
@api_error_handler
def explorer_wordcount_csv():
    data = request.form
    ngram_size = data['ngramSize'] if 'ngramSize' in data else 1    # defaul to words if ngram not specified
    filename = u'sampled-ngrams-frequency-{}'.format(ngram_size)
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
    return stream_wordcount_csv(filename, solr_q, solr_fq, ngram_size)


@app.route('/api/explorer/words/compare/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_compare_words():
    compared_queries = request.args['compared_queries[]'].split(',')
    results = []
    for cq in compared_queries:
        dictq = {x[0]: x[1] for x in [x.split("=") for x in cq[1:].split("&")]}
        solr_q, solr_fq = parse_query_with_keywords(dictq)
        word_count_result = query_wordcount(solr_q, solr_fq)
        results.append(word_count_result)
    return jsonify({"list": results})  


@app.route('/api/explorer/demo/words/compare/count')
@api_error_handler
def api_explorer_demo_compare_words():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    
    if search_id not in [None, -1]:
        sample_searches = load_sample_searches()
        compared_sample_queries = sample_searches[search_id]['queries']
        results = []
        for cq in compared_sample_queries:
            solr_q, solr_fq = parse_query_with_keywords(cq)
            word_count_result = query_wordcount(solr_q, solr_fq)
            results.append(word_count_result)
    else:
        compared_queries = request.args['compared_queries[]'].split(',')
        results = []
        for cq in compared_queries:
            dictq = {x[0]:x[1] for x in [x.split("=") for x in cq[1:].split("&")]}
            solr_q, solr_fq = parse_query_with_keywords(dictq)
            word_count_result = query_wordcount(solr_q, solr_fq)
            results.append(word_count_result)

    return jsonify({"list": results})


def query_wordcount(q, fq, ngram_size=1, num_words=WORD_COUNT_UI_LENGTH, sample_size=WORD_COUNT_SAMPLE_SIZE):
    word_data = apicache.word_count(q, fq, ngram_size, num_words, sample_size)
    # add in word2vec results
    words = [w['term'] for w in word_data]
    # and now add in word2vec model position data
    google_word2vec_data = apicache.word2vec_google_2d(words)
    for i in range(len(google_word2vec_data)):
        word_data[i]['google_w2v_x'] = google_word2vec_data[i]['x']
        word_data[i]['google_w2v_y'] = google_word2vec_data[i]['y']
    return word_data


def stream_wordcount_csv(filename, q, fq, ngram_size=1):
    # use bigger values for CSV download
    num_words = WORD_COUNT_DOWNLOAD_LENGTH
    sample_size = WORD_COUNT_SAMPLE_SIZE
    word_counts = query_wordcount(q, fq, ngram_size, num_words, sample_size)
    for w in word_counts:
        w['sample_size'] = sample_size
        w['ratio'] = float(w['count'])/float(sample_size)
    props = ['term', 'stem', 'count', 'sample_size', 'ratio', 'google_w2v_x', 'google_w2v_y']
    return csv.stream_response(word_counts, props, filename)


@app.route('/api/explorer/words/<word>/sample-usage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def explorer_word_usage_sample(word):
    # gotta respect the manual query if there is one
    q = word
    # need to use tool API key here because non-admin users can't pull sentences
    results = apicache.sentence_list(TOOL_API_KEY, q=q)
    # TODO: do we need to restrict by solr_q here too?
    # eg     if search_id not in [None, -1]:
    #    sample_searches = load_sample_searches()
    #    current_search = sample_searches[search_id]['queries']
    #    solr_q, solr_fq = parse_query_with_args_and_sample_search(word, current_search)
    #else:
    #    solr_q, solr_fq = parse_query_with_keywords(word)
    fragments = [_sentence_fragment_around(word, s['sentence']) for s in results if s['sentence'] is not None]
    fragments = [f for f in fragments if f is not None]
    return jsonify({'fragments': fragments})


def _sentence_fragment_around(keyword, sentence):
    '''
    Turn a sentence into a sentence fragment, including just the 5 words before and after the keyword we are looking at.
    We do this to enforce our rule that full sentences (even without metadata) never leave our servers).
    Warning: this makes simplistic assumptions about word tokenization
    ::return:: a sentence fragment around keyword, or None if keyword can't be found
    '''
    try:
        words = sentence.split()  # super naive, but works ok
        keyword_index = None
        for index, word in enumerate(words):
            if keyword_index is not None:
                continue
            if word.lower().startswith(keyword.replace("*", "").lower()):
                keyword_index = index
        if keyword_index is None:
            return None
        min_word_index = max(0, keyword_index - WORD_CONTEXT_SIZE)
        max_word_index = min(len(words), keyword_index + WORD_CONTEXT_SIZE)
        fragment_words = words[min_word_index:max_word_index]
        return " ".join(fragment_words)
    except ValueError:
        return None


