'use strict';
/*global store*/

const store = (function() {

  const findByID = function() {
    return this.entries.find(entry => entry.id === id);
  };

  const addEntry = function(entry) {
    this.entries.push(entry);
  };

  const modifyEntry = function() {

  };

  const deleteEntry = function(id) {
    this.entries = this.entries.filter(entry => entry.id !== id);
  };

  const setFilter = function() {

  };

  const setError = function () {

  };

  const setItemIsEditing = function() {

  };

  return {
    entries: [],
    filter: null,
    error: null,
    findByID,
    addEntry,
    modifyEntry,
    deleteEntry,
    setFilter,
    setError,
    setItemIsEditing
  };
  
})();