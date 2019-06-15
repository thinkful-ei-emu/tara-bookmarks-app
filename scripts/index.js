'use strict';
/*global store, api, bookmarks*/

$(document).ready(function() {
  api.getItems()
    .then((entries) => {
      entries.forEach((entry) => store.addEntry(entry));
      bookmarks.render();
    });
  bookmarks.bindEventListeners();
});
