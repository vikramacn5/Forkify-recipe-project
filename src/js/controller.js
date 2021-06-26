import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import { testFunction as func, testVariable as vari } from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// console.log(vari);
// func();
// console.log(vari);

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function (recipeHash) {
  try {
    // One way
    // const id = recipeHash.newURL.split('#')[1];

    // Second way
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading a recipe
    await model.loadRecipe(id);

    // 3. rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const paginationController = function (gotoPage) {
  // 3. render NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // 4. render NEW pagination buttons
  paginationView.render(model.state.search);
};

// const controlServings = function () {
//   // Update the recipe servings (in state)
//   model.updateServings(6);
//   // Update the recipe view
//   recipeView.render(model.state.recipe);
// };

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL      state, header, url   changes the url without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('*', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(paginationController);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
};

init();

// clearBookmarks();

// (function () {
//   showRecepi().then(res => {
//     console.log(res);
//     console.log('hi');
//   });
//   // console.log(showRecepi());
// })();
// controlRecipes();

// document.documentElement.addEventListener('keydown', function (e) {
//   console.log(e);
//   console.log(document.location.hash);
// });

// const testObj = {
//   name: 'nila',
//   age: 24,
//   sex: 'female',
//   favColor: {
//     black: 'shirt',
//     white: 'walls',
//     yellow: 'raceCar',
//   },
// };

// const testObj2 = {
//   0: 'markIV',
//   1: 24,
//   2: 'male',
//   hobby: 'code',
// };

// console.log(testObj.hours?.blue);

// console.log(null?.trim() !== '');

// console.log(testObj2);
// console.log(Array.from(testObj));
// console.log(Object.entries(testObj));
// console.log(Array.from(testObj2));

// const testArr = ['vikram', 'markIV', 'nila', 'test', 'platuae'];
// console.log(testArr.splice(3, 1));
