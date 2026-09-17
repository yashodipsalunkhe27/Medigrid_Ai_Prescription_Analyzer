import urllib.parse


def get_location(location):

    search_query = 'nearby pharmacies'
    encoded_query = urllib.parse.quote(search_query)

    # Handle missing location (None, or missing lat/long keys) gracefully
    # instead of crashing with AttributeError.
    if not location or location.get('latitude') is None or location.get('longitude') is None:
        # Fall back to a generic search with no coordinates, so the
        # prescription analysis can still complete even without location access.
        return f"https://www.google.com/maps/search/{encoded_query}"

    latitude = location.get('latitude')
    longitude = location.get('longitude')

    map_link = f"https://www.google.com/maps/search/{encoded_query}/@{latitude},{longitude},15z"
    return map_link