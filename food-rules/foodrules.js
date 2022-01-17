const TABLE_NAME = "foodrules_os";

let db;
let table;
function load() {
  newRule();
  table = document.querySelector("#foods");

  let request = indexedDB.open("foodrules_db", 2);

  request.onerror = function () {
    console.log("Database failed to open");
  };

  request.onupgradeneeded = function (e) {
    let db = e.target.result; // Get a reference to the opened DB
    let objectStore = db.createObjectStore(TABLE_NAME, {
      // Create a "table"
      keyPath: "id",
      autoIncrement: true,
    });

    // Define what data items the objectStore will contain
    objectStore.createIndex("date", "date", { unique: true });
    objectStore.createIndex("food", "food", { unique: false });
    objectStore.createIndex("plants", "plants", { unique: false });
    objectStore.createIndex("amount", "amount", { unique: false });

    console.log("Database setup complete");
  };

  request.onsuccess = function () {
    console.log("Database successfully opened");
    db = request.result;

    displayData();
  };
}

function newRule() {
  let randomRule = rules[Math.floor(Math.random() * rules.length)];
  document.getElementById("rule").innerHTML = randomRule;
}

function submit() {
  let food = document.getElementById("food").value;
  let plants = document.getElementById("plants").value;
  let amount = document.getElementById("amount").value;
  let date = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  let newItem = { date: date, food: food, plants: plants, amount: amount };

  // open a read/write db transaction, ready for adding the data
  let transaction = db.transaction([TABLE_NAME], "readwrite");

  // call an object store that's already been added to the database
  let objectStore = transaction.objectStore(TABLE_NAME);

  // Make a request to add our newItem object to the object store
  let request = objectStore.add(newItem);
  request.onsuccess = function () {
    console.log(
      "food = " + food + ", plants = " + plants + ", amount = " + amount
    );
  };

  // Report on the success of the transaction completing, when everything is done
  transaction.oncomplete = function () {
    console.log("Transaction completed: database modification finished.");

    // update the display of data to show the newly added item, by running displayData() again.
    displayData();
  };

  transaction.onerror = function () {
    console.log("Transaction not opened due to error");
  };
}

function displayData() {
  // Delete all rows
  // If you didn't do this, you'd get duplicates listed each time a new note is added
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  createTableRow(table, "1", "Date", "Food", "Plants", "Amount", "Delete");

  // Open our object store and then get a cursor - which iterates through all the
  // different data items in the store
  let objectStore = db.transaction(TABLE_NAME).objectStore(TABLE_NAME);
  const deleteBtn = createDeleteButton();
  
  objectStore.openCursor().onsuccess = function (e) {
    // Get a reference to the cursor
    let cursor = e.target.result;
    // If there is still another data item to iterate through, keep running this code
    if (cursor) {
      // Create a list item, h3, and p to put each data item inside when displaying it
      // structure the HTML fragment, and append it inside the list

      createTableRow(
        table,
        cursor.value.id,
        cursor.value.date,
        cursor.value.food,
        cursor.value.plants,
        cursor.value.amount,
        "Delete (TODO)"
      );

      // Iterate to the next item in the cursor
      cursor.continue();
    }
  };
}

function createTableRow(table, rowID, date, food, plants, amount, deleteButton) {
  const row = table.insertRow();
  // Store the ID of the data item inside an attribute on the listItem, so we know
  // which item it corresponds to. This will be useful later when we want to delete items
  row.setAttribute("data-note-id", rowID);

  const dateCell = row.insertCell();
  const foodCell = row.insertCell();
  const plantsCell = row.insertCell();
  const amountCell = row.insertCell();
  const deleteCell = row.insertCell();

  dateCell.innerText = date;
  foodCell.innerText = food;
  plantsCell.innerText = plants;
  amountCell.innerText = amount;
  deleteCell.innerText = deleteButton;
}

function createDeleteButton() {
  // Create a button and place it inside each listItem
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = deleteItem;
  return deleteBtn;
}

function deleteItem(e) {
  // retrieve the name of the task we want to delete. We need
  // to convert it to a number before trying it use it with IDB; IDB key
  // values are type-sensitive.
  let noteId = Number(e.target.parentNode.getAttribute("data-note-id"));

  // open a database transaction and delete the task, finding it using the id we retrieved above
  let transaction = db.transaction([TABLE_NAME], "readwrite");
  let objectStore = transaction.objectStore(TABLE_NAME);
  let request = objectStore.delete(noteId);

  // report that the data item has been deleted
  transaction.oncomplete = function () {
    // delete the parent of the button, which is the row
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log("Note " + noteId + " deleted.");
  };
}

let rules = [
  "Eat food",
  "Don't eat anything your great grandmother wouldn't recognize as food",
  "Avoid food products containing ingredients that no ordinary human would keep in the pantry",
  "Avoid food products that contain high-fructose corn syrup",
  "Avoid food products that have some form of sugar (or sweetener) listed among the top three ingredients",
  "Avoid food products that have more than 5 ingredients",
  "Avoid food products containing ingredients that a third-grader cannot pronounce",
  "Avoid food products that make health claims",
  "Avoid food products with the word lite or the terms low fat or nonfat in their names",
  "Avoid foods that are pretending to be something they are not",
  "Avoid foods you see advertised on television",
  "Get out of the supermarket whenever you can (to buy food)",
  "Shop the peripheries of the supermarket and stay out of the middle",
  "Eat only foods that will eventually rot",
  "Eat foods made from ingredients that you can picture in their raw state or growing in nature",
  "Go food shopping every week",
  "Buy your snacks at the farmers market",
  "Eat Close to the Earth",
  "Eat only foods that have been cooked by humans",
  "Don't ingest foods made in places where everyone is required to wear a surgical cap",
  "If it came from a plant, eat it; if it was made in a plant, don't.",
  "It's not food if it arrived through the window of your car",
  "It's not food if it's called by the same name in every language (Think Big Mac, Cheetos or Pringles)",
  "When you eat real food, you don't need roles",
  "Eat mostly plants, especially leaves",
  "Treat meat as a flavoring or special occasion food",
  "Eating what stands on one leg [mushrooms and plant foods] is better than eating what stands on two legs [fowl], is better than eating what stands on four legs [cows, pigs and other mammals].",
  "Eat your colors",
  "Drink the spinach water",
  "Eat animals that have themselves eaten well",
  "If you have space, buy a freezer",
  "Eat like an omnivore (great diversity of species)",
  "Eat well-grown food from healthy soil",
  "Eat wild foods when you can",
  "Don't overlook the oily little fishes",
  "Eat some foods that have been predigested by bacterial or fungi",
  "Sweeten and salt your food yourself",
  "Eat sweet foods as you find them in nature",
  "Don't eat breakfast cereals that change the color of the milk",
  "Make water your beverage of choice",
  "Milk is a food, not a beverage",
  "The whiter the bread, the sooner you'll be dead",
  "Avoid sugary and starchy foods if you're concerned about weight",
  "Favor the kinds of oils and grains that have traditionally been stone ground",
  "Eat all the junk food you want as long as you cook it yourself",
  "Love your spices",
  "Be the kind of person who takes supplements - then skip the supplements",
  "Eat more lie the French. Or the Japanese. Or the Italians. Or the Greeks.",
  "Regard nontraditional foods with skepticism",
  "Avoid ingredients that lie to your body (artificial sweeteners and flavorings, starches, MMSG, texturizers)",
  "Enjoy drinks that have been caffeinated by nature not food science (coffee, tea)",
  "Have a glass of wine with dinner",
  "Pay more, eat less",
  "Eat less",
  "Stop eating before you're full",
  "Eat when you are hungry, not when you are bored",
  "If you're not hungry enough to eat an apple, then you're probably not hungry",
  "It's okay to be a little hungry",
  "Don't let yourself get too hungry",
  "Consult your gut (slow down and pay attention what your body is telling you)",
  "Serve the vegetables first",
  "Eat slowly (enough to savor your food; you'll need less of it to be satisfied)",
  "The banquet is in the first bite",
  "Spend as much time enjoying the meal as it took to prepare it",
  "Give some thought to where your food comes from",
  "Don't become a short order cook",
  "Buy smaller plates and glasses",
  "Serve a proper portion and don't go back for seconds",
  "Order the small (in a restaurant)",
  "Breakfast like a king, lunch like a prince, dinner like a pauper",
  "Eat meals (snacking less)",
  "Limit your snacks to unprocessed plant foods",
  "Do all your eating at a table",
  "Don't get your fuel from the same place your car does",
  "No labels on the table (keep logos and food packaging off the dinner table)",
  "Place a bouquet of flowers on the table and everything will taste twice as good",
  "Leave something on your plate",
  "Eat with other people whenever you can",
  "Treat treats as treats",
  "Compost",
  "Plant a vegetable garden if you have space, a window box if you don't",
  "Cook",
  "Break the rules once in a while",
];
