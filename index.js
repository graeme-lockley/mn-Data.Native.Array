//- Helper functions for working directly against JavaScript arrays.  Note that all of these functions are immutable
//- and do not change the state of the passed arguments.  I should therefore not be used other than in implementing
//- wrapper packages over native JavaScript files.
//-
//- Characteristics of functions within native packages:
//- * They may not throw an exception,
//- * They may not mutate their parameters,
//- * They are all curried, and
//- * They may not return nil or undefined.
//-
//- Further to that a native package may only be dependent on other native packages or standard node.js packages

const Maybe = mrequire("core:Data.Native.Maybe:1.3.0");


//- Get the number of elements within an array.
//= length :: Array a -> Int
const length = a =>
    a.length;
assumptionEqual(length([]), 0);
assumptionEqual(length([1, 2, 3]), 3);


//- Locate an mapped element within an array.  Should no element be found then this function returns Nothing otherwise
//- it returns Just the mapped result.
//= findMap :: Array a -> (a -> Maybe b) -> Maybe b
const findMap = a => f => {
    for (let lp = 0; lp < a.length; lp += 1) {
        const fResult = f(a[lp]);

        if (fResult.isJust()) {
            return fResult;
        }
    }

    return Maybe.Nothing;
};


//- Append an element onto the end of an array.
//= append :: Array a -> a -> Array a
const append = a => item =>
    [...a, item];
assumptionEqual(append([1, 2, 3])(4), [1, 2, 3, 4]);
assumptionEqual(append([])(4), [4]);


//- Add an element onto the front of an array.
//= prepend :: a -> Array a -> Array a
const prepend = item => a =>
    [item, ...a];
assumptionEqual(prepend(0)([1, 2, 3]), [0, 1, 2, 3]);
assumptionEqual(prepend(0)([]), [0]);


//- Creates an array by slicing elements from the passed array starting at `start` and ending at but excluding the element
//- before `end`.
//= slice :: Array a -> Int -> Int -> Array a
const slice = a => start => end =>
    a.slice(start, end);
assumptionEqual(slice([1, 2, 3, 4])(1)(3), [2, 3]);
assumptionEqual(slice([1, 2, 3, 4])(3)(-1), []);
assumptionEqual(slice([1, 2, 3, 4])(10)(12), []);
assumptionEqual(slice([1, 2, 3, 4])(1)(100), [2, 3, 4]);


//- A safe way to read a value at a particular index from an array.
//= at :: Array a -> Int -> Maybe a
const at = a => index =>
    (index < 0 || index >= a.length)
        ? Maybe.Nothing
        : Maybe.Just(a[index]);
assumptionEqual(at([1, 2, 3, 4])(3), Maybe.Just(4));
assumptionEqual(at([1, 2, 3, 4])(9), Maybe.Nothing);
assumptionEqual(at([1, 2, 3, 4])(-2), Maybe.Nothing);


//- Create an array containing a range of integers from the first parameter to, but not including, the 
//- second parameter.  If the first parameter is larger than the second parameter then the range will
//- be a descending range.
//= range :: Int -> Int -> Array Int
const range = lower => upper => {
    if (lower < upper) {
        let result = [];
        for (let lp = lower; lp < upper; lp += 1) {
            result.push(lp);
        }
        return result;
    } else {
        let result = [];
        for (let lp = lower; lp > upper; lp -= 1) {
            result.push(lp);
        }
        return result;
    }
};
assumptionEqual(range(1)(10), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assumptionEqual(range(10)(1), [10, 9, 8, 7, 6, 5, 4, 3, 2]);


//- Combine two arrays by appending the second argument onto the first.
//= concat :: Array a -> Array a -> Array a
const concat = a1 => a2 =>
    a1.concat(a2);
assumptionEqual(concat([])([]), []);
assumptionEqual(concat([1, 2])([3, 4]), [1, 2, 3, 4]);


//- A reduction function that treats the array like a traditional list made of Nil and Cons elements.  It works by accepting two functions which, if the array is empty
//- will call the first function without any arguments otherwise it will call the second function passing the 'head' of the array and the 'tail' of the array.
//= reduce :: Array a -> (() -> b) -> (a -> Array a -> b) -> b
const reduce = a => fNil => fCons =>
    (a.length === 0)
        ? fNil()
        : fCons(a[0])(a.slice(1));
assumptionEqual(reduce([])(() => ({}))(h => t => ({head: h, tail: t})), {});
assumptionEqual(reduce([1, 2, 3])(() => ({}))(h => t => ({head: h, tail: t})), {head: 1, tail: [2, 3]});


//- Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array.
//-
//- If one array is longer, elements will be discarded from the longer array.
//= zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c
const zipWith = f => a1 => a2 => {
    let result = [];

    const upper = Math.min(a1.length, a2.length);
    for (let lp = 0; lp < upper; lp +=1) {
        result.push(f(a1[lp])(a2[lp]));
    }

    return result;
};
assumptionEqual(zipWith(v1 => v2 => v1 * v2)([])([]), []);
assumptionEqual(zipWith(v1 => v2 => v1 * v2)([1, 2, 3])([]), []);
assumptionEqual(zipWith(v1 => v2 => v1 * v2)([1, 2, 3])([4, 5, 6, 7]), [4, 10, 18]);
assumptionEqual(zipWith(v1 => v2 => v1 * v2)([1, 2, 3, 4, 5, 6])([4, 5, 6]), [4, 10, 18]);


//- Apply a function to every element of an array
//= map :: (a -> b) -> Array a -> Array b
const map = f => a =>
    a.map(f);
assumptionEqual(map(x => x * 2)([]), []);
assumptionEqual(map(x => x * 2)([1, 2, 3]), [2, 4, 6]);


//- Join the elements of an array together by converting each element to a string and then concatenating them together with the separator.
//= join :: Array a -> String -> String
const join = a => sep =>
    a.join(sep);
assumptionEqual(join([1, 2, 3])(", "), "1, 2, 3");
assumptionEqual(join([])(", "), "");


//- Filter all elements within an array based on a predicate and return a new array containing only those elements for
//- the predicate was true.
//= filter :: (a -> Bool) -> Array a -> Array a
const filter = predicate => a =>
    a.filter(predicate);;
assumptionEqual(filter(n => n > 5)([1, 10, 2, 9, 3, 8, 4, 7, 5, 6]), [10, 9, 8, 7, 6]);


module.exports = {
    append,
    at,
    concat,
    filter,
    findMap,
    join,
    length,
    map,
    prepend,
    range,
    reduce,
    slice,
    zipWith
};
