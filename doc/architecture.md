Architecture
============

This application is written as a client-side single page app, backed by a lightweight 
Flask server. The Flask server is essentially a tiny wrapper around the python Media 
Cloud api client library.  The in-browser Javascript app follows the Flux design pattern, 
as implemented in the Redux library.  The view layer is implemented via React components, 
with visualizations created using HighCharts and d3.js.

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
