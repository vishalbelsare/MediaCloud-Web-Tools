import logging
from flask import jsonify

logger = logging.getLogger(__name__)

def validate_params_exist(form, params):
    for param in params:
        if param not in form:
            raise Exception('Missing '+param)

def json_error_response(message, status_code=400):
    response = jsonify({
        'status': status_code,
        'message': message,
    })
    response.status_code = status_code
    return response

def filters_from_args(request_args):
    '''
    Helper to centralize reading filters from url params
    '''
    return request_args.get('snapshotId'), request_args.get('timespanId'), request_args.get('focusId')
