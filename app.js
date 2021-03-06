// Storage Controller
const StorageCtrl = (function() {
  // public methods
  return {
    storeItem: function(item) {
      let items;
      // check if any items in ls
      if (
        localStorage.getItem("items") === null ||
        localStorage.getItem("items") === ""
      ) {
        items = [];
        // push new item
        items.push(item);
        // set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get all existing items in ls
        items = JSON.parse(localStorage.getItem("items"));
        // push new item
        items.push(item);
        // re-set ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (
        localStorage.getItem("items") === null ||
        localStorage.getItem("items") === ""
      ) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      // get all existing items
      let items = JSON.parse(localStorage.getItem("items"));
      // find and replace updated item
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      // re-set items in ls
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemStorage: function(deletedItemId) {
      // get all existing items
      let items = JSON.parse(localStorage.getItem("items"));
      // find and delete the item by id
      items.forEach((item, index) => {
        if (deletedItemId === item.id) {
          items.splice(index, 1);
        }
      });
      // re-set items in ls
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteAllItemsFromStorage: function() {
      // clear items in ls
      localStorage.setItem("items", []);
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = parseInt(calories);
  };

  // Data Structure / State
  const data = {
    // items: [
    //   new Item(0, "Steak Dinner", 1200),
    //   new Item(1, "Muffin", 500),
    //   new Item(2, "Pizza", 700)
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // create unique ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // create new item
      newItem = new Item(ID, name, calories);
      // add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let foundItem = null;
      data.items.forEach(item => {
        if (item.id === id) {
          foundItem = item;
        }
      });
      return foundItem;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let foundItem = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          foundItem = item;
        }
      });
      return foundItem;
    },
    deleteItem: function(id) {
      // get ids
      ids = data.items.map(item => item.id);

      // get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    getTotalCalories: function() {
      let totalCalories = 0;

      // add up all item calories
      for (let item of data.items) {
        totalCalories += item.calories;
      }

      // set total cal in data structure
      data.totalCalories = totalCalories;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    deleteBtn: ".delete-btn",
    updateBtn: ".update-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  return {
    populateItemList: function(items) {
      let html = ``;
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // create li element
      const li = document.createElement("li");
      // add Class
      li.className = "collection-item";
      // add ID
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn Nodelist into array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInputFields: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    clearItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn node list into array
      listItems = Array.from(listItems);
      // remove every item
      listItems.forEach(item => item.remove());
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories(calories) {
      document.querySelector(UISelectors.totalCalories).textContent = calories;
    },
    clearEditState: function() {
      UICtrl.clearInputFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load all event listeners
  const loadEventListeners = function() {
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // disable submit on Enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // update btn click event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // back btn click event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // delete item click event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // clear items click event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // Add Item submit
  const itemAddSubmit = function(e) {
    e.preventDefault();
    // get form input from UI controller
    const input = UICtrl.getItemInput();

    // check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add item to UI list
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // clear input fields
      UICtrl.clearInputFields();

      // store in local storage
      StorageCtrl.storeItem(newItem);
    }
  };

  // Edit Item click
  const itemEditClick = function(e) {
    e.preventDefault();

    // make sure that a click happened on an 'edit btn'
    if (e.target.classList.contains("edit-item")) {
      // get list item id
      const listId = e.target.parentNode.parentNode.id;

      // extract an actual id from the className
      const id = parseInt(listId.split("-")[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm();
    }
  };

  // Update item submit
  const itemUpdateSubmit = function(e) {
    e.preventDefault();
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update ls
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
  };

  // delete btn event
  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete from ls
    StorageCtrl.deleteItemStorage(currentItem.id);

    UICtrl.clearEditState();
  };

  // clear items event
  const clearAllItemsClick = function() {
    // delete all items from data structure
    ItemCtrl.clearAllItems();

    // remove all items from UI
    UICtrl.clearItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete all from the storage
    StorageCtrl.deleteAllItemsFromStorage();

    // hide the list
    UICtrl.hideList();
  };
  // Public methods
  return {
    init: function() {
      //console.log("Initializing App...");
      // Clear Edit state / set initital state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Popultate list with items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
