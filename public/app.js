const numberUI = document.getElementById("number");
const outputUI = document.getElementById("output");
const jokeFormUI = document.getElementById("joke-form");
const clearAllUI = document.getElementById("clear-all");
const jokeCategoryUI = document.getElementById("joke-category");
const firstNameUI = document.getElementById("first-name");
const lastNameUI = document.getElementById("last-name");
const numberOfJokesUI = document.getElementById("number-of-jokes");
const jokeCategoriesUI = document.getElementById("joke-categories");

// calling getTotalNumberOfJokes function
getTotalNumberOfJokes();

// calling getJokeCategories function
getJokeCategories();

// Listen for submit
jokeFormUI.addEventListener("submit", function (e) {
  // Prevent default
  e.preventDefault();

  if (
    numberUI.value === "" ||
    parseInt(numberUI.value) <= 0 ||
    firstNameUI.value.trim() === "" ||
    lastNameUI.value.trim() === ""
  ) {
    outputUI.innerHTML = `<p class="text-lg text-red-600">Please fill the above form.</p>`;
    // alert
    firstNameUI.setAttribute("placeholder", "First Name is Required");
  } else {
    //  *** REFACTOR ***
    // Default value of output
    let output = "";

    // initiate xhr object
    const xhr = new XMLHttpRequest();

    // open
    xhr.open(
      "GET",
      `https://api.icndb.com/jokes/random/${
        numberUI.value
      }?firstName=${firstNameUI.value.trim()}&lastName=${lastNameUI.value.trim()}&limitTo=[${
        jokeCategoryUI.value
      }]`,
      true
    );

    // show the loader/spinner
    xhr.onprogress = function () {
      outputUI.innerHTML = `<img class="block w-3/12 mx-auto" src="./img/loading-buffering.gif" alt="loading" />`;
    };

    // on load
    xhr.onload = function () {
      if (this.status === 200) {
        output += "<ul>";
        const response = JSON.parse(this.responseText);

        if (response.type === "success") {
          response.value.forEach(function (joke) {
            output += `<li class="py-5 px-3 shadow-sm bg-gray-50 my-5 rounded-sm">${joke.joke}</li>`;
          });
        } else {
          output += `<li>Something went wrong</li>`;
        }
        output += `</ul>`;

        outputUI.innerHTML = output;

        // clear fields
        numberUI.value = "";
        firstNameUI.value = "";
        lastNameUI.value = "";
      }
    };

    // send
    xhr.send();
    //  *** REFACTOR ***
  }
});

// Add event listener for clear all
clearAllUI.addEventListener("click", function (e) {
  window.location.reload();
});

// Get total number of jokes
function getTotalNumberOfJokes() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "http://api.icndb.com/jokes/count", true);

  xhr.onload = function () {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText);

      if (response.type === "success") {
        numberOfJokesUI.textContent = response.value;
      } else {
        numberOfJokesUI.textContent = "Something went wrong.";
      }
    }
  };

  xhr.send();
}

// Get joke categories
function getJokeCategories() {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "http://api.icndb.com/categories", true);

  xhr.onload = function () {
    if ((this.status = 200)) {
      const jokeCategories = JSON.parse(this.responseText);

      let output = "";
      if (jokeCategories.type === "success") {
        jokeCategories.value.forEach(function (item) {
          output += `<li>${item}</li>`;
        });
      } else {
        output += `<li>Something went wrong.</li>`;
      }
      jokeCategoriesUI.innerHTML = output;
    }
  };

  xhr.send();
}
