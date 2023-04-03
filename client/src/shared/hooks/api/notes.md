


## OLDER, unsorted notes to go through.

```js

// OptimisticUpdate example...
// setLocalData: (fields) => {
  //   updateLocalIssueDetails(fields);
  //   updateLocalProjectIssues(issue.id, fields);
  // }


// { data } => initialState => the initial state.
// const [state, setState] = useState({ data } || {});
// const mergeState = useCallback(newState => {
// return [state, mergeState];

  // mergeState will return a copy of the data that has useCallbacks etc applied to it....
  // ABM: Do not fully understand this code here. I think it merges updated data to current state and sets cache.
  // Memoized copy of func returned, unless mergeState or url changes.

  // SO....................
  // const setLocalData = useCallback(
  //  (getUpdatedData) => {
  //    return  mergeState(
  //    ({ data }) => {
  //       const updatedData = getUpdatedData(data); // Call the orig callback func passed in!
  //       cache[url] = { ...(cache[url] || {}), data: updatedData };
  //       return { data: updatedData };
  //    }),
//    }

  // is..............
  // 
  //  new function(getUpdatedDataFunc) {
  //    return mergeState(new function({ data }) {
  //       const updatedData = getUpdatedDataFunc(data); // Call the orig callback func passed in!
  //       cache[url] = { ...(cache[url] || {}), data: updatedData };
  //       return { data: updatedData };
  //    })
  //  }


// AND.... Calling code will call this nice new setLocalData function with it's own UPDATER func definition!!!!

// from our example, func is defined as::::
//  (currentData) => ({
//     project: {
//       ...currentData.project,
//       issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
//     },
//   })

// SO........
// 
//  new function(getUpdatedDataFunc) {
  //    return mergeState(new function({ data }) {

  // Belkow func passe din is called like so...
  // const updatedData = (data) => ({
//     project: {
//       ...data.project,
//       issues: updateArrayItemById(data.project.issues, issueId, updatedFields),
//     },
//   })


  //       cache[url] = { ...(cache[url] || {}), data: updatedData };
  //       return { data: updatedData };
  //    })
  //  }

// var myFunc = a => a + 100;
// console.log(myFunc(5)); // returns 105

// function doubleIt(v) {
//   return v * 2;
// }
// function halfIt(v) {
//   return v / 2;
// }
// var myFunc2 = a => a(100); // a is a function here instead of variable.
// console.log(myFunc2(doubleIt(n))); // returns 200!
// console.log(myFunc2(halfIt(n))); // returns 50!

// function doSomething(st) {
//   st()
// }
// var myFunc3 = a => a(100); // a is a function here instead of variable.
// console.log(myFunc2(doubleIt(n))); // returns 200!

//var myFunc = getUpdatedData =>
// mergeState(({ data }) => {
//   const updatedData = getUpdatedData(data); // Call the orig callback func passed in!
//   cache[url] = { ...(cache[url] || {}), data: updatedData };
//   return { data: updatedData };
// }),

// 1) Below is passed in as func to setLocalData...
  // {
  //   updateLocalIssueDetails(fields);
  //   updateLocalProjectIssues(issue.id, fields);
  // }
// so getUpdatedData is a ref to that local func.
//
// getUpdatedData is the result of calling mergeState 
```