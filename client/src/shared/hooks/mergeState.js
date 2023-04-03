import { useState, useCallback } from 'react';
import { isFunction } from 'lodash';


// This hook creates and returns a state variable, and a function to call when new state values shoudl be merged to the state var.
// It takes as argument the initial state that will fill returned state var.

// EXAMPLE
// const [mystate, mergeMystate] = useMergeState({
//   data: canUseCache ? cache[url].data : null,
//   error: null,
//   isLoading: !lazy && !canUseCache,
//   variables: {},
// });
//
// 2) Next, an api call is made that is for updating the state.
// -- When query completes, the mergeMystate func is called with the NEW data.
// 
// api.get(url, apiVariables).then(
// data => {
//   cache[url] = { data, apiVariables }; // Save data to cache.
//   mergeState({ data, error: null, isLoading: false }); // Clear error and merge returned data into current state.
// },
//   error => {
//     mergeState({ error, data: null, isLoading: false }); // Clear cached data and set error.
//   },
// );


const useMergeState = initialState => {
  const [state, setState] = useState(initialState || {});

  const mergeState = useCallback(newState => {
    if (isFunction(newState)) {
      setState(currentState => ({ ...currentState, ...newState(currentState) }));
    } else {
      setState(currentState => ({ ...currentState, ...newState }));
    }
  }, []);

  return [state, mergeState];
};


export default useMergeState;
