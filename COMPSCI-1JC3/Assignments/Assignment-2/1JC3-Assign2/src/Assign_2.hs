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

type GaussianRat = (Rational,Rational)

{- -----------------------------------------------------------------
 - gaussReal
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussReal :: GaussianRat -> Rational
gaussReal x = error "TODO implement gaussReal"

{- -----------------------------------------------------------------
 - gaussImag
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussImag :: GaussianRat -> Rational
gaussImag x = error "TODO implement gaussImag"

{- -----------------------------------------------------------------
 - gaussConj
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussConj :: GaussianRat -> GaussianRat
gaussConj x = error "TODO implement gaussConj"

{- -----------------------------------------------------------------
 - gaussAdd
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussAdd :: GaussianRat -> GaussianRat -> GaussianRat
gaussAdd x y = error "TODO implement gaussAdd"


{- -----------------------------------------------------------------
 - gaussMul
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussMul :: GaussianRat -> GaussianRat -> GaussianRat
gaussMul x y = error "TODO implement gaussMul"


{- -----------------------------------------------------------------
 - gaussRecip
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussRecip :: GaussianRat -> GaussianRat
gaussRecip x = error "TODO implement gaussNorm"

{- -----------------------------------------------------------------
 - gaussNorm
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussNorm :: GaussianRat -> Rational
gaussNorm x = error "TODO implement gaussNorm"

{- -----------------------------------------------------------------
 - gaussAddList
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussAddList :: [GaussianRat] -> GaussianRat
gaussAddList x = error "TODO implement gaussAddList"

{- -----------------------------------------------------------------
 - gaussMulList
 - -----------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussMulList :: [GaussianRat] -> GaussianRat
gaussMulList x = error "TODO implement gaussMulList"

{- ------------------------------------------------------------------------
 - gaussCircle
 - ------------------------------------------------------------------------
 - Description:
 -   TODO add comments
 -}
gaussCircle :: [GaussianRat] -> Rational -> [GaussianRat]
gaussCircle x y = error "TODO implement gaussCircle"
