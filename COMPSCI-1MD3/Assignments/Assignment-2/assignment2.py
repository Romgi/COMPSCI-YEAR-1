
from PIL import Image
from typing import List


def mirror(raw: List[List[List[int]]])-> None:
    """
    Assume raw is image data. Modifies raw by reversing all the rows
    of the data.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 255]],
               [[199, 201, 116], [1, 9, 0], [255, 255, 255]]]
    >>> mirror(raw)
    >>> raw
    [[[255, 255, 255], [0, 0, 0], [233, 100, 115]],
     [[255, 255, 255], [1, 9, 0], [199, 201, 116]]]
    """
    # Reverse each row in-place
    for row in raw:
        row.reverse()
    return


def grey(raw: List[List[List[int]]])-> None:
    """
    Assume raw is image data. Modifies raw "averaging out" each
    pixel of raw. Specifically, for each pixel it totals the RGB
    values, integer divides by three, and sets the all RGB values
    equal to this new value

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 255]],
               [[199, 201, 116], [1, 9, 0], [255, 255, 255]]]
    >>> grey(raw)
    >>> raw
    [[[149, 149, 149], [0, 0, 0], [255, 255, 255]],
     [[172, 172, 172], [3, 3, 3], [255, 255, 255]]]
    """
    # For each pixel, set all channels to the integer average
    for i in range(len(raw)):
        for j in range(len(raw[i])):
            r, g, b = raw[i][j]
            avg = (r + g + b) // 3
            raw[i][j] = [avg, avg, avg]
    return


def invert(raw: List[List[List[int]]])->None:
    """
    Assume raw is image data. Modifies raw inverting each pixel.
    To invert a pixel, you swap all the max values, with all the
    minimum values. See the doc tests for examples.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 0]],
               [[199, 201, 116], [1, 9, 0], [255, 100, 100]]]
    >>> invert(raw)
    >>> raw
    [[[100, 233, 115], [0, 0, 0], [0, 0, 255]],
     [[199, 116, 201], [1, 0, 9], [100, 255, 255]]]
    """
    # For each pixel, swap occurrences of min and max channel values
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


def merge(raw1: List[List[List[int]]], raw2: List[List[List[int]]])-> List[List[List[int]]]:
    """
    Merges raw1 and raw2 into new raw image data and returns it.
    It merges them using the following rule/procedure.
    1) The new raw image data has height equal to the max height of raw1 and raw2
    2) The new raw image data has width equal to the max width of raw1 and raw2
    3) The pixel data at cell (i,j) in the new raw image data will be (in this order):
       3.1) a black pixel [0, 0, 0], if there is no pixel data in raw1 or raw2
       at cell (i,j)
       3.2) raw1[i][j] if there is no pixel data at raw2[i][j]
       3.3) raw2[i][j] if there is no pixel data at raw1[i][j]
       3.4) raw1[i][j] if i is even
       3.5) raw2[i][j] if i is odd
    """
    h1 = len(raw1)
    h2 = len(raw2)
    w1 = len(raw1[0]) if h1 > 0 else 0
    w2 = len(raw2[0]) if h2 > 0 else 0

    H = max(h1, h2)
    W = max(w1, w2)

    result: List[List[List[int]]] = []
    for i in range(H):
        row: List[List[int]] = []
        for j in range(W):
            has1 = (i < h1) and (j < (len(raw1[i]) if i < h1 else 0))
            has2 = (i < h2) and (j < (len(raw2[i]) if i < h2 else 0))
            if not has1 and not has2:
                row.append([0, 0, 0])
            elif has1 and not has2:
                row.append(raw1[i][j])
            elif has2 and not has1:
                row.append(raw2[i][j])
            else:
                row.append(raw1[i][j] if i % 2 == 0 else raw2[i][j])
        result.append(row)
    return result


def compress(raw: List[List[List[int]]])-> List[List[List[int]]]:
    """
    Compresses raw by going through the pixels and combining a pixel with
    the ones directly to the right, below and diagonally to the lower right.
    For each RGB values it takes the average of these four pixels using integer
    division. If is is a pixel on the "edge" of the image, it only takes the
    relevant pixels to average across. See the second doctest for an example of
    this.

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 0], [3, 6, 7]],
               [[199, 201, 116], [1, 9, 0], [255, 100, 100], [99, 99, 0]],
               [[200, 200, 200], [1, 9, 0], [255, 100, 100], [99, 99, 0]],
               [[50, 100, 150], [1, 9, 0], [211, 5, 22], [199, 0, 10]]]
    >>> raw1 = compress(raw)
    >>> raw1
    [[[108, 77, 57], [153, 115, 26]],
     [[63, 79, 87], [191, 51, 33]]]

    >>> raw = [[[233, 100, 115], [0, 0, 0], [255, 255, 0]],
               [[199, 201, 116], [1, 9, 0], [255, 100, 100]],
               [[123, 233, 151], [111, 99, 10], [0, 1, 1]]]
    >>> raw2 = compress(raw)
    >>> raw2
    [[[108, 77, 57], [255, 177, 50]],
     [[117, 166, 80], [0, 1, 1]]]
    """
    h = len(raw)
    w = len(raw[0]) if h > 0 else 0

    # New dimensions are ceil(h/2) x ceil(w/2)
    new_h = (h + 1) // 2
    new_w = (w + 1) // 2

    result: List[List[List[int]]] = []
    for i in range(new_h):
        row: List[List[int]] = []
        r0 = 2 * i
        for j in range(new_w):
            c0 = 2 * j
            # Collect up to four pixels: (r0,c0), (r0,c0+1), (r0+1,c0), (r0+1,c0+1)
            pixels = []
            for dr in (0, 1):
                for dc in (0, 1):
                    rr = r0 + dr
                    cc = c0 + dc
                    if rr < h and cc < len(raw[rr]):
                        pixels.append(raw[rr][cc])
            # Average each channel across the collected pixels
            r_sum = sum(p[0] for p in pixels)
            g_sum = sum(p[1] for p in pixels)
            b_sum = sum(p[2] for p in pixels)
            count = len(pixels)
            row.append([r_sum // count, g_sum // count, b_sum // count])
        result.append(row)
    return result


"""
**********************************************************

Do not worry about the code below. However, if you wish,
you can us it to read in images, modify the data, and save
new images.

**********************************************************
"""

def get_raw_image(name: str)-> List[List[List[int]]]:
    
    image = Image.open(name)
    num_rows = image.height
    num_columns = image.width
    pixels = image.getdata()
    new_data = []
    
    for i in range(num_rows):
        new_row = []
        for j in range(num_columns):
            new_pixel = list(pixels[i*num_columns + j])
            new_row.append(new_pixel)
        new_data.append(new_row)

    image.close()
    return new_data


def image_from_raw(raw: List[List[List[int]]], name: str)->None:
    image = Image.new("RGB", (len(raw[0]),len(raw)))
    pixels = []
    for row in raw:
        for pixel in row:
            pixels.append(tuple(pixel))
    image.putdata(pixels)
    image.save(name)
