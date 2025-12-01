{-# LANGUAGE FlexibleInstances #-}
{-|
Module      : HaskellExercises08.Exercises08
Copyright   :  (c) Curtis D'Alves 2020
License     :  GPL (see the LICENSE file)
Maintainer  :  none
Stability   :  experimental
Portability :  portable

Description:
  Haskell exercise template Set 08 - McMaster CS 1JC3 2021
-}
module Exercises08 where

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
-- 4) REPLACE macid = "TODO" WITH YOUR ACTUAL MACID
--------------------------------------------------------------------------------
macid = "graydj1"

data Nat = Succ Nat
         | Zero
  deriving (Show,Eq)

data Signed a = Positive a
              | Negative a
  deriving (Show,Eq)

instance Num (Signed Nat) where
  (+) = addSNat
  (*) = multSNat
  abs = absSNat
  signum n = case n of
               (Positive _) -> Positive $ Succ Zero
               (Negative _) -> Negative $ Succ Zero
  fromInteger = intToSNat
  negate = negateSNat

--------------------------------------------------------------------------------
-- Exercise A
--------------------------------------------------------------------------------

-- convert Nat to Integer
natToInt :: Nat -> Integer
natToInt Zero     = 0
natToInt (Succ n) = 1 + natToInt n

sNatToInt :: Signed Nat -> Integer
sNatToInt (Positive n) = natToInt n
sNatToInt (Negative n) = negate (natToInt n)

-- convert Integer to Nat
intToNat :: Integer -> Nat
intToNat 0 = Zero
intToNat n = Succ (intToNat (n - 1))

intToSNat :: Integer -> Signed Nat
intToSNat n
  | n == 0    = Positive Zero
  | n < 0     = Negative (intToNat (abs n))
  | otherwise = Positive (intToNat n)

--------------------------------------------------------------------------------
-- Exercise B  (adding signed Nats without using int conversion)
--------------------------------------------------------------------------------

-- Compare Nats
compareNat :: Nat -> Nat -> Ordering
compareNat Zero Zero         = EQ
compareNat Zero (Succ _)     = LT
compareNat (Succ _) Zero     = GT
compareNat (Succ n) (Succ m) = compareNat n m

-- Subtract Nats (never negative)
subNat :: Nat -> Nat -> Nat
subNat Zero _              = Zero
subNat n Zero              = n
subNat (Succ n) (Succ m)   = subNat n m

addNat :: Nat -> Nat -> Nat
addNat Zero m     = m
addNat (Succ n) m = Succ (addNat n m)

addSNat :: Signed Nat -> Signed Nat -> Signed Nat
-- both positive
addSNat (Positive x) (Positive y) =
  Positive (addNat x y)

-- both negative
addSNat (Negative x) (Negative y) =
  Negative (addNat x y)

-- positive + negative
addSNat (Positive x) (Negative y) =
  case compareNat x y of
    GT -> Positive (subNat x y)
    LT -> Negative (subNat y x)
    EQ -> Positive Zero

-- negative + positive
addSNat (Negative x) (Positive y) =
  case compareNat x y of
    GT -> Negative (subNat x y)
    LT -> Positive (subNat y x)
    EQ -> Positive Zero

--------------------------------------------------------------------------------
-- Exercise C – multiplication
--------------------------------------------------------------------------------

multSNat :: Signed Nat -> Signed Nat -> Signed Nat
multSNat n0 n1 =
  let
    addNat :: Nat -> Nat -> Nat
    addNat Zero m     = m
    addNat (Succ n) m = Succ (addNat n m)

    multNat :: Nat -> Nat -> Nat
    multNat Zero _     = Zero
    multNat (Succ n) m = addNat m (multNat n m)

  in case (n0,n1) of
       (Positive x, Positive y) -> Positive (multNat x y)
       (Negative x, Negative y) -> Positive (multNat x y)
       (Negative x, Positive y) -> Negative (multNat x y)
       (Positive x, Negative y) -> Negative (multNat x y)

--------------------------------------------------------------------------------
-- Exercise D
--------------------------------------------------------------------------------

absSNat :: Signed Nat -> Signed Nat
absSNat (Positive n) = Positive n
absSNat (Negative n) = Positive n

--------------------------------------------------------------------------------
-- Exercise E
--------------------------------------------------------------------------------

negateSNat :: Signed Nat -> Signed Nat
negateSNat (Positive n) = Negative n
negateSNat (Negative n) = Positive n
