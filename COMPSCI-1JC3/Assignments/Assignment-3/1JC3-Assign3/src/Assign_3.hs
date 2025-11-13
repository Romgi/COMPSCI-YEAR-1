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

-- Name: Jonathan Graydon
-- Date: November 13, 2025
macid :: String
macid = "graydj1"

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
 -    Returns True iff the first argument is a variable that occurs free
 -    in the second lambda term; otherwise returns False.
 -}
isFreeIn :: LambdaTerm -> LambdaTerm -> Bool
isFreeIn v m =
  case v of
    Var x -> freeIn x m
    _     -> False

{- -----------------------------------------------------------------
 - freshVarList
 - -----------------------------------------------------------------
 - Description:
 -    Given a list of lambda terms, returns an Integer representing a
 -    variable that does not occur (bound or free) in any of them.
 -}
freshVarList :: [LambdaTerm] -> Integer
freshVarList ms =
  let
    varsIn :: LambdaTerm -> [Integer]
    varsIn (Var i)       = [i]
    varsIn (FunApp a b)  = varsIn a ++ varsIn b
    varsIn (FunAbs i m)  = i : varsIn m

    allVars = concatMap varsIn ms
  in if null allVars then 0 else maximum allVars + 1

{- -----------------------------------------------------------------
 - sub
 - -----------------------------------------------------------------
 - Description:
 -    sub v x n returns the result of substituting v for the variable x
 -    in n, using capture-avoiding substitution as in the assignment
 -    description. If the second argument is not a variable, the third
 -    argument is returned unchanged.
 -}
sub :: LambdaTerm -> LambdaTerm -> LambdaTerm -> LambdaTerm
sub v m n =
  case m of
    Var x -> sub' x v n
    _     -> n

-- Helper function: check if an Integer variable is free in a LambdaTerm
freeIn :: Integer -> LambdaTerm -> Bool
freeIn x (Var y)       = x == y
freeIn x (FunApp a b)  = freeIn x a || freeIn x b
freeIn x (FunAbs y m)
  | x == y    = False
  | otherwise = freeIn x m

-- Helper function: capture-avoiding substitution [x ↦ m] on a lambda term
sub' :: Integer -> LambdaTerm -> LambdaTerm -> LambdaTerm
sub' x m (Var y)
  | x == y    = m
  | otherwise = Var y
sub' x m (FunApp a b) = FunApp (sub' x m a) (sub' x m b)
sub' x m (FunAbs y n)
  | x == y = FunAbs y n                          -- S4
  | not (freeIn y m) = FunAbs y (sub' x m n)     -- S5
  | otherwise =                                   -- S6: alpha-rename to avoid capture
      let y' = freshVarList [m, FunAbs y n]
          n' = sub' y (Var y') n                 -- rename bound occurrences of y to y'
      in FunAbs y' (sub' x m n')

{- -----------------------------------------------------------------
 - isRedex
 - -----------------------------------------------------------------
 - Description:
 -    Returns True iff its argument is a beta-redex of the form
 -    (FunApp (FunAbs x body) arg).
 -}
isRedex :: LambdaTerm -> Bool
isRedex (FunApp (FunAbs _ _) _) = True
isRedex _                       = False

{- -----------------------------------------------------------------
 - betaRed
 - -----------------------------------------------------------------
 - Description:
 -    Performs one beta-reduction step on a redex. If the argument is
 -    not a redex, it is returned unchanged.
 -}
betaRed :: LambdaTerm -> LambdaTerm
betaRed (FunApp (FunAbs x n) m) = sub m (Var x) n
betaRed t                       = t

{- -----------------------------------------------------------------
 - normOrdRed
 - -----------------------------------------------------------------
 - Description:
 -    Normal order reduction: repeatedly reduces the leftmost outermost
 -    redex until a normal form is reached (if it exists). May not
 -    terminate for some lambda terms.
 -}
normOrdRed :: LambdaTerm -> LambdaTerm
normOrdRed (Var i) = Var i
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
normOrdRed (FunAbs i m) = FunAbs i (normOrdRed m)

{- -----------------------------------------------------------------
 - prettyPrint
 - -----------------------------------------------------------------
 - Description:
 -    Produces a readable string representation of a lambda term using
 -    variables named x1, x2, ... . For example,
 -
 -      prettyPrint (FunApp (FunAbs 1 (Var 1)) (Var 2))
 -
 -    yields:
 -
 -      "((lambda x1 . x1) x2)."
 -}
prettyPrint :: LambdaTerm -> String
prettyPrint m = prettyTerm m ++ "."

-- Helper pretty-printer (without trailing period)
prettyTerm :: LambdaTerm -> String
prettyTerm (Var i)      = "x" ++ show i
prettyTerm (FunApp a b) = "(" ++ prettyTerm a ++ " " ++ prettyTerm b ++ ")"
prettyTerm (FunAbs i m) = "(lambda x" ++ show i ++ " . " ++ prettyTerm m ++ ")"

{- -----------------------------------------------------------------
 - Test Plan
 - -----------------------------------------------------------------

Function: isFreeIn
Test Case Number: 1
Input: isFreeIn (Var 1) (Var 1)
Expected Output: True
Actual Output: True

Test Case Number: 2
Input: isFreeIn (Var 1) (FunAbs 1 (Var 1))
Expected Output: False
Actual Output: False

Test Case Number: 3
Input: isFreeIn (Var 2) (FunApp (FunAbs 1 (Var 1)) (Var 2))
Expected Output: True
Actual Output: True

Function: freshVarList
Test Case Number: 1
Input: freshVarList [Var 1, Var 2, Var 3]
Expected Output: 4
Actual Output: 4

Test Case Number: 2
Input: freshVarList [FunAbs 1 (Var 1), FunApp (Var 2) (Var 3)]
Expected Output: 4
Actual Output: 4

Test Case Number: 3
Input: freshVarList []
Expected Output: 0
Actual Output: 0

Function: sub
Test Case Number: 1
Input: sub (Var 2) (Var 1) (Var 1)
Expected Output: Var 2
Actual Output: Var 2

Test Case Number: 2
Input: sub (Var 2) (Var 1) (FunApp (Var 1) (Var 3))
Expected Output: FunApp (Var 2) (Var 3)
Actual Output: FunApp (Var 2) (Var 3)

Test Case Number: 3
Input: sub (Var 2) (Var 1) (FunAbs 1 (FunApp (Var 1) (Var 2)))
Expected Output: FunAbs 1 (FunApp (Var 1) (Var 2))
Actual Output: FunAbs 1 (FunApp (Var 1) (Var 2))

Function: isRedex
Test Case Number: 1
Input: isRedex (FunApp (FunAbs 1 (Var 1)) (Var 2))
Expected Output: True
Actual Output: True

Test Case Number: 2
Input: isRedex (Var 1)
Expected Output: False
Actual Output: False

Test Case Number: 3
Input: isRedex (FunAbs 1 (Var 1))
Expected Output: False
Actual Output: False

Function: betaRed
Test Case Number: 1
Input: betaRed (FunApp (FunAbs 1 (Var 1)) (Var 2))
Expected Output: Var 2
Actual Output: Var 2

Test Case Number: 2
Input: betaRed (FunApp (FunAbs 1 (FunApp (Var 1) (Var 1))) (Var 2))
Expected Output: FunApp (Var 2) (Var 2)
Actual Output: FunApp (Var 2) (Var 2)

Test Case Number: 3
Input: betaRed (Var 1)
Expected Output: Var 1
Actual Output: Var 1

Function: normOrdRed
Test Case Number: 1
Input: normOrdRed (Var 1)
Expected Output: Var 1
Actual Output: Var 1

Test Case Number: 2
Input: normOrdRed (FunApp (FunAbs 1 (Var 1)) (Var 2))
Expected Output: Var 2
Actual Output: Var 2

Test Case Number: 3
Input: normOrdRed (FunApp (FunAbs 1 (FunApp (Var 1) (Var 1))) (Var 2))
Expected Output: FunApp (Var 2) (Var 2)
Actual Output: FunApp (Var 2) (Var 2)

Function: prettyPrint
Test Case Number: 1
Input: prettyPrint (Var 1)
Expected Output: "x1."
Actual Output: "x1."

Test Case Number: 2
Input: prettyPrint (FunAbs 1 (Var 1))
Expected Output: "(lambda x1 . x1)."
Actual Output: "(lambda x1 . x1)."

Test Case Number: 3
Input: prettyPrint (FunApp (FunAbs 1 (Var 1)) (Var 2))
Expected Output: "((lambda x1 . x1) x2)."
Actual Output: "((lambda x1 . x1) x2)."

-}
