{-# LANGUAGE ExistentialQuantification #-}
{-|
Module      : HaskellExercises02.Spec
Copyright   :  (c) Curtis D'Alves 2020
License     :  GPL (see the LICENSE file)
Maintainer  :  none
Stability   :  experimental
Portability :  portable

Description:
  Contains Quickcheck tests for Exercises02 and a main function that runs each tests and prints the results
-}
module Main where

import qualified Exercises02 as E2
import Test.QuickCheck (quickCheck
                       ,quickCheckResult
                       ,quickCheckWithResult
                       ,stdArgs
                       ,maxSuccess
                       ,Result(Success)
                       ,within
                       ,Testable
                       ,withMaxSuccess)
import Test.Hspec (hspec, describe, it)
import Test.QuickCheck.Property (property)

-------------------------------------------------------------------------------------------
-- * QuickCheck Tests

-- | Boolean implication
(==>) :: Bool -> Bool -> Bool
x ==> y = not x || y
infixr 4 ==>

-- | QuickCheck proposition for testing Exercises02.||
orProp :: Bool -> Bool -> Bool
orProp a b = (a E2.|| b) == (a || b)

-- | QuickCheck proposition for testing Exercises02.nand
nandProp :: Bool -> Bool -> Bool
nandProp a b = (a `E2.nand` b) == not (a && b)

-- | QuickCheck proposition for testing Exercises02.==>
impliesProp :: Bool -> Bool -> Bool
impliesProp a b = (a E2.==> b ) == (not a || b)

-- | QuickCheck proposition for testing Exercises02.absVal
absValProp :: Int -> Bool
absValProp x = E2.absVal x == abs x

-- | QuickCheck proposition for testing Exercises02.~=
floatEqualsProp :: Float -> Float -> Bool
floatEqualsProp x y = (x E2.~= y) == (abs (x - y) <= 1e-4)

-- | QuickCheck proposition for testing Exercises02.rotate
rotateProp :: [Int] -> Bool
rotateProp xs
  | length xs < 2 = E2.rotate xs == xs
  | otherwise     = E2.rotate xs == (tail xs ++ [head xs])

-- | QuickCheck proposition for testing Exercises02.squares
squaresProp :: [Int] -> Bool
squaresProp xs = E2.squares xs == map (\n -> n * n) xs

-------------------------------------------------------------------------------------------
-- * Run Tests
main :: IO ()
main = hspec $ do
  describe "||" $ do
    it "should correspond to Prelude.||" $ property orProp
  describe "nand" $ do
    it "a `nand` b should correspond to not (a && b)" $ property nandProp
  describe "==>" $ do
    it "a ==> b should correspond to (not a) || b" $ property impliesProp
  describe "absVal" $ do
    it "should correspond to Prelude.abs" $ property absValProp
  describe "~=" $ do
    it "should be correct when the inputs are with 1e-4 tolerance of eachother" $ property $ withMaxSuccess 1000 floatEqualsProp
  describe "rotate" $ do
    it "moves the first element of a list to the back" $ property rotateProp
  describe "squares" $ do
    it "multiplies each element in a list by itself" $ property squaresProp
