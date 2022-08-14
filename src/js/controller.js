import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';

const search = document.querySelector('.search');
search.addEventListener('submit', e => {
  e.preventDefault();
});

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //Loading Spinner
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.render(model.getSearchResultPage());

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    //! Rendering recipe
  } catch (error) {
    recipeView.renderError(
      'We could not find that recipe. Please try another one!'
    );
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //  Render search results

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultPage(1));

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(
      'We could not find that recipe. Please try another one!'
    );
  }
};

const controlPagination = function (page) {
  resultsView.render(model.getSearchResultPage(page));

  // Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
