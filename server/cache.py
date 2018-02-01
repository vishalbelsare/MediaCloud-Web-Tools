import hermes.backend.memcached
cache = hermes.Hermes(hermes.backend.memcached.Backend, ttl=86400*3)  # three days

#import hermes.backend.redis
#cache = hermes.Hermes(hermes.backend.redis.Backend, host='localhost', db=1, ttl=86400*3)  # three days
