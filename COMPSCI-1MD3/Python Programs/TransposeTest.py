def transpose(m):
    reference = m.copy()
    n = len(m)
    for i in range(n):
        for j in range(n):
            m[i][j] = reference[j][i]
