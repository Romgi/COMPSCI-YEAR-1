def has_snowed(d: Dict[str, int]) -> bool:
    result = {}
    for key in d:
        value = d[key]
        if value not in result:
            result[value] = []
        result[value].append(key)
    return result


