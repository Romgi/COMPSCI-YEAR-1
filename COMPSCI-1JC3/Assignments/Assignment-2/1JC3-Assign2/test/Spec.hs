module Main where

import qualified Assign_2 as A2

main :: IO ()
main = do
  if A2.macid == "TODO"
    then error "Please fill in your Mac ID field!"
    else putStrLn "**This test only checks that your Mac ID was filled in. It does *not* test your code.**"
