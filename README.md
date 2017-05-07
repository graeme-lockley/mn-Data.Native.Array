
Helper functions for working directly against JavaScript arrays.  Note that all of these functions are immutable
and do not change the state of the passed arguments.  I should therefore not be used other than in implementing
wrapper packages over native JavaScript files.

Characteristics of functions within native packages:
* They may not throw an exception,
* They may not mutate their parameters,
* They are all curried, and
* They may not return nil or undefined.

Further to that a native package may only be dependent on other native packages or standard node.js packages

## Index

[append](#append)
[at](#at)
[concat](#concat)
[filter](#filter)
[findMap](#findMap)
[join](#join)
[length](#length)
[map](#map)
[prepend](#prepend)
[range](#range)
[reduce](#reduce)
[slice](#slice)
[sort](#sort)
[zipWith](#zipWith)

## Detail

### length

```haskell
length :: Array a -> Int
```

Get the number of elements within an array.

#### Examples:

```haskell
length([]) == 0
length([1, 2, 3]) == 3
```

### findMap

```haskell
findMap :: Array a -> (a -> Maybe b) -> Maybe b
```

Locate an mapped element within an array.  Should no element be found then this function returns Nothing otherwise
it returns Just the mapped result.

### append

```haskell
append :: Array a -> a -> Array a
```

Append an element onto the end of an array.

#### Examples:

```haskell
append([1, 2, 3])(4) == [1, 2, 3, 4]
append([])(4) == [4]
```

### prepend

```haskell
prepend :: a -> Array a -> Array a
```

Add an element onto the front of an array.

#### Examples:

```haskell
prepend(0)([1, 2, 3]) == [0, 1, 2, 3]
prepend(0)([]) == [0]
```

### slice

```haskell
slice :: Array a -> Int -> Int -> Array a
```

Creates an array by slicing elements from the passed array starting at `start` and ending at but excluding the element
before `end`.

#### Examples:

```haskell
slice([1, 2, 3, 4])(1)(3) == [2, 3]
slice([1, 2, 3, 4])(3)(-1) == []
slice([1, 2, 3, 4])(10)(12) == []
slice([1, 2, 3, 4])(1)(100) == [2, 3, 4]
```

### at

```haskell
at :: Array a -> Int -> Maybe a
```

A safe way to read a value at a particular index from an array.

#### Examples:

```haskell
at([1, 2, 3, 4])(3) == Maybe.Just(4)
at([1, 2, 3, 4])(9) == Maybe.Nothing
at([1, 2, 3, 4])(-2) == Maybe.Nothing
```

### range

```haskell
range :: Int -> Int -> Array Int
```

Create an array containing a range of integers from the first parameter to, but not including, the
second parameter.  If the first parameter is larger than the second parameter then the range will
be a descending range.

#### Examples:

```haskell
range(1)(10) == [1, 2, 3, 4, 5, 6, 7, 8, 9]
range(10)(1) == [10, 9, 8, 7, 6, 5, 4, 3, 2]
```

### concat

```haskell
concat :: Array a -> Array a -> Array a
```

Combine two arrays by appending the second argument onto the first.

#### Examples:

```haskell
concat([])([]) == []
concat([1, 2])([3, 4]) == [1, 2, 3, 4]
```

### reduce

```haskell
reduce :: Array a -> (() -> b) -> (a -> Array a -> b) -> b
```

A reduction function that treats the array like a traditional list made of Nil and Cons elements.  It works by accepting two functions which, if the array is empty
will call the first function without any arguments otherwise it will call the second function passing the 'head' of the array and the 'tail' of the array.

#### Examples:

```haskell
reduce([])(() => ({}))(h => t => ({head: h, tail: t})) == {}
reduce([1, 2, 3])(() => ({}))(h => t => ({head: h, tail: t})) == {head: 1, tail: [2, 3]}
```

### zipWith

```haskell
zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c
```

Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array.

If one array is longer, elements will be discarded from the longer array.

#### Examples:

```haskell
zipWith(v1 => v2 => v1 * v2)([])([]) == []
zipWith(v1 => v2 => v1 * v2)([1, 2, 3])([]) == []
zipWith(v1 => v2 => v1 * v2)([1, 2, 3])([4, 5, 6, 7]) == [4, 10, 18]
zipWith(v1 => v2 => v1 * v2)([1, 2, 3, 4, 5, 6])([4, 5, 6]) == [4, 10, 18]
```

### map

```haskell
map :: (a -> b) -> Array a -> Array b
```

Apply a function to every element of an array

#### Examples:

```haskell
map(x => x * 2)([]) == []
map(x => x * 2)([1, 2, 3]) == [2, 4, 6]
```

### join

```haskell
join :: Array a -> String -> String
```

Join the elements of an array together by converting each element to a string and then concatenating them together with the separator.

#### Examples:

```haskell
join([1, 2, 3])(", ") == "1, 2, 3"
join([])(", ") == ""
```

### filter

```haskell
filter :: (a -> Bool) -> Array a -> Array a
```

Filter all elements within an array based on a predicate and return a new array containing only those elements for
the predicate was true.

#### Examples:

```haskell
filter(n => n > 5)([1, 10, 2, 9, 3, 8, 4, 7, 5, 6]) == [10, 9, 8, 7, 6]
```

### sort

```haskell
sort :: (a -> a -> Native.Integer) -> Array a -> Array a
```

Sort the elements of an array based on the passed compare function.
* If compare(a)(b) is less than 0, sort a to a lower index than b, i.e. a comes first.
* If compare(a)(b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements.
* If compare(a)(b) is greater than 0, sort b to a lower index than a.
compare(a)(b) must always return the same value when given a specific pair of elements a and b as its two arguments.
If inconsistent results are returned then the sort order is undefined.

#### Examples:

```haskell
sort(a => b => a < b ? -1 : a > b ? 1 : 0)([1, 9, 2, 8, 3, 7, 4, 6, 5]) == [1, 2, 3, 4, 5, 6, 7, 8, 9]
sort(a => b => a < b ? -1 : a > b ? 1 : 0)(["one", "nine", "two", "eight", "three", "seven", "four", "six", "five"]) == ["eight","five","four","nine","one","seven","six","three","two"]
```


## Dependencies

* [Data.Native.Maybe (1.3.0)](https://github.com/graeme-lockley/mn-Data.Native.Maybe)