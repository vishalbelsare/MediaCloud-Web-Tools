
SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'

# the magic tag set that has collection tags in it
COLLECTIONS_TAG_SET_ID = 5

def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort
