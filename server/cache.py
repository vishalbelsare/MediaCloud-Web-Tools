from dogpile.cache import make_region

from server import config

cache = make_region().configure(
    'dogpile.cache.redis',
    arguments = {
        'url': config.get('CACHE_REDIS_URL'),
        'port': 6379,
        'db': 0,
        'redis_expiration_time': 60*60*24*3,   # 3 days
        'distributed_lock': True
        }
)
