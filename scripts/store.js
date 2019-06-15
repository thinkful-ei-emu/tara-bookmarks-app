'use strict';

const store = (function() {

  const addEntry = function(entry) {
    this.entries.push(entry);
  };

  const findById = function(id) {
    console.log(id);
    const entry = this.entries.find(entry => entry.id === id);
    return entry;
  };

  const modifyEntry = function(id, newData) {
    console.log('were modifying!');
    let item = this.findById(id);
    console.log(item);
    console.log(newData);
    Object.assign(item, newData);
  };

  const deleteEntry = function(id) {
    this.entries = this.entries.filter(entry => entry.id !== id);
  };

  const setFilter = function(num) {
    this.filter = num;
  };

  const setError = function (error) {
    this.error = error;
  };

  const setItemIsEditing = function(id) {
    let item = this.findById(id);
    item.isEditing = !item.isEditing;
  };

  return {
    entries: [],
    filter: null,
    error: null,
    addEntry,
    findById,
    modifyEntry,
    deleteEntry,
    setFilter,
    setError,
    setItemIsEditing
  };
  
})();