from typing import List

def insert(data, s: str)-> None:
    if s == "":
        return
    if len(s) == 1:
        if s in data:
            data[s][1] = True
        else:
            data[s] = [{}, True]
    if s[0] in data:
        insert(data[s[0]][0], s[1:])
    else:
        data[s[0]]= [{}, False]
        insert(data[s[0]][0], s[1:])


def count_words(data)->int:
    """
    Returns the number of words encoded in data. You may assume
    data is a valid trie.

    >>> data = {}
    >>> insert(data, "test")
    >>> insert(data, "testing")
    >>> insert(data, "doc")
    >>> insert(data, "docs")
    >>> insert(data, "document")
    >>> insert(data, "documenting")

    >>> count_words(data)
    6
    """
    total = 0
    for subtrie, is_word in data.values():
        if is_word:
            total += 1
        total += count_words(subtrie)
    return total


def contains(data, s: str)-> bool:
    """
    Returns True if and only if s is encoded within data. You may
    assume data is a valid trie.

    >>> data = {}
    >>> insert(data, "tree")
    >>> insert(data, "trie")
    >>> insert(data, "try")
    >>> insert(data, "trying")
    
    >>> contains(data, "try")
    True
    >>> contains(data, "trying")
    True
    >>> contains(data, "the")
    False
    """
    if s == "":
        return False

    node = data
    for i, ch in enumerate(s):
        if ch not in node:
            return False
        subtrie, is_word = node[ch]
        if i == len(s) - 1:
            return is_word
        node = subtrie
    return False


def height(data)->int:
    """
    Returns the length of longest word encoded in data. You may
    assume that data is a valid trie.

    >>> data = {}
    >>> insert(data, "test")
    >>> insert(data, "testing")
    >>> insert(data, "doc")
    >>> insert(data, "docs")
    >>> insert(data, "document")
    >>> insert(data, "documenting")

    >>> height(data)
    11
    """
    def dfs(node, curr_len):
        max_len = 0
        for subtrie, is_word in node.values():
            next_len = curr_len + 1
            if is_word and next_len > max_len:
                max_len = next_len
            child_max = dfs(subtrie, next_len)
            if child_max > max_len:
                max_len = child_max
        return max_len

    return dfs(data, 0)
    

def count_from_prefix(data, prefix: str)-> int:
    """
    Returns the number of words in data which starts with the string
    prefix, but is not equal to prefix. You may assume data is a valid
    trie.

    data = {}
    >>> insert(data, "python")
    >>> insert(data, "pro")
    >>> insert(data, "professionnal")
    >>> insert(data, "program")
    >>> insert(data, "programming")
    >>> insert(data, "programmer")
    >>> insert(data, "programmers")

    >>> count_from_prefix(data, 'pro')
    5
    """
    # Empty prefix: all words start with "", and none is equal to ""
    if prefix == "":
        return count_words(data)

    node = data
    for i, ch in enumerate(prefix):
        if ch not in node:
            return 0
        subtrie, is_word = node[ch]
        # At the last character of prefix: words that *extend* prefix
        # are exactly the words in this subtrie.
        if i == len(prefix) - 1:
            return count_words(subtrie)
        node = subtrie
    return 0
    

def get_suggestions(data, prefix:str)-> List[str]:
    """
    Returns a list of words which are encoded in data, and starts with
    prefix, but is not equal to prefix. You may assume data is a valid
    trie.

    data = {}
    >>> insert(data, "python")
    >>> insert(data, "pro")
    >>> insert(data, "professionnal")
    >>> insert(data, "program")
    >>> insert(data, "programming")
    >>> insert(data, "programmer")
    >>> insert(data, "programmers")

    >>> get_suggestions(data, "progr")
    ['program', 'programming', 'programmer', 'programmers']
    """
    # Find the trie node corresponding to the end of prefix
    node = data
    if prefix == "":
        start_subtrie = data
    else:
        for i, ch in enumerate(prefix):
            if ch not in node:
                return []
            subtrie, is_word = node[ch]
            if i == len(prefix) - 1:
                start_subtrie = subtrie
            else:
                node = subtrie

    suggestions: List[str] = []

    def dfs(curr_node, curr_prefix):
        # Iterate in insertion order so the output ordering matches the example
        for ch, (child, is_word) in curr_node.items():
            new_word = curr_prefix + ch
            if is_word:
                suggestions.append(new_word)
            dfs(child, new_word)

    dfs(start_subtrie, prefix)
    return suggestions
