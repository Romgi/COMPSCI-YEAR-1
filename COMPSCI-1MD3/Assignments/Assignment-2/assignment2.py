from PIL import Image
from typing import List


def mirror(raw: List[List[List[int]]]) -> None:
    """
    Modifies image data by reversing every row in-place.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 255]],
    ...        [[199, 201, 116], [1, 9, 0], [255, 255, 255]]]
    >>> mirror(raw)
    >>> raw
    [[[255, 255, 255], [0, 0, 0], [233, 100, 115]],
     [[255, 255, 255], [1, 9, 0], [199, 201, 116]]]
    """
    for row in raw:
        row.reverse()
    return


def grey(raw: List[List[List[int]]]) -> None:
    """
    Converts image data to greyscale in-place by replacing each pixel’s
    channels with their integer average.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 255]],
    ...        [[199, 201, 116], [1, 9, 0], [255, 255, 255]]]
    >>> grey(raw)
    >>> raw
    [[[149, 149, 149], [0, 0, 0], [255, 255, 255]],
     [[172, 172, 172], [3, 3, 3], [255, 255, 255]]]
    """
    for i in range(len(raw)):
        for j in range(len(raw[i])):
            r, g, b = raw[i][j]
            avg = (r + g + b) // 3
            raw[i][j] = [avg, avg, avg]
    return


def invert(raw: List[List[List[int]]]) -> None:
    """
    Inverts each pixel in-place by swapping its min and max channel values.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 0]],
    ...        [[199, 201, 116], [1, 9, 0], [255, 100, 100]]]
    >>> invert(raw)
    >>> raw
    [[[100, 233, 115], [0, 0, 0], [0, 0, 255]],
     [[199, 116, 201], [1, 0, 9], [100, 255, 255]]]
    """
    for i in range(len(raw)):
        for j in range(len(raw[i])):
            r, g, b = raw[i][j]
            mn = min(r, g, b)
            mx = max(r, g, b)
            new_pixel = []
            for v in (r, g, b):
                if v == mn:
                    new_pixel.append(mx)
                elif v == mx:
                    new_pixel.append(mn)
                else:
                    new_pixel.append(v)
            raw[i][j] = new_pixel
    return


def merge(raw1: List[List[List[int]]], raw2: List[List[List[int]]]) -> List[List[List[int]]]:
    """
    Returns a new image by combining two images using the following rule:
      - [0, 0, 0] if neither image has a pixel at (i, j)
      - raw1[i][j] if only raw1 has a pixel at (i, j)
      - raw2[i][j] if only raw2 has a pixel at (i, j)
      - alternate by row when both exist: raw1 for even i, raw2 for odd i
    """
    h1, h2 = len(raw1), len(raw2)
    w1 = len(raw1[0]) if h1 > 0 else 0
    w2 = len(raw2[0]) if h2 > 0 else 0
    H, W = max(h1, h2), max(w1, w2)

    out: List[List[List[int]]] = []
    for i in range(H):
        row: List[List[int]] = []
        for j in range(W):
            has1 = i < h1 and j < len(raw1[i])
            has2 = i < h2 and j < len(raw2[i])
            if not has1 and not has2:
                row.append([0, 0, 0])
            elif has1 and not has2:
                row.append(raw1[i][j])
            elif has2 and not has1:
                row.append(raw2[i][j])
            else:
                row.append(raw1[i][j] if i % 2 == 0 else raw2[i][j])
        out.append(row)
    return out


def compress(raw: List[List[List[int]]]) -> List[List[List[int]]]:
    """
    Downsamples by averaging up to four pixels per 2×2 block (top-left,
    top-right, bottom-left, bottom-right). Edges average fewer pixels.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 0], [3, 6, 7]],
    ...        [[199, 201, 116], [1, 9, 0], [255, 100, 100], [99, 99, 0]],
    ...        [[200, 200, 200], [1, 9, 0], [255, 100, 100], [99, 99, 0]],
    ...        [[50, 100, 150], [1, 9, 0], [211, 5, 22], [199, 0, 10]]]
    >>> raw1 = compress(raw)
    >>> raw1
    [[[108, 77, 57], [153, 115, 26]],
     [[63, 79, 87], [191, 51, 33]]]

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 0]],
    ...        [[199, 201, 116], [1, 9, 0], [255, 100, 100]],
    ...        [[123, 233, 151], [111, 99, 10], [0, 1, 1]]]
    >>> raw2 = compress(raw)
    >>> raw2
    [[[108, 77, 57], [255, 177, 50]],
     [[117, 166, 80], [0, 1, 1]]]
    """
    h = len(raw)
    w = len(raw[0]) if h > 0 else 0
    new_h = (h + 1) // 2
    new_w = (w + 1) // 2

    out: List[List[List[int]]] = []
    for i in range(new_h):
        r0 = 2 * i
        row: List[List[int]] = []
        for j in range(new_w):
            c0 = 2 * j
            pixels = []
            for dr in (0, 1):
                for dc in (0, 1):
                    rr, cc = r0 + dr, c0 + dc
                    if rr < h and cc < len(raw[rr]):
                        pixels.append(raw[rr][cc])
            r_sum = sum(p[0] for p in pixels)
            g_sum = sum(p[1] for p in pixels)
            b_sum = sum(p[2] for p in pixels)
            n = len(pixels)
            row.append([r_sum // n, g_sum // n, b_sum // n])
        out.append(row)
    return out


def get_raw_image(name: str) -> List[List[List[int]]]:
    """
    Reads an image file and returns pixel data as a nested list of [R,G,B].
    """
    image = Image.open(name).convert("RGB")
    h, w = image.height, image.width
    pixels = image.getdata()
    data: List[List[List[int]]] = []
    for i in range(h):
        row: List[List[int]] = []
        for j in range(w):
            row.append(list(pixels[i * w + j]))
        data.append(row)
    image.close()
    return data


def image_from_raw(raw: List[List[List[int]]], name: str) -> None:
    """
    Writes nested-list RGB pixel data to an image file.
    """
    image = Image.new("RGB", (len(raw[0]), len(raw)))
    flat = [tuple(px) for row in raw for px in row]
    image.putdata(flat)
    image.save(name)


if __name__ == "__main__":
    # Enable doctest and relax whitespace sensitivity for stable verification.
    import doctest
    doctest.testmod(verbose=True,
                    optionflags=doctest.NORMALIZE_WHITESPACE | doctest.ELLIPSIS)
