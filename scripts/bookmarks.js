'use strict';
/*global bookmarks*/

const bookmarks = (function() {
  $.fn.extend({
    serializeJson: function() {
      const formData = new FormData(this[0]);
      console.log(formData);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      console.log(o);
      return JSON.stringify(o);
    }
  });

  const generateElement = function(entry) {
    console.log('we\'re generating an element!');
    
    let starElement = '';

    for (let i = 0; i < entry.rating; i++) {
      starElement += '<i class="fas fa-star"></i>';
    }

    return `<li class="bookmark-entry" data-item-id="${entry.id}">
    <div class="collapsible">
        <h3 class="bookmark-title">${entry.title}</h3>
        <p class="bookmark-rating">${starElement}</p>
    </div>
    <div class="expandible-content hidden">
        <p class="bookmark-description">${entry.desc}</p>
        <a class="bookmark-link" href="${entry.url}">Visit site</a>
        <button class="edit">Edit entry</button>
        <button class="delete">Delete entry</button>
    </div>

  </li>`;
  };

  const generateListString = function() {
    let htmlString = '';
    store.entries.forEach(entry => {
      htmlString += generateElement(entry);
    });
    return htmlString;
  };
  
  const render = function() {
    $('#bookmarks-list').html(generateListString());
  };

  const getIDFromElement = function(entry) {
    return $(entry).closest('.bookmark-entry').data('item-id');
  };
  
  const handleNewEntrySubmit = function() {
    $('#add-bookmark').submit(function(event) {
      event.preventDefault();
      $(event.currentTarget).find('.js-button')
        .toggleClass('hidden');
      $(event.currentTarget).find('.collapsible-add-form')
        .toggleClass('hidden');
      const formData = $(event.target).serializeJson();
      console.log(formData);
      api.createEntry(formData)
        .then((entry) => {
          store.addEntry(entry);
          render();
        })
        .catch(error => {
          store.setError(error);
          render();
        });
    });
  };
  
  const handleEntryStartAdding = function() {
    $('#add-bookmark').on('click', '.js-button', event => {
      event.preventDefault();
      console.log('We\'re adding an item!');
      $(event.currentTarget).closest('form').find('.collapsible-add-form')
        .toggleClass('hidden');
      $(event.currentTarget).toggleClass('hidden');
    });
  };

  const handleEntryExpand = function() {
    $('#bookmarks-list').on('click', '.collapsible', function(event) {
      console.log('WE\'RE EXPANDING');
      $(event.currentTarget).closest('.bookmark-entry').find('.expandible-content')
        .toggleClass('hidden');
    });
  };

  const handleEntryDelete = function() {
    $('#bookmarks-list').on('click', '.delete', event => {
      const id = getIDFromElement(event.currentTarget);
      console.log(id);
      api.deleteEntry(id);
      store.deleteEntry(id);
      render();
    });
  };

  const handleEntryStartEditing = function() {

  };

  const handleEditingSubmit = function() {

  };

  const handleFilter = function() {

  };

  const bindEventListeners = function() {
    handleNewEntrySubmit();
    handleEntryStartAdding();
    handleEntryExpand();
    handleEntryDelete();
    handleEntryStartEditing();
    handleEditingSubmit();
    handleFilter();
  };

  return {
    bindEventListeners,
    render,
    generateElement,
    generateListString,
    getIDFromElement,
  };

})();