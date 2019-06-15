'use strict';
/*global store, api*/

const bookmarks = (function() {
  $.fn.extend({
    serializeJson: function() {
      const formData = new FormData(this[0]);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  const generateElement = function(entry, entryNum) {
    console.log('we\'re generating an element!');
    let element = '';

    if (entry.isEditing) {
      element = 
      `<div class="col">
        <li class="bookmark-entry" data-item-id="${entry.id}">
        <form class="js-edit-item">
          <div class="collapsible">
            <h3 class="bookmark-title">${entry.title}</h3>
          </div>
          <div class="editing-item">
            <label for="rating-edit">Change rating:</label>
            <input type="number" name="rating" id="rating-edit" value="${entry.rating}">
          </div>
          <div class="expandible-content">
              <textarea name="desc" id="edit-description" rows="5" cols="50">${entry.desc}</textarea>
          </div>
          <button type="submit">Save changes</button>
          <button class="cancel">Cancel</button>
        </form>
      </li>
    </div>`;
    }
    
    else {
      let starElement = '';

      for (let i = 0; i < entry.rating; i++) {
        starElement += '<i class="fas fa-star"></i>';
      }
  
      element = `
      <div class="col">
        <li class="bookmark-entry" data-item-id="${entry.id}">
        <div class="collapsible">
            <h3 class="bookmark-title">${entry.title}</h3>
            <p class="bookmark-rating">${starElement}</p>
            <button class="expand-toggle">Expand</button>
        </div>
        <div class="expandible-content hidden">
            <p class="bookmark-description">${entry.desc}</p>
            <a class="bookmark-link" href="${entry.url}">Visit Site</a>
            <button class="edit">Edit entry</button>
            <button class="delete">Delete entry</button>
            <button class="expand-toggle hidden">Collapse</button>
        </div>
      </li>
    </div>`;
    }

    if ((entryNum % 3 === 1)) {
      return `<div class="row">${element}`;
    }
    
    else if ((entryNum % 3 === 0)) {
      return `${element}</div>`;
    }

    else {
      return element;
    }
   
  };

  const generateListString = function() {
    let htmlString = '';
    let entries = [...store.entries];
    if (store.filter) {
      console.log('were filtering!');
      entries = entries.filter(entry => entry.rating >= store.filter);
    }
    
    let entryNum = 1;

    entries.forEach(entry => {
      console.log(entryNum);
      htmlString += generateElement(entry, entryNum);
      entryNum ++;
    });
    return htmlString;
  };
  
  const render = function() {
    console.log('were rendering!');
    if (store.error) {
      $('.list-section').prepend(`<p id="error-message">Could not complete request: ${store.error.message}.<p>`);
      store.error = null;
    }
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
      $(event.currentTarget).closest('form').find('.collapsible-add-form')
        .toggleClass('hidden');
      $(event.currentTarget).toggleClass('hidden');
      $('#add-bookmark-title').focus();
    });
  };

  const handleEntryAddCancel = function() {
    $('#add-bookmark').on('click', '.cancel', event => {
      event.preventDefault();
      $(event.currentTarget).closest('form').find('.collapsible-add-form')
        .toggleClass('hidden');
      $(event.currentTarget).closest('form').find('.js-button').toggleClass('hidden');
    });
  };

  const handleEntryExpand = function() {
    $('#bookmarks-list').on('click', '.expand-toggle', function(event) {
      console.log('WE\'RE EXPANDING');
      $(event.currentTarget).closest('.bookmark-entry').find('.expandible-content')
        .toggleClass('hidden');
      $(event.target).closest('.bookmark-entry').find('.expand-toggle').toggleClass('hidden');
  
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
    $('#bookmarks-list').on('click', '.edit', event => {
      const id = getIDFromElement(event.currentTarget);
      store.setItemIsEditing(id);
      render();
      $('#rating-edit').focus();
    });
  };

  const handleEditingSubmit = function() {
    $('#bookmarks-list').on('submit', '.js-edit-item', event => {
      console.log('something was editef!');
      event.preventDefault();
      const id = getIDFromElement(event.currentTarget);
      console.log(id);
      const formData = $(event.target).serializeJson();
      const newEntry = JSON.parse(formData);
      console.log(formData);
      api.modifyEntry(id, formData)
        .then(() => {
          store.modifyEntry(id, newEntry);
          store.setItemIsEditing(id);
          render();
        })
        .catch(error => {
          store.setError(error);
          store.setItemIsEditing(id);
          render();
        });
    });
  };

  const handleEditingCancel = function() {
    $('#bookmarks-list').on('click', '.cancel', event => {
      const id = getIDFromElement(event.currentTarget);
      store.setItemIsEditing(id);
      render();
    });
  };

  const handleFilter = function() {
    $('#search-controls').submit(event => {
      event.preventDefault();
      const filterVal = $('#minimum-rating').val();
      $('#minimum-rating').val();
      store.setFilter(filterVal);
      render();
    });
  };

  const handleShowAll = function() {
    $('#search-controls').on('click', '.show-all', function(event) {
      event.preventDefault();
      console.log('lets show all');
      store.filter = null;
      render();
    });
  };

  const bindEventListeners = function() {
    handleNewEntrySubmit();
    handleEntryStartAdding();
    handleEntryExpand();
    handleEntryDelete();
    handleEntryStartEditing();
    handleEditingSubmit();
    handleFilter();
    handleEditingCancel();
    handleEntryAddCancel();
    handleShowAll();
  };

  return {
    bindEventListeners,
    render,
    generateElement,
    generateListString,
    getIDFromElement
  };

})();