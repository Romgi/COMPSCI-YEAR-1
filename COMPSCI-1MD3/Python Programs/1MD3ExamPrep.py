def has_snowed(d: Dict[str, int]) -> bool:
    result = {}
    for key in d:
        value = d[key]
        if value not in result:
            result[value] = []
        result[value].append(key)
    return result


def remove_several(L: List[int], x: int, k: int) -> List[int]:
    if L == [] or k == 0:
        return L
    if L[0] == k:
        return remove_several(L[1:], x, k-1)
    return L[0] + remove_several(L[1:], x, k)

