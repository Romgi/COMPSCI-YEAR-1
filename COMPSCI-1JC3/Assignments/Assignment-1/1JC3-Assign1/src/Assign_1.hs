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
-- Assignment 1
macid :: String
macid = "graydj1"

(***) :: Double -> Double -> Double
x *** y = if x >= 0 then x ** y else -((-x) ** y)

(===) :: Double -> Double -> Bool
x === y =
  let tol = 1e-3
  in abs (x-y) <= tol

{- -----------------------------------------------------------------
 - cbrt
 - -----------------------------------------------------------------
 - Description: Helper function that computes the cube root of a Double. Works for both positive and negative inputs.
 -}
cbrt :: Double -> Double
cbrt x = if x >= 0 then x ** (1/3) else -((-x) ** (1/3))

{- -----------------------------------------------------------------
 - cubicQ
 - -----------------------------------------------------------------
 - Description: Computes the value of Q for the cubic equation
 -}
cubicQ :: Rational -> Rational -> Rational -> Rational
cubicQ a b c = (3*a*c - b^^2) / (9*a^^2)

{- -----------------------------------------------------------------
 - cubicR
 - -----------------------------------------------------------------
 - Description: Computes the value of R for the cubic equation
 -}
cubicR :: Rational -> Rational -> Rational -> Rational -> Rational
cubicR a b c d = (9*a*b*c - 27*a^^2*d - 2*b^^3) / (54*a^^3)

{- -----------------------------------------------------------------
 - cubicDiscSign
 - -----------------------------------------------------------------
 - Description: Computes the sign of the discriminant for the cubic equation
 -}
cubicDiscSign :: Rational -> Rational -> Int
cubicDiscSign q r =
  let disc = q^^3 + r^^2
  in if disc < 0 then -1
   else if disc == 0 then 0 
   else 1

{- -----------------------------------------------------------------
 - cubicS
 - -----------------------------------------------------------------
 - Description: Computes the value of S for the cubic equation
 -}
cubicS :: Rational -> Rational -> Double
cubicS q r =
  let disc = fromRational (q^^3 + r^^2)
  in if disc < 0 then 0/0
    else cbrt (fromRational r + sqrt disc)

{- -----------------------------------------------------------------
 - cubicT
 - -----------------------------------------------------------------
 - Description: Computes the value of T for the cubic equation
 -}
cubicT :: Rational -> Rational -> Double
cubicT q r =
  let disc = fromRational (q^^3 + r^^2)
  in if disc < 0
    then 0/0
    else cbrt (fromRational r - sqrt disc)

{- -----------------------------------------------------------------
 - cubicRealSolutions
 - -----------------------------------------------------------------
 - Description: Computes the real solutions of the cubic equation
 -}
cubicRealSolutions :: Rational -> Rational -> Rational -> Rational -> [Double]
cubicRealSolutions a b c d
  | a == 0      = []
  | sign == -1  = []
  | sign ==  0  = [x1, x2, x2]
  | sign ==  1  = [x1]
  | otherwise   = []
  where
    q    = cubicQ a b c
    r    = cubicR a b c d
    sign = cubicDiscSign q r
    s    = cubicS q r
    t    = cubicT q r
    x1   = s + t - fromRational b / (3 * fromRational a)
    x2   = -((s+t)/2) - fromRational b / (3 * fromRational a)

{- -----------------------------------------------------------------
 - Test Cases
 - -----------------------------------------------------------------
 -}

-- Test cases for cubicQ
test_cubicQ1 = cubicQ 1 2 3
test_cubicQ2 = cubicQ 2 4 8

-- Test cases for cubicR
test_cubicR1 = cubicR 1 2 3 4
test_cubicR2 = cubicR 2 4 8 16

-- Test cases for cubicDiscSign
test_cubicDiscSign1 = cubicDiscSign 1 2
test_cubicDiscSign2 = cubicDiscSign 0 0
test_cubicDiscSign3 = cubicDiscSign (-2) 0

-- Test cases for cubicS and cubicT
test_cubicS1 = cubicS 1 2
test_cubicT1 = cubicT 1 2

-- Example tests for cubicRealSolutions
test_cubicRealSolutions1 = cubicRealSolutions 1 (-6) 11 (-6) 
test_cubicRealSolutions2 = cubicRealSolutions 1 3 3 1
test_cubicRealSolutions3 = cubicRealSolutions 1 0 (-3) 2
test_cubicRealSolutions4 = cubicRealSolutions 1 0 1 1
