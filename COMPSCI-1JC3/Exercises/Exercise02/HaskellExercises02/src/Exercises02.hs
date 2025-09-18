{-|
Module      : HaskellExercises02.Exercises02
Copyright   :  (c) Curtis D'Alves 2020
License     :  GPL (see the LICENSE file)
Maintainer  :  none
Stability   :  experimental
Portability :  portable

Description:
  Haskell exercise template Set 02 - McMaster CS 1JC3 2021
-}
module Exercises02 where

import Prelude hiding ((||),(&&),abs)

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
-- 4) REPLACE macid = "TODO" WITH YOUR ACTUAL MACID (EX. IF YOUR MACID IS "jim"
--    THEN `macid = "jim"`). REMEMBER THAT YOUR MACID IS THE FIRST PART OF YOUR
--    SCHOOL EMAIL (I.E. IF YOUR EMAIL IS "jim@mcmaster.ca", THEN YOUR MACID IS
--    "jim").
--------------------------------------------------------------------------------

macid :: String
macid = "TODO"

-- NOTE: For the boolean exercises, you can find reference truth tables on
-- Wikipedia: https://en.wikipedia.org/wiki/Truth_table

-- Exercise A
--------------------------------------------------------------------------------
-- Implement Logical disjunction (OR) using pattern matching.
--
-- You may change the function declaration (pattern match on the arguments),
-- just don't change the type declaration.
--------------------------------------------------------------------------------
(||) :: Bool -> Bool -> Bool
x || y = error "TODO implement ||"

-- Exercise B
--------------------------------------------------------------------------------
-- Implement Logical NAND using pattern matching. NAND is the negation of AND.
--------------------------------------------------------------------------------
nand :: Bool -> Bool -> Bool
nand x y = error "TODO: implement nand"

-- Exercise C
--------------------------------------------------------------------------------
-- Implement Logical implication using pattern matching
--------------------------------------------------------------------------------
(==>) :: Bool -> Bool -> Bool
x ==> y = error "TODO implement ==>"

-- Exercise D
--------------------------------------------------------------------------------
-- Implement the function absVal that returns the absolute value of a number
--------------------------------------------------------------------------------
absVal :: (Num a, Ord a) => a -> a
absVal x = error "TODO implement absVal"

-- Exercise E
--------------------------------------------------------------------------------
-- Implement a function that compares two floating point numbers, and returns
-- True if they are within a tolerance of 1e-4 of each other.
--
-- NOTE: In general, you should use an operator like this instead of == on two
-- floating point numbers. However, you'll need to adjust the tolerance to suit
-- different contexts.
--------------------------------------------------------------------------------
(~=) :: (Floating a,Ord a) => a -> a -> Bool
x ~= y = error "TODO implement ~="

-- Exercise F
--------------------------------------------------------------------------------
-- Implement a function rotate that moves the first element of a list to the
-- back. If the list is empty or has one element, it should remain unchanged.
--------------------------------------------------------------------------------
rotate :: [a] -> [a]
rotate xs = error "TODO implement rotate"

-- Exercise G
--------------------------------------------------------------------------------
-- Implement a function 'squares' that takes a list of integers and returns a
-- list of their squares.
--
-- You should use the 'map' function combined with a lambda expression to do the
-- squaring.
--------------------------------------------------------------------------------
squares :: Num a => [a] -> [a]
squares xs = error "TODO implement squares"
