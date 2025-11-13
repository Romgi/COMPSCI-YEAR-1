{-|
Module      : 1JC3-Assign3.Assign_3.hs
Copyright   :  (c) William M. Farmer 2025
License     :  GPL (see the LICENSE file)
Maintainer  :  none
Stability   :  experimental
Portability :  portable

Description:
  Assignment 3 - McMaster CS 1JC3 2025
-}
module Assign_3 where

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

-- Name: TODO add name
-- Date: TODO add date
macid :: String
macid = "TODO"

{- -----------------------------------------------------------------
 - LambdaTerm algebraic type
 - -----------------------------------------------------------------
 -}

data LambdaTerm =
    Var Integer
  | FunApp LambdaTerm LambdaTerm
  | FunAbs Integer LambdaTerm
  deriving (Eq,Show)

{- -----------------------------------------------------------------
 - isFreeIn
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
isFreeIn :: LambdaTerm -> LambdaTerm -> Bool
isFreeIn v m = error "TODO implement isFreeIn"

{- -----------------------------------------------------------------
 - freshVarList
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
freshVarList :: [LambdaTerm] -> Integer
freshVarList ms = error "TODO implement freshVarList"

{- -----------------------------------------------------------------
 - sub
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
sub :: LambdaTerm -> LambdaTerm -> LambdaTerm -> LambdaTerm
sub v m n = error "TODO implement sub"

{- -----------------------------------------------------------------
 - isRedex
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
isRedex :: LambdaTerm -> Bool
isRedex m = error "TODO implement isRedex"

{- -----------------------------------------------------------------
 - betaRed
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
betaRed :: LambdaTerm -> LambdaTerm
betaRed m = error "TODO implement betaRed"

{- -----------------------------------------------------------------
 - normOrdRed
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
normOrdRed :: LambdaTerm -> LambdaTerm
normOrdRed (Var i) = error "TODO"
normOrdRed (FunApp m n) =
  let
    headBetaRed o =
      case o of
        (Var i) -> Var i
        (FunApp p q) ->
          case headBetaRed p of
            (FunAbs i p) -> headBetaRed (betaRed (FunApp (FunAbs i p) q))
            p'          -> FunApp p' q
        (FunAbs i p) -> (FunAbs i p)
    in case headBetaRed m of
      FunAbs i p -> normOrdRed (betaRed (FunApp (FunAbs i p) n))
      m'         -> FunApp (normOrdRed m') (normOrdRed n)
normOrdRed (FunAbs i m) = error "TODO"

{- -----------------------------------------------------------------
 - prettyPrint
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
prettyPrint :: LambdaTerm -> String
prettyPrint m = error "TODO implement prettyPrint"

