'use strict';

/*global api*/

const api = (function() {

  const listApiFetch = function(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = { code: res.status};
        }

        return res.json();
      })

      .then(data => {
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }

        return data;
      });
  };

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/tarapatel/bookmarks/';

  const getItems = function() {
    return listApiFetch(`${BASE_URL}`);
  };

  const deleteEntry = function(id) {
    return listApiFetch(`${BASE_URL}${id}`, {
      method: 'DELETE'
    });
  };

  const createEntry = function(entry) {
    return listApiFetch(`${BASE_URL}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: entry
    });
  };

  return {
    createEntry,
    listApiFetch,
    getItems,
    deleteEntry
  };

})();