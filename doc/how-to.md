How To Guide
============

Architecture
------------

This application is written as a client-side single page app, backed by a lightweight 
Flask server. The Flask server is essentially a tiny wrapper around the python Media 
Cloud api client library.  The in-browser Javascript app follows the Flux design pattern, 
as implemented in the Redux library.  The view layer is implemented via React components, 
with visualizations created using HighCharts and d3.js.

Opinions
--------

 * Put a css class name on everything.  Don't use inline React styles.
 * Having one state management approach makes life easier, so by default toss everything 
   in the Redux store.  One notable exception is things like temporary UI state (ie. if a drop 
   down is open or closed).  Put those in React state on the container.
 * Separate stateful and display components.  React components that are connect to the Redux store
   should be called "Containers" (ie. `ImportantDataViewContainer`), whereas the display components they
   contain should not (ie. `ImportantDataView`).
 * Most data coming back from the API via the server use underscore naming.  Leave them that way.  If you add
   things or are sending things generated in Javascript to the server, then default to using camelCase and change it on
   the server when assigning a new variable in python (ie. `important_note = request['importantNote']`).
 * Put as much data-cleaing / prep logic into the reducer as possible.  For instance, date parsing from a string
   to a Javascript `Date` objects should happen in a reducer.  So if the `publish_date` you get back from the server
   is a string, in the reducer turn in into a `Date` object and save it on the same reducer as `publishDate` (note the
   change in naming convention).
 * Sketch out a solution to an issue on GitHub **before** starting to implement it.  Use a checklist to describe
   all the Components, server endpoints, and actions you'll need.

Adding a New Widget
-------------------

There are a lot of touch-points for adding a new data, but it makes sense once you've done 
it a few times.

1. First create the server endpoint in Flask by adding a wrapper method in the `mediameter/views/` 
module.  Try to follow REST-ful conventions.
  * test this endpoint in your browser directly via url to make sure it works
2. Design where your data will be saved in the redux store.
  * browse through the `src/reducers` directory to get a sense for the right place
3. Create a helper method for JS to call your new endpoint.
  * add it in the appropriate helper under `src/lib`
4. Create an action type constant and action generator to call this api method.
  * put these in the appropriate file under `src/actions`
5. Crate a reducer to save results from that call to the store.
  * put this in the right place (based on step 2) under the `src/reducers` directory tree
  * make sure to import and add the recuder to the correct parent reducer in the reducer tree
6. Create a new container widget to fetch the data
  * this should be a new file under the `src/components/` directory tree
7. Create a new component widget to display the data
  * this should be a new file under the `src/components/` directory tree
