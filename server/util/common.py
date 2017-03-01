import logging
from flask import request, jsonify
from server.util.request import arguments_required, form_fields_required, api_error_handler


def _tag_ids_from_collections_param(input):
    tag_ids_to_add = []
    if len(input) > 0:
        tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",") if len(cid) > 0]
    return set(tag_ids_to_add)

def _media_ids_from_sources_param(input):
    media_ids_to_add = []
    if len(input) > 0:
        media_ids_to_add = [int(cid) for cid in request.form['sources[]'].split(",") if len(cid) > 0]
    return media_ids_to_add

def _media_tag_ids_from_collections_param(input):
    media_tag_ids_to_add = []
    if len(input) > 0:
        media_tag_ids_to_add = [int(cid) for cid in request.form['collections[]'].split(",") if len(cid) > 0]
    return media_tag_ids_to_add