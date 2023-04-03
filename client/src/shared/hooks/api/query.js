import { useRef, useCallback, useEffect } from 'react';
import { isEqual } from 'lodash';

import api from 'shared/utils/api';
import useMergeState from 'shared/hooks/mergeState';
import useDeepCompareMemoize from 'shared/hooks/deepCompareMemoize';

// ### EXAMPLES
//useApi.get('/issues', {}, { lazy: true });

// -- We send only a single property, the url.
// -- REACT "use" design creates new local vars that hold state
//     data: Our state variable.
//     error: Any errors.
//     setLocalData: If we want something to be able to update our state vars.
// -- fetchFunc: Function to call when state should be refreshed and udpated via fetch.

// const [{ data, error, setLocalData }, fetchFunc] = useApi.get('/project');

// if (!data) return <PageLoader />;
// if (error) return <PageError />;
// const { project } = data;
// // When project.issues change, we need to update state so issue change is visible.
// const updateLocalProjectIssues = (issueId, updatedFields) => {
//   // ... setLocalData call here will cause mergeState to be called, which updates project state with new issue list.
//   setLocalData((currentData) => ({
//     project: {
//       ...currentData.project,
//       issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
//     },
//   }));
// };

// ### END EXAMPLES

const useQuery = (url, propsVariables = {}, options = {}) => {
  // ABM ADD: Added canQuery to options so we can turn off query when we want to.
  const { lazy = false, cachePolicy = 'cache-first', canQuery = true } = options;
  console.log(`>>> useQuery (${url}) called:\r\npropsVariables, options`, propsVariables, options)

  const wasCalled = useRef(false);
  const propsVariablesMemoized = useDeepCompareMemoize(propsVariables);

  const isSleeping = lazy && !wasCalled.current;
  const isCacheAvailable = cache[url] && isEqual(cache[url].apiVariables, propsVariables);
  let canUseCache = false;
  if (isCacheAvailable && cachePolicy !== 'no-cache' && !wasCalled.current) {
    canUseCache = true;
  }

  // mergeState is function to call when we want to merge the state in REACT way.
  console.log(`useQuery (${url}) canUseCache, isSleeping`, canUseCache, isSleeping)
  
  // ### mergeState hook source code.
  // const useMergeState = initialState => {
  //   const [state, setState] = useState(initialState || {});
  //   const mergeState = useCallback(newState => {
  //     if (isFunction(newState)) {
  //       setState(currentState => ({ ...currentState, ...newState(currentState) }));
  //     } else {
  //       setState(currentState => ({ ...currentState, ...newState }));
  //     }
  //   }, []);
  //   return [state, mergeState];
  // };
  const [state, mergeState] = useMergeState({
    data: canUseCache ? cache[url].data : null,
    error: null,
    isLoading: !lazy && !canUseCache,
    variables: {},
  });

  // Loads data from API, using cache if available.
  const makeRequest = useCallback(
    newVariables => {
      console.log(`useQuery (${url}) >>> makeRequest -> useCallback: propsVariablesMemoized init or changed!\r\npropsVariablesMemoized, newVariables, state.variables`, propsVariablesMemoized, newVariables, state.variables )
      if (!canQuery) {
        console.log(`useQuery (${url}) makeRequest - canQuery FALSE!!! SKipping....`)
        return;
      }

      const variables = { ...state.variables, ...(newVariables || {}) }; 
      console.log(`useQuery (${url}) -> makeRequest -> useCallback: \r\nvariables = {...state.variables, ...newVariables}`, variables)

      const apiVariables = { ...propsVariablesMemoized, ...variables };
      console.log(`useQuery (${url}) -> makeRequest -> useCallback: \r\napiVariables = {...propsVariablesMemoized, ...variables}`, apiVariables)

      const skipLoading = canUseCache && cachePolicy === 'cache-first';

      if (!skipLoading) {
        mergeState({ isLoading: true, variables }); // merge isLoading.true and any new variables into current variables state (named state).
      } else if (newVariables) { // If skip loading, we just merge any new variables into current variables state.
        mergeState({ variables });
      }

      console.log(`useQuery (${url}) -> makeRequest -> useCallback: Calling API...\r\napiVariables`, apiVariables)
      api.get(url, apiVariables).then(
        data => {
          console.log(`useQuery (${url}) -> makeRequest -> data returned`, data)
          cache[url] = { data, apiVariables }; // Save data to cache.
          mergeState({ data, error: null, isLoading: false }); // Clear error and merge returned data into current state.
        },
        error => {
          console.log(`useQuery (${url}) -> makeRequest -> data ERR`, error)
          mergeState({ error, data: null, isLoading: false }); // Clear cached data and set error.
        },
      );

      wasCalled.current = true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propsVariablesMemoized],
  );

  // Calls makeRequest on initial use, and any time makeRequest changes, which happens whenever propsVariablesMemoized changes.
  useEffect(() => {
    console.log(`useQuery (${url}) -> useEffect: canUseCache, isSleeping`, canUseCache, isSleeping)
    // if makeRequest function changes, this will be executed. Will only change if any props change (see useDeepCompareMemoize)!
    if (isSleeping) return;
    if (canUseCache && cachePolicy === 'cache-only') return;

    makeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [makeRequest]);




// ###
// ### setLocalData EXAMPLE usage in caller.
// ###

// ## The updater function defined in the caller. Caller would execute this when it's time to update model.
// const updateLocalProjectIssues = (issueId, updatedFields) => {
//   setLocalData(
//      ( currentData) => // currentData is the current state data object passed as a arrow function param.
//      (
//          {
//             project: {
//                ...currentData.project,
//                issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
//             },
//          }
//      )
//   );
// };

// ###
// ### Breaking down ( currentData) => {...} arrow func call.
// ###
//
// ## The arrow function passed to setLocalData from our example: stripped down to basic example of arrow function.
// (currentStateData) => {  // currentStateData is the current state data object passed as a arrow function param.
//   statements
// }
//
// ## Arrow function example with concise body and literal return.
// (currentStateData) =>
// ({
//   {foo: 1}
// })
//
// ## ... Modified to support our example.
// (currentStateData) =>
// ({
//     project: {
//        ...currentStateData.project,
//        issues: updateArrayItemById(currentStateData.project.issues, issueId, updatedFields),
//     },
// })
//
// ## Our arrow function now in it's setLocalData call.
// setLocalData(
//  (currentStateData) =>
//  ({
//     project: {
//        ...currentStateData.project,
//        issues: updateArrayItemById(currentStateData.project.issues, issueId, updatedFields),
//     },
//  })
//}));

// ###
// ### Now we show how mergeState is used with the data property of currentStateData.
// ### We remove the useCallback part and set the arrow function to a getUpdatedData variable for easier reading.
// ###
//
// assume currentStateData has {data, aaa, bbb}
// so { data } of currentStateData is the data property in currentStateData.
//
// const getUpdatedData = ({ [currentStateData.]data }) =>
//  ({
//     project: {
//        ...data.project, // All CURRENT properties of project...
//        issues: updateArrayItemById(data.project.issues, issueId, updatedFields), // .. and all issues with updates applied.
//     },
//  })
// RETURNS: { project: { all updated props merged in. } }


  // useCallback Returns memoized that will always be same, unless input changes (mergeState func or url).
  const setLocalData = useCallback(
    (getUpdatedData) => // getUpdatedData is the caller defined func passed as a paroperty.

      // NOTE: mergeState returns ref to state object, and pointer to mergeState func that is used to CHANGE state object.
      // We call our mergeState func defined in use call way above to merge updated data () into the state var.
      mergeState( // ### We are passing in a FUNCTION into mergeState, so mergeState will merge current state with RESULTS of function.
        ({ data }) => // currentState
        {
          console.log(`useQuery (${url}) -> setLocalData -> mergeState: data`, data)
          const updatedData = getUpdatedData(data); // Call the func passed in by caller, passing in currentState data property. Caller func will merge updates with currentState and return it...
          cache[url] = { ...(cache[url] || {}), data: updatedData };
          return { data: updatedData };
        }),

      // ###
      // ### mergeState breakdown.
      // ###
      //
      // ### Simplify: Merge state call modified to pass { data } property of paramas manually instead of through destructurring.
      //
      // const mFunc = (paramas) =>
      //       {
      //         const data = paramas.data; // More readible for this example.
      //         const updatedData = getUpdatedData(data); // Call the orig callback func passed in!
      //         cache[url] = { ...(cache[url] || {}), data: updatedData };
      //         return { data: updatedData };
      //       }
      //
      // ### As Traditional Function for even simpler reading.
      //
      // function mFunc(paramas) {
      //    const data = paramas.data;
      //    const updatedData = getUpdatedData(data); // Call the orig callback func passed in!
      //    cache[url] = { ...(cache[url] || {}), data: updatedData };
      //    return { data: updatedData };
      // }
      //
      // ### So we now call mergeState as:
      // mergeState(
      //   function(newStateParamas) 
      //   {
      //     const data = newStateParamas.data;
      //     const updatedData = getUpdatedData(data); // Call the func passed in by caller, passing in data property.
      //     cache[url] = { ...(cache[url] || {}), data: updatedData };
      //     return { data: updatedData };
      //   }),
      //
      // ### And mergeState calls THIS since function was passed in.....
      // setState(currentState => ({ ...currentState, ...newStateFUNC(currentState) }));
      // ### and newStateFUNC return value is { data: updatedData };
      //

    [mergeState, url], // In mergeState, useCallback is used with [] as monitored. TODO: Define what changes related to mergeState will trigger this.
  );


  return [
    {
      ...state, // All vars in the state, but not the state itself...
      variables: { ...propsVariablesMemoized, ...state.variables },
      setLocalData,
    },
    makeRequest,
  ];
};

const cache = {};

export default useQuery;

