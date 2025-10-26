{-|
Module      : 1JC3-Assign2.Assign_2.hs
Copyright   :  (c) William M. Farmer 2024
License     :  GPL (see the LICENSE file)
Maintainer  :  none
Stability   :  experimental
Portability :  portable

Description:
  Assignment 2 - McMaster CS 1JC3 2025

  Modified by W. M. Farmer 9 October 2025
-}
module Assign_2 where

--------------------------------------------------------------------------------
-- INSTRUCTIONS              README!!!
--------------------------------------------------------------------------------
-- 1) DO NOT DELETE/ALTER ANY CODE ABOVE THESE INSTRUCTIONS
-- 2) DO NOT REMOVE / ALTER TYPE DECLARATIONS (I.E THE LINE WITH THE :: ABOUT
--    THE FUNCTION DECLARATION). IF YOU ARE UNABLE TO COMPLETE A FUNCTION, LEAVE
--    IT'S ORIGINAL IMPLEMENTATION (I.E. THROW AN ERROR)
-- 3) MAKE SURE THE PROJECT COMPILES (I.E. RUN `stack build` AND MAKE SURE THERE
--    ARE NO ERRORS) BEFORE SUBMITTING. FAILURE TO DO SO WILL RESULT IN A MARK
--    OF 0!
-- 4) REPLACE macid = "TODO" WITH YOUR ACTUAL MACID (EX. IF YOUR MACID IS
--    "jim123" THEN `macid = "jim123"`). REMEMBER THAT YOUR MACID IS THE FIRST
--    PART OF YOUR SCHOOL EMAIL (I.E. IF YOUR EMAIL IS "jim123@mcmaster.ca",
--    THEN YOUR MACID IS "jim123"). FAILURE TO DO SO WILL RESULT IN A MARK OF 0!
--------------------------------------------------------------------------------

-- Name: Jonathan Graydon
-- Date: October 23, 2025
macid :: String
macid = "graydj1"

-- | A Gaussian rational a + bi is represented as a pair (a,b)
--   where both a and b are of type 'Rational'.
--   For example, (3, -2) represents 3 - 2i.
type GaussianRat = (Rational,Rational)

{- -----------------------------------------------------------------
 - gaussReal
 - -----------------------------------------------------------------
 - Description:
 -   Extract the real part of a Gaussian rational.
 -   Given x = (a,b) representing a + bi, return a.
 -}
gaussReal :: GaussianRat -> Rational
gaussReal (a,_) = a

{- -----------------------------------------------------------------
 - gaussImag
 - -----------------------------------------------------------------
 - Description:
 -   Extract the imaginary part of a Gaussian rational.
 -   Given x = (a,b) representing a + bi, return b.
 -}
gaussImag :: GaussianRat -> Rational
gaussImag (_,b) = b

{- -----------------------------------------------------------------
 - gaussConj
 - -----------------------------------------------------------------
 - Description:
 -   Compute the complex conjugate.
 -   For x = (a,b) representing a + bi, the conjugate is (a, -b)
 -   representing a - bi.
 -}
gaussConj :: GaussianRat -> GaussianRat
gaussConj (a,b) = (a, negate b)

{- -----------------------------------------------------------------
 - gaussAdd
 - -----------------------------------------------------------------
 - Description:
 -   Add two Gaussian rationals componentwise.
 -   (a0 + b0 i) + (a1 + b1 i) = (a0 + a1) + (b0 + b1) i.
 -}
gaussAdd :: GaussianRat -> GaussianRat -> GaussianRat
gaussAdd (a0,b0) (a1,b1) = (a0 + a1, b0 + b1)

{- -----------------------------------------------------------------
 - gaussMul
 - -----------------------------------------------------------------
 - Description:
 -   Multiply two Gaussian rationals using the distributive law and i^2 = -1.
 -   (a0 + b0 i) * (a1 + b1 i) = (a0*a1 - b0*b1) + (a0*b1 + b0*a1) i.
 -}
gaussMul :: GaussianRat -> GaussianRat -> GaussianRat
gaussMul (a0,b0) (a1,b1) = (a0*a1 - b0*b1, a0*b1 + b0*a1)

{- -----------------------------------------------------------------
 - gaussRecip
 - -----------------------------------------------------------------
 - Description:
 -   Compute the multiplicative inverse (reciprocal), when it exists.
 -   For x = a + b i with (a,b) \neq (0,0),
 -      1/x = (a/(a^2 + b^2)) + (-b/(a^2 + b^2)) i.
 -   If x = 0, raise an error (no multiplicative inverse).
 -}
gaussRecip :: GaussianRat -> GaussianRat
gaussRecip (a,b)
  | a == 0 && b == 0 = error "gaussRecip: division by zero (0 has no reciprocal)"
  | otherwise        = (a/den, negate b/den)
  where
    den = a*a + b*b

{- -----------------------------------------------------------------
 - gaussNorm
 - -----------------------------------------------------------------
 - Description:
 -   Compute the norm N(a + bi) = a^2 + b^2 (a nonnegative Rational).
 -}
gaussNorm :: GaussianRat -> Rational
gaussNorm (a,b) = a*a + b*b

{- -----------------------------------------------------------------
 - gaussAddList
 - -----------------------------------------------------------------
 - Description:
 -   Sum a list of Gaussian rationals using 'gaussAdd'.
 -   By convention, the empty sum is 0, represented as (0,0).
 -}
gaussAddList :: [GaussianRat] -> GaussianRat
gaussAddList []       = (0,0)
gaussAddList (x:rest) = gaussAdd x (gaussAddList rest)

{- -----------------------------------------------------------------
 - gaussMulList
 - -----------------------------------------------------------------
 - Description:
 -   Multiply a list of Gaussian rationals using 'gaussMul'.
 -   By convention, the empty product is 1, represented as (1,0).
 -}
gaussMulList :: [GaussianRat] -> GaussianRat
gaussMulList []       = (1,0)
gaussMulList (x:rest) = gaussMul x (gaussMulList rest)

{- ------------------------------------------------------------------------
 - gaussCircle
 - ------------------------------------------------------------------------
 - Description:
 -   Given a list xs of Gaussian rationals and a nonnegative radius r,
 -   return the sublist of those x in xs whose norm is strictly less than r.
 -}
gaussCircle :: [GaussianRat] -> Rational -> [GaussianRat]
gaussCircle [] _ = []
gaussCircle (x:xs) r
  | gaussNorm x < r = x : gaussCircle xs r
  | otherwise       =     gaussCircle xs r


{-
================================================================================
TEST PLAN
================================================================================

-------------------------------------------------------------------------------
Function: gaussConj
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  (3,  4)
Expected Output: (3, -4)
Actual Output:   (3 % 1,(-4) % 1) ✓

Test Case Number: 2
Input:  (0, -5)
Expected Output: (0,  5)
Actual Output:   (0 % 1,5 % 1) ✓

Test Case Number: 3
Input:  (-7/2, 9/2)
Expected Output: (-7/2, -9/2)
Actual Output:   ((-7) % 2,(-9) % 2) ✓

-------------------------------------------------------------------------------
Function: gaussAdd
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  (1,2) and (3,4)
Expected Output: (4,6)
Actual Output:   (4 % 1,6 % 1) ✓

Test Case Number: 2
Input:  (1/2, 3/2) and (1/3, -3/2)
Expected Output: (1/2 + 1/3, 0)
Actual Output:   (5 % 6,0 % 1) ✓

Test Case Number: 3
Input:  (0,0) and (-5,7)
Expected Output: (-5,7)
Actual Output:   ((-5) % 1,7 % 1) ✓

-------------------------------------------------------------------------------
Function: gaussMul
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  (1,2) and (3,4)
Expected Output: (1*3 - 2*4, 1*4 + 2*3) = (-5, 10)
Actual Output:   ((-5) % 1,10 % 1) ✓

Test Case Number: 2
Input:  (0,1) and (0,1)
Expected Output: (-1,0)
Actual Output:   ((-1) % 1,0 % 1) ✓

Test Case Number: 3
Input:  (2, -3) and (1/2, 1/3)
Expected Output: (2*(1/2) - (-3)*(1/3), 2*(1/3) + (-3)*(1/2))
               = (1 + 1, 2/3 - 3/2) = (2, -5/6)
Actual Output:   (2 % 1,(-5) % 6) ✓

-------------------------------------------------------------------------------
Function: gaussRecip
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  (1,0)
Expected Output: (1,0)
Actual Output:   (1 % 1,0 % 1) ✓

Test Case Number: 2
Input:  (0,1)
Expected Output: (0,-1)
Actual Output:   (0 % 1,(-1) % 1) ✓

Test Case Number: 3
Input:  (3,4)
Expected Output: (3/25, -4/25)
Actual Output:   (3 % 25,(-4) % 25) ✓

-- Edge case (should error): gaussRecip (0,0)

-------------------------------------------------------------------------------
Function: gaussNorm
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  (3,4)
Expected Output: 25
Actual Output:   25 % 1 ✓

Test Case Number: 2
Input:  (0,0)
Expected Output: 0
Actual Output:   0 % 1 ✓

Test Case Number: 3
Input:  (-5/2, 7/3)
Expected Output: (25/4) + (49/9) = (225 + 196) / 36 = 421/36
Actual Output:   421 % 36 ✓

-------------------------------------------------------------------------------
Function: gaussAddList
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  []
Expected Output: (0,0)
Actual Output:   (0 % 1,0 % 1) ✓

Test Case Number: 2
Input:  [(1,2),(3,4),(-1,0)]
Expected Output: (1+3-1, 2+4+0) = (3,6)
Actual Output:   (3 % 1,6 % 1) ✓

Test Case Number: 3
Input:  [(1/2, 1/3), (1/2, -1/3)]
Expected Output: (1,0)
Actual Output:   (1 % 1,0 % 1) ✓

-------------------------------------------------------------------------------
Function: gaussMulList
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  []
Expected Output: (1,0)
Actual Output:   (1 % 1,0 % 1) ✓

Test Case Number: 2
Input:  [(1,1),(1,-1)]
Expected Output: (2,0)
Actual Output:   (2 % 1,0 % 1) ✓

Test Case Number: 3
Input:  [(0,1),(0,1),(0,1),(0,1)]
Expected Output: (1,0)
Actual Output:   (1 % 1,0 % 1) ✓

-------------------------------------------------------------------------------
Function: gaussCircle
-------------------------------------------------------------------------------
Test Case Number: 1
Input:  xs = [(1,0),(0,1),(3,4)], r = 2
Expected Output: [(1,0),(0,1)]
Actual Output:   [(1 % 1,0 % 1),(0 % 1,1 % 1)] ✓

Test Case Number: 2
Input:  xs = [], r = 5
Expected Output: []
Actual Output:   [] ✓

Test Case Number: 3
Input:  xs = [(1/2,1/2),(1,1)], r = 1
Expected Output: [(1/2,1/2)]
Actual Output:   [(1 % 2,1 % 2)] ✓

-}
