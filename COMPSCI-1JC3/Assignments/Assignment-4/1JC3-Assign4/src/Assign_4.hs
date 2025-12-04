{-|
Module      : 1JC3-Assign4/src/Assign_4.hs
Copyright   : (c) William M. Farmer 2025
License     : GPL (see the LICENSE file)
Maintainer  : none
Stability   : experimental
Portability : portable
Description : Assignment 4 - McMaster CS 1JC3 2025
-}
module Assign_4 where

import Test.QuickCheck

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

{- --------------------------------------------------------------------
 - Datatype: MathExpr
 - --------------------------------------------------------------------
 - Description: An Abstract Syntax Tree (AST) for encoding mathematical
 -              expressions
 - Example: The expression
 -            (2*X + 1) ^ 3
 -          can be encoded as
 -             Power (Add (Prod (Coef 2) X) (Coef 1)) 3
 -
 - --------------------------------------------------------------------
 -}
data MathExpr a =
    X
  | Coef  a
  | Sum   (MathExpr a) (MathExpr a)
  | Prod  (MathExpr a) (MathExpr a)
  | Quot  (MathExpr a) (MathExpr a)
  | Power (MathExpr a) Integer
  | Abs   (MathExpr a)
  | Exp   (MathExpr a)
  | Log   (MathExpr a)
  deriving (Eq,Show,Read)

{- -----------------------------------------------------------------
 - eval
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
eval :: (Floating a, Eq a) => MathExpr a -> a -> a
eval e v = error "TODO implement eval"

{- -----------------------------------------------------------------
 - instance Num a => Num (MathExpr a)
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
instance Num a => Num (MathExpr a) where
  x + y         = error "TODO implement +"
  x * y         = error "TODO implement *"
  negate x      = error "TODO implement negate"
  abs x         = error "TODO implement abs"
  fromInteger i = error "TODO implement fromInteger"
  signum _      = error "signum is left un-implemented"

{- -----------------------------------------------------------------
 - instance Fractional a => Fractional (MathExpr a)
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
instance Fractional a => Fractional (MathExpr a) where
  e1 / e2        = error "TODO implement (/)"
  fromRational e = error "TODO implement fromRational"

{- -----------------------------------------------------------------
 - instance Floating a => Floating (MathExpr a)
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
instance Floating a => Floating (MathExpr a) where
  pi      = error "TODO implement pi"
  exp   _ = error "TODO implement exp"
  log   _ = error "TODO implement log"
  sin   _ = error "sin is left un-implemented"
  cos   _ = error "cos is left un-implemented"
  tan   _ = error "cos is left un-implemented"
  asin  _ = error "asin is left un-implemented"
  acos  _ = error "acos is left un-implemented"
  atan  _ = error "atan is left un-implemented"
  sinh  _ = error "sinh is left un-implemented"
  cosh  _ = error "cosh is left un-implemented"
  tanh  _ = error "tanh is left un-implemented"
  asinh _ = error "asinh is left un-implemented"
  acosh _ = error "acosh is left un-implemented"
  atanh _ = error "atanh is left un-implemented"
  sqrt  _ = error "sqrt is left un-implemented"

{- -----------------------------------------------------------------
 - diff
 - -----------------------------------------------------------------
 - Description:
 -    TODO add comments
 -}
diff :: (Floating a, Eq a) => MathExpr a -> MathExpr a
diff e = error "TODO implement diff"

{- -----------------------------------------------------------------
 - pretty
 - -----------------------------------------------------------------
 - Description:

 -}
prettyPrint :: (Show a) => MathExpr a -> String
prettyPrint e = error "TODO implement pretty"


{- -----------------------------------------------------------------
 - Test cases for eval, diff, and prettyPrint
 - -----------------------------------------------------------------
 -}

-- TODO: add test cases here  

{- -----------------------------------------------------------------
 - QuickCheck cases for eval and diff
 - -----------------------------------------------------------------
 -}
{- EXAMPLE
 - Function: eval
 - Property: eval (Sum (Coef x) X) y is correct for all x,y
 - Actual Test Result: Pass
 - Code:
-}
(=~) :: (Floating a,Ord a) => a -> a -> Bool
x =~ y = abs (x - y) <= 1e-4

evalProp0 :: (Float,Float) -> Bool
evalProp0 (x,y) = (x + y) =~ eval (Sum (Coef x) X) y

runEvalProp0 :: IO ()
runEvalProp0 = quickCheck evalProp0

-- TODO: add more QuickCheck cases here
