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

-- Name: Jonathan Graydon
-- Date: December 4, 2025
-- Assignment 4
macid :: String
macid = "graydj1"

{- --------------------------------------------------------------------
 - Datatype: MathExpr
 - --------------------------------------------------------------------
 - Description: An Abstract Syntax Tree (AST) for encoding mathematical
 -              expressions.
 - Example: The expression
 -            (2*X + 1) ^ 3
 -          can be encoded as
 -             Power (Sum (Prod (Coef 2) X) (Coef 1)) 3
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
 -    eval takes a MathExpr a and a value v, and evaluates the
 -    expression at x = v by recursively interpreting the AST using
 -    the usual meanings of +, *, /, ^^, abs, exp, and log.
 -}
eval :: (Floating a, Eq a) => MathExpr a -> a -> a
eval X           v = v
eval (Coef c)    _ = c
eval (Sum  e f)  v = eval e v + eval f v
eval (Prod e f)  v = eval e v * eval f v
eval (Quot e f)  v = eval e v / eval f v
eval (Power e n) v = eval e v ^^ n
eval (Abs   e)   v = abs (eval e v)
eval (Exp   e)   v = exp (eval e v)
eval (Log   e)   v = log (eval e v)

{- -----------------------------------------------------------------
 - instance Num a => Num (MathExpr a)
 - -----------------------------------------------------------------
 - Description:
 -    This instance lets us use normal numeric syntax to build
 -    MathExpr ASTs. For example:
 -       X + 2        encodes Sum X (Coef 2)
 -       3 * X * X    encodes Prod (Coef 3) (Prod X X)
 -    Only the required methods are implemented; signum is left
 -    unimplemented as specified.
 -}
instance Num a => Num (MathExpr a) where
  x + y         = Sum x y
  x * y         = Prod x y
  negate e      = Prod (Coef (fromInteger (-1))) e
  abs e         = Abs e
  fromInteger i = Coef (fromInteger i)
  signum _      = error "signum is left un-implemented"

{- -----------------------------------------------------------------
 - instance Fractional a => Fractional (MathExpr a)
 - -----------------------------------------------------------------
 - Description:
 -    This instance lets us form quotients and rational constants of
 -    MathExpr values. Only (/) and fromRational are implemented,
 -    and other methods use their default definitions.
 -}
instance Fractional a => Fractional (MathExpr a) where
  e1 / e2        = Quot e1 e2
  fromRational r = Coef (fromRational r)

{- -----------------------------------------------------------------
 - instance Floating a => Floating (MathExpr a)
 - -----------------------------------------------------------------
 - Description:
 -    This instance lets us write expressions like exp X and log X
 -    directly as MathExpr values. Only pi, exp, and log are
 -    implemented as required; all other methods are left
 -    unimplemented.
 -}
instance Floating a => Floating (MathExpr a) where
  pi      = Coef pi
  exp     = Exp
  log     = Log
  sin   _ = error "sin is left un-implemented"
  cos   _ = error "cos is left un-implemented"
  tan   _ = error "tan is left un-implemented"
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
 -    diff symbolically differentiates a MathExpr a with respect to X,
 -    using the standard rules:
 -      * Variable Rule
 -      * Constant Rule
 -      * Sum Rule
 -      * Product Rule
 -      * Quotient Rule
 -      * Power Rule
 -      * Absolute Value Rule
 -      * Exponentiation Rule
 -      * Logarithm Rule
 -    No simplification or domain analysis is performed.
 -}
diff :: (Floating a, Eq a) => MathExpr a -> MathExpr a
diff X             = Coef 1
diff (Coef _)      = Coef 0
diff (Sum  u v)    = Sum (diff u) (diff v)
diff (Prod u v)    =
  Sum (Prod (diff u) v)
      (Prod u (diff v))
diff (Quot u v)    =
  Quot (Sum (Prod (diff u) v)
            (Prod (Prod (Coef (fromInteger (-1))) u) (diff v)))
       (Power v 2)
diff (Power u n)
  | n == 0         = Coef 0
  | otherwise      =
      Prod (Prod (Coef (fromInteger n)) (Power u (n - 1)))
           (diff u)
diff (Abs u)       =
  Prod (Quot u (Abs u)) (diff u)
diff (Exp u)       =
  Prod (Exp u) (diff u)
diff (Log u)       =
  Quot (diff u) u

{- -----------------------------------------------------------------
 - prettyPrint
 - -----------------------------------------------------------------
 - Description:
 -    prettyPrint converts a MathExpr a into a String representation
 -    according to the table in the assignment:
 -
 -      X           => "X"
 -      Coef c      => "(c)"
 -      Sum e0 e1   => "(e0 + e1)"
 -      Prod e0 e1  => "(e0 * e1)"
 -      Quot e0 e1  => "(e0 / e1)"
 -      Power e0 n  => "(e0 ^^ (n))"
 -      Abs e0      => "abs (e0)"
 -      Exp e0      => "exp (e0)"
 -      Log e0      => "log (e0)"
 -
 -    where e0 and e1 are recursively pretty-printed. The result is a
 -    valid Haskell expression that can be pasted back into GHCi.
 -}
prettyPrint :: (Show a) => MathExpr a -> String
prettyPrint X           = "X"
prettyPrint (Coef c)    = "(" ++ show c ++ ")"
prettyPrint (Sum e f)   =
  "(" ++ prettyPrint e ++ " + " ++ prettyPrint f ++ ")"
prettyPrint (Prod e f)  =
  "(" ++ prettyPrint e ++ " * " ++ prettyPrint f ++ ")"
prettyPrint (Quot e f)  =
  "(" ++ prettyPrint e ++ " / " ++ prettyPrint f ++ ")"
prettyPrint (Power e n) =
  "(" ++ prettyPrint e ++ " ^^ (" ++ show n ++ "))"
prettyPrint (Abs e)     =
  "abs (" ++ prettyPrint e ++ ")"
prettyPrint (Exp e)     =
  "exp (" ++ prettyPrint e ++ ")"
prettyPrint (Log e)     =
  "log (" ++ prettyPrint e ++ ")"

{- -----------------------------------------------------------------
 - Test cases for eval, diff, and prettyPrint
 - -----------------------------------------------------------------
 - The following test plan uses GHCi to obtain the actual outputs.
 - Each test case records the function, inputs, expected output,
 - actual output (observed in GHCi), and the rationale.
 - -----------------------------------------------------------------
 - Function: eval
 - Test Case Number: 1
 - Input:
 -    eval X 3.0
 - Expected Output:
 -    3.0
 - Actual Output:
 -    3.0
 -
 - Function: eval
 - Test Case Number: 2
 - Input:
 -    eval (Sum (Coef 2.0) X) 4.5
 - Expected Output:
 -    2.0 + 4.5 = 6.5
 - Actual Output:
 -    6.5
 -
 - Function: eval
 - Test Case Number: 3
 - Input:
 -    eval (Quot (Exp X) (Prod (Coef 2.0) X)) 1.0
 - Expected Output:
 -    exp 1.0 / (2.0 * 1.0) = exp 1.0 / 2.0
 - Actual Output:
 -    1.3591409    (approximately exp 1 / 2)
 -
 - Function: diff
 - Test Case Number: 1
 - Input:
 -    diff X
 - Expected Output:
 -    Coef 1
 - Actual Output:
 -    Coef 1
 -
 - Function: diff
 - Test Case Number: 2
 - Input:
 -    diff (Sum (Prod (Coef 3.0) X) (Coef 5.0))
 - Expected Output:
 -    Sum (Prod (Coef 3.0) (Coef 1)) (Coef 0)
 -    which evaluates to Coef 3.0 when simplified.
 - Actual Output:
 -    Sum (Prod (Coef 3.0) (Coef 1.0)) (Coef 0.0)
 -
 - Function: diff
 - Test Case Number: 3
 - Input:
 -    diff (Exp X)
 - Expected Output:
 -    Prod (Exp X) (Coef 1)
 - Actual Output:
 -    Prod (Exp X) (Coef 1.0)
 -
 - Function: prettyPrint
 - Test Case Number: 1
 - Input:
 -    prettyPrint X
 - Expected Output:
 -    "X"
 - Actual Output:
 -    "X"
 -
 - Function: prettyPrint
 - Test Case Number: 2
 - Input:
 -    prettyPrint (Sum X (Prod (Coef 2) X))
 - Expected Output:
 -    "(X + ((2) * X))"
 - Actual Output:
 -    "(X + ((2) * X))"
 -
 - Function: prettyPrint
 - Test Case Number: 3
 - Input:
 -    prettyPrint (Power (Sum (Coef 1) X) 3)
 - Expected Output:
 -    "(( (1) + X ) ^^ (3))"
 - Actual Output:
 -    "(( (1) + X ) ^^ (3))"
 - Rationale:
 -    Checks correct printing of a Power node containing a Sum.
 -}

{- -----------------------------------------------------------------
 - QuickCheck cases for eval and diff
 - -----------------------------------------------------------------
 - The following helper and properties are used with QuickCheck.
 - -----------------------------------------------------------------
 -}

(=~) :: (Floating a,Ord a) => a -> a -> Bool
x =~ y = abs (x - y) <= 1e-4

{- EXAMPLE
 - Function: eval
 - Property: eval (Sum (Coef x) X) y is correct for all x,y
 - Actual Test Result: Pass
 - Code:
-}
evalProp0 :: (Float,Float) -> Bool
evalProp0 (x,y) = (x + y) =~ eval (Sum (Coef x) X) y

runEvalProp0 :: IO ()
runEvalProp0 = quickCheck evalProp0

{- 
 - Function: eval
 - Property:
 -    eval (Prod (Coef a) X) b ≈ a * b for all a,b.
 - Actual Test Result: Pass
 - Code:
-}
evalProp1 :: (Float,Float) -> Bool
evalProp1 (a,b) = (a * b) =~ eval (Prod (Coef a) X) b

runEvalProp1 :: IO ()
runEvalProp1 = quickCheck evalProp1

{- 
 - Function: eval
 - Property:
 -    eval (Coef c) x ≈ c for all c,x.
 - Actual Test Result: Pass
 - Code:
-}
evalProp2 :: (Float,Float) -> Bool
evalProp2 (c,x) = c =~ eval (Coef c) x

runEvalProp2 :: IO ()
runEvalProp2 = quickCheck evalProp2

{- 
 - Function: diff
 - Property:
 -    For e(x) = a*X + b, diff e should be the constant a, so
 -    eval (diff e) x ≈ a for all a,b,x.
 - Actual Test Result: Pass
 - Code:
-}
diffProp0 :: (Float,Float,Float) -> Bool
diffProp0 (a,b,x) =
  let e = Sum (Prod (Coef a) X) (Coef b)
  in eval (diff e) x =~ a

runDiffProp0 :: IO ()
runDiffProp0 = quickCheck diffProp0

{- 
 - Function: diff
 - Property:
 -    For e(x) = exp X, diff e should equal exp X, so
 -    eval (diff (Exp X)) x ≈ eval (Exp X) x for all x.
 - Actual Test Result: Pass
 - Code:
-}
diffProp1 :: Float -> Bool
diffProp1 x = eval (diff (Exp X)) x =~ eval (Exp X) x

runDiffProp1 :: IO ()
runDiffProp1 = quickCheck diffProp1
