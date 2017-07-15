import logging
from flask import jsonify
import flask_login

from server import app
from server.cache import cache
from server.util.request import api_error_handler
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key
from server.util.tags import cached_tags_in_tag_set, media_with_tag, TAG_SETS_ID_RETWEET_PARTISANSHIP_2016

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/focal-sets/preview/retweet-partisanship/story-counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def retweet_partisanship_story_counts(topics_id):
    # TODO: add in overall timespan id here so it works in different snapshots
    tag_story_counts = []
    partisanship_tags = cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # make a count for each tag based on media_od
    for tag in partisanship_tags:
        tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=tag['media_query'])['count']
        tag_story_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tagged_story_count,
            'pct': float(tagged_story_count)/float(total_stories)
        })
    return jsonify({'story_counts': tag_story_counts})


@app.route('/api/topics/<topics_id>/focal-sets/preview/retweet-partisanship/coverage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def retweet_partisanship_coverage(topics_id):
    # TODO: add in overall timespan id here so it works in different snapshots
    partisanship_tags = cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # count the stories in any media in tagged as partisan
    tag_media_ids = [" ".join(tag['media_ids']) for tag in partisanship_tags]
    all_media_ids = " ".join(tag_media_ids)
    media_ids_query_clause = "media_id:({})".format(all_media_ids)
    tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=media_ids_query_clause)['count']
    return jsonify({'counts': {'count': tagged_story_count, 'total': total_stories}})


@cache
def cached_media_tags(tag_sets_id):
    partisanship_tags = cached_tags_in_tag_set(tag_sets_id)
    for tag in partisanship_tags:
        media = media_with_tag(user_mediacloud_key(), tag['tags_id'], True)  # cache this list
        media_ids = [str(m['media_id']) for m in media] # as strs so we can concat into a query str later with .join call
        tag['media'] = media
        tag['media_ids'] = media_ids
        tag['media_query'] = "media_id:({})".format(" ".join(media_ids))
    return partisanship_tags
