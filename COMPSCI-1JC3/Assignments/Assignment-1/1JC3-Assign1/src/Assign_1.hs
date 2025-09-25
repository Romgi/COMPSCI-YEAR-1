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

-- Name: TODO add name
-- Date: TODO add date
macid :: String
macid = "TODO"

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
cubicQ a b c = error "TODO"

{- -----------------------------------------------------------------
 - cubicR
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicR :: Rational -> Rational -> Rational -> Rational -> Rational
cubicR a b c d = error "TODO"

{- -----------------------------------------------------------------
 - cubicDiscSign
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicDiscSign :: Rational -> Rational -> Int
cubicDiscSign q r =
  let disc = q^^3 + r^^2
  in error "TODO"

{- -----------------------------------------------------------------
 - cubicS
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicS :: Rational -> Rational -> Double
cubicS q r = error "TODO"

{- -----------------------------------------------------------------
 - cubicT
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicT :: Rational -> Rational -> Double
cubicT q r = error "TODO"

{- -----------------------------------------------------------------
 - cubicRealSolutions
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
cubicRealSolutions :: Rational -> Rational -> Rational -> Rational -> [Double]
cubicRealSolutions a b c d
  | a == 0      = []
  | sign == -1  = error "TODO"
  | sign ==  0  = error "TODO"
  | sign ==  1  = error "TODO"
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

-- TODO: Add Test Cases for each of your functions below here
