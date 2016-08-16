import logging
from functools import wraps
from flask import jsonify, request

logger = logging.getLogger(__name__)

def validate_params_exist(form, params):
    for param in params:
        if param not in form:
            raise ValueError('Missing required value for '+param)

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


def arguments_required(*expected_args):
    '''
    Handy decorator for ensuring that request params exist
    '''
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                logger.info(request.args)
                validate_params_exist(request.args, expected_args)
                return func(*args, **kwargs)
            except ValueError as e:
                logger.exception("Missing a required arg")
                return json_error_response(e.args[0])
        return wrapper
    return decorator

def form_fields_required(*expected_args):
    '''
    Handy decorator for ensuring that the form has the fields you need
    '''
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                logger.info(request.form)
                validate_params_exist(request.form, expected_args)
                return func(*args, **kwargs)
            except ValueError as e:
                logger.exception("Missing a required form field")
                return json_error_response(e.args[0])
        return wrapper
    return decorator
