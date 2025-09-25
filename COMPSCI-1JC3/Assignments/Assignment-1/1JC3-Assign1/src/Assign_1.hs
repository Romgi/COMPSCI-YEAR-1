{-|
Module      : 1JC3-Assign1.Assign_1.hs
Copyright   :  (c) Curtis D'Alves 2022
License     :  GPL (see the LICENSE file)
Maintainer  :  none
Stability   :  experimental
Portability :  portable

Description:
  Assignment 1 -- McMaster CS 1JC3 2025.

  Modified by W. M. Farmer 13 September 2025.
-}
module Assign_1 where

-----------------------------------------------------------------------------------------------------------
-- INSTRUCTIONS              README!!!
-----------------------------------------------------------------------------------------------------------
-- 1) DO NOT DELETE/ALTER ANY CODE ABOVE THESE INSTRUCTIONS AND DO NOT ADD ANY IMPORTS
-- 2) DO NOT REMOVE / ALTER TYPE DECLERATIONS (I.E THE LINE WITH THE :: ABOUT THE FUNCTION DECLERATION)
--    IF YOU ARE UNABLE TO COMPLETE A FUNCTION, LEAVE IT'S ORIGINAL IMPLEMENTATION (I.E. THROW AN ERROR)
-- 3) MAKE SURE THE PROJECT COMPILES (I.E. RUN STACK BUILD AND MAKE SURE THERE ARE NO ERRORS) BEFORE
--    SUBMITTING, FAILURE TO DO SO WILL RESULT IN A MARK OF 0
-- 4) REPLACE macid = "TODO" WITH YOUR ACTUAL MACID (EX. IF YOUR MACID IS jim THEN macid = "jim")
-----------------------------------------------------------------------------------------------------------

-- Name: Jonathan Graydon
-- Date: September 25, 2025
macid :: String
macid = "graydj1"

(***) :: Double -> Double -> Double
x *** y = if x >= 0 then x ** y else -((-x) ** y)

(===) :: Double -> Double -> Bool
x === y =
  let tol = 1e-3
  in abs (x-y) <= tol

{- -----------------------------------------------------------------
 - cubicQ
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicQ :: Rational -> Rational -> Rational -> Rational
cubicQ a b c = (3*a*c - b^^2) / (9*a^^2)

{- -----------------------------------------------------------------
 - cubicR
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicR :: Rational -> Rational -> Rational -> Rational -> Rational
cubicR a b c d = (9*a*b*c - 27*a^^2*d - 2*b^^3) / (54*a^^3)

{- -----------------------------------------------------------------
 - cubicDiscSign
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicDiscSign :: Rational -> Rational -> Int
cubicDiscSign q r =
  let disc = q^^3 + r^^2
  in if disc < 0 then -1 else if disc == 0 then 0 else 1

{- -----------------------------------------------------------------
 - cubicS
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicS :: Rational -> Rational -> Double
cubicS q r = (fromRational r + sqrt(fromRational (q^^3 + r^^2))) ** (1/3)

{- -----------------------------------------------------------------
 - cubicT
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicT :: Rational -> Rational -> Double
cubicT q r = (fromRational r - sqrt(fromRational (q^^3 + r^^2))) ** (1/3)

{- -----------------------------------------------------------------
 - findRootX2
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
findRootX1 :: Rational -> Rational -> Rational -> Rational -> Double
findRootX1 a b c d =
  let q = cubicQ a b c
      r = cubicR a b c d
      s = cubicS q r
      t = cubicT q r
  in s + t - (fromRational b) / (3 * fromRational a)

{- -----------------------------------------------------------------
 - findRootX2
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
findRootX2 :: Rational -> Rational -> Rational -> Rational -> Double
findRootX2 a b c d =
  let q = cubicQ a b c
      r = cubicR a b c d
      s = cubicS q r
      t = cubicT q r
  in -((s+t)/2) - (fromRational b) / (3 * fromRational a)

{- -----------------------------------------------------------------
 - cubicRealSolutions
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicRealSolutions :: Rational -> Rational -> Rational -> Rational -> [Double]
cubicRealSolutions a b c d
  | a == 0      = []
  | sign == -1  = []
  | sign ==  0  = [findRootX1 a b c d, findRootX2 a b c d, findRootX2 a b c d]
  | sign ==  1  = [findRootX1 a b c d]
  | otherwise   = []
  where
    sign = cubicDiscSign q r
    s    = cubicS q r
    t    = cubicT q r
    q    = cubicQ a b c
    r    = cubicR a b c d

{- -----------------------------------------------------------------
 - Test Cases
 - -----------------------------------------------------------------
 -}

-- Test cases for cubicQ
test_cubicQ1 = cubicQ 1 2 3        -- Expected:
test_cubicQ2 = cubicQ 2 4 8        -- Expected:

-- Test cases for cubicR
test_cubicR1 = cubicR 1 2 3 4      -- Expected:
test_cubicR2 = cubicR 2 4 8 16     -- Expected: 

-- Test cases for cubicDiscSign
test_cubicDiscSign1 = cubicDiscSign 1 2   -- Expected: 1
test_cubicDiscSign2 = cubicDiscSign 0 0   -- Expected: 0
test_cubicDiscSign3 = cubicDiscSign (-2) 0 -- Expected: -1

-- Test cases for cubicS and cubicT
test_cubicS1 = cubicS 1 2    -- Should compute (2 + sqrt(1+4)) ** (1/3)
test_cubicT1 = cubicT 1 2    -- Should compute (2 + sqrt(1+4)) ** (1/3)

-- Example test for cubicRealSolutions
-- Roots of x^3 - 6x^2 + 11x - 6 = 0 are 1, 2, 3
test_cubicRealSolutions1 = cubicRealSolutions 1 (-6) 11 (-6)  -- Should return [1.0,2.0,3.0]

-- Roots of x^3 + 3x^2 + 3x + 1 = 0 is -1 (triple root)
test_cubicRealSolutions2 = cubicRealSolutions 1 3 3 1         -- Should return [-1.0]

-- Roots of x^3 - 3x + 2 = 0 are -2, 1, 1
test_cubicRealSolutions3 = cubicRealSolutions 1 0 (-3) 2      -- Should return [-2.0,1.0,1.0]

-- Roots of x^3 + x + 1 = 0
test_cubicRealSolutions4 = cubicRealSolutions 1 0 1 1         -- Should return [about -0.6826]
