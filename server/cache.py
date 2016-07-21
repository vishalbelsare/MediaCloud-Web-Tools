import hermes.backend.memcached

cache = hermes.Hermes(hermes.backend.memcached.Backend, ttl=86400)	# one day
