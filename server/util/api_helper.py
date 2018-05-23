import datetime

from server import mc


def add_missing_dates_to_split_story_counts(counts, start, end, period="day"):
    if start is None and end is None:
        return counts
    new_counts = []
    current = start
    while current <= end:
        date_string = current.strftime(mc.SENTENCE_PUBLISH_DATE_FORMAT)
        existing_count = next((r for r in counts if r['date'] == date_string), None)
        if existing_count:
            new_counts.append(existing_count)
        else:
            new_counts.append({'date': date_string, 'count': 0})
        if period == "day":
            current += datetime.timedelta(days=1)
        elif period == "month":
            current += datetime.timedelta(months=1)
        elif period == "year":
            current += datetime.timedelta(years=1)
        else:
            raise RuntimeError("Unsupport time period for filling in missing dates - {}".format(period))
    return new_counts