import sys
import os

sys.path.append(os.path.dirname(__file__))

from assignment1 import (
    is_valid_number,
    is_valid_term,
    degree_of,
    get_coefficient,
    approx_equal,
)

def test_is_valid_number():
    print("Testing is_valid_number...")

    # ✅ Valid integers
    assert is_valid_number("0")
    assert is_valid_number("123")
    assert is_valid_number("-999")

    # ✅ Valid decimals
    assert is_valid_number("3.14")
    assert is_valid_number("-0.001")
    assert is_valid_number(".5")
    assert is_valid_number("5.")
    assert is_valid_number("-5.")
    assert is_valid_number("-.5")

    # 🚫 Invalid decimals
    assert not is_valid_number("12.9.0")
    assert not is_valid_number("..1")
    assert not is_valid_number("1..")
    assert not is_valid_number("-")
    assert not is_valid_number(".")
    assert not is_valid_number("-.")
    assert not is_valid_number("12.-3")

    # 🚫 Invalid non-numeric strings
    assert not is_valid_number("abc")
    assert not is_valid_number("1a2")
    assert not is_valid_number("five")

    print("✅ is_valid_number passed all tests!\n")


def test_is_valid_term():
    print("Testing is_valid_term...")

    # ✅ Degree 0 (numbers only)
    assert is_valid_term("3.14")
    assert is_valid_term("-5")
    assert is_valid_term("0")

    # ✅ Degree 1 (ends with x)
    assert is_valid_term("7x")
    assert is_valid_term("-0.5x")

    # ✅ Degree > 1 (x^n)
    assert is_valid_term("2x^3")
    assert is_valid_term("-3.14x^10")

    # 🚫 Invalid cases
    assert not is_valid_term("7y**8")
    assert not is_valid_term("7*x^8.8")
    assert not is_valid_term("7x^ 8")
    assert not is_valid_term("x^5")
    assert not is_valid_term("7x^0")
    assert not is_valid_term("7x^-2")

    print("✅ is_valid_term passed all tests!\n")


def test_degree_and_coefficient():
    print("Testing degree_of and get_coefficient...")

    # ✅ degree_of
    assert degree_of("55x^6") == 6
    assert degree_of("-1.5x") == 1
    assert degree_of("252.192") == 0

    # ✅ get_coefficient
    assert get_coefficient("55x^6") == 55.0
    assert get_coefficient("-1.5x") == -1.5
    assert get_coefficient("252.192") == 252.192

    print("✅ degree_of and get_coefficient passed all tests!\n")


def test_approx_equal():
    print("Testing approx_equal...")

    # ✅ Tolerance-based equality
    assert approx_equal(5, 4, 1)
    assert not approx_equal(5, 3, 1)
    assert approx_equal(0.999, 1, 0.0011)
    assert not approx_equal(0.999, 1, 0.0001)
    assert approx_equal(-1, -1.0005, 0.001)
    assert not approx_equal(10, 9.8, 0.1)

    print("✅ approx_equal passed all tests!\n")


if __name__ == "__main__":
    print("🔍 Running Assignment 1 Test Cases...\n")
    test_is_valid_number()
    test_is_valid_term()
    test_degree_and_coefficient()
    test_approx_equal()
    print("🎉 All Assignment 1 tests passed successfully!")
