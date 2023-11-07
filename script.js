// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2306-fsa-et-web-pt-sf";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const main = document.querySelector("main")

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL)
    let allPlayers = await response.json();
    allPlayers = allPlayers.data.players
    // console.log(allPlayers)
    return allPlayers
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

fetchAllPlayers()

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/${playerId}`);
    let singlePlayer = await response.json();
    singlePlayer = singlePlayer.data.player
    // console.log(singlePlayer)
    return singlePlayer;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

fetchSinglePlayer(215)

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playerObj.name,
        breed: playerObj.breed,
        status: "bench",
        imageUrl: playerObj.imageUrl
      }),
    });
    
    const result = await response.json();
    init()
    return result
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/${playerId}`,
    {
      method: "DELETE"
    });
    // console.log(response)
    const result = await response.json();
    // console.log(result)
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  try {
    // console.log(playerList)
    main.innerHTML = ""
    playerList.forEach((player) => {
      const playersInfo = document.createElement("div")

      if (player.id === undefined) {
        playersInfo.innerHTML = `There are currently no players`;
      }

      playersInfo.innerHTML = `
        <h2>${player.name}</h2>
        <p>ID: ${player.id}</p>
        <img src="${player.imageUrl}" alt="${player.name}">
        <button id="more-details-button">See More Details</button>
        <button id="remove-player-button">Remove Player</button>
        <hr />
      `
      
      main.appendChild(playersInfo)

      const detailButton = playersInfo.querySelector("#more-details-button")
      detailButton.addEventListener("click", async (event) => {
        // console.log("I work")
        renderSinglePlayer(player.id);
      })

      const removeButton = playersInfo.querySelector("#remove-player-button")
      removeButton.addEventListener("click", async (event) => {
        console.log("I work too")
        removePlayer(player.id)
      })

    })
  } catch (error) {
    console.error(error)
  }
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = async (playerId) => {
  main.innerHTML = "";
  let singlePlayerDetails = await fetchSinglePlayer(playerId)
  
  console.log(singlePlayerDetails)
  // console.log("I'm working")

  if (!singlePlayerDetails.team || !singlePlayerDetails.team.name) {
    singlePlayerDetails.team = {};
    singlePlayerDetails.team.name = "Unassigned"

  };
  console.log(singlePlayerDetails.imageURL)
  const playersInfo = document.createElement("div")
  playersInfo.innerHTML = `
    <h2>${singlePlayerDetails.name}</h2>
    <p>ID: ${singlePlayerDetails.id}</p>
    <p>${singlePlayerDetails.breed}</p>
    <img src="${singlePlayerDetails.imageUrl}" alt="${singlePlayerDetails.name}">
    <p>Team: ${singlePlayerDetails.team.name}</p>
    <button id="back-to-all-players-button">Back to all players</button>
  `

  main.appendChild(playersInfo)

  const backToAllPlayersButton = playersInfo.querySelector("#back-to-all-players-button")
  backToAllPlayersButton.addEventListener("click", async (event) => {
    init()
  })
  // // singlePlayerDetails.forEach((player) => {
    
  //   if (player.team.name === undefined) {
  //     player.team.name = "Unassigned"
  //   }

  //   playersInfo.innerHTML = `
  //     <h2>${player.name}</h2>
  //   `
  // // })
  // // const moreDetails = document.createElement("div")
  
  // // moreDetails.innerHTML = `
  // //   <h2>${singlePLayerDetails.name}
  // // `
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {

    const newPlayerForm = document.querySelector("#new-player-form")
    // newPlayerForm.method = "post"
    
    newPlayerForm.innerHTML = `
      <input id = "input-player-name" placeholder = "Puppy's Name" /> 
      <input id = "input-breed-name" placeholder = "Puppy's Breed" />
      <input id = "input-image-url" placeholder = "URL Image of Puppy" />
      <button id= "submit-new-player-form-button">Submit Form</button>
    `
    const inputPlayerName = newPlayerForm.querySelector("#input-player-name")
    const inputBreedName = newPlayerForm.querySelector("#input-breed-name")
    const inputImageUrlName = newPlayerForm.querySelector("#input-image-url")
    const submitNewPlayerFormButton = newPlayerForm.querySelector("#submit-new-player-form-button")

    submitNewPlayerFormButton.addEventListener("click", async () => {
      // console.log("I work")
      addNewPlayer({name: inputPlayerName.value, breed: inputBreedName.value, imageUrl: inputImageUrlName.value });
      const players = await fetchAllPlayers();
      renderAllPlayers(players);

    })
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}


//learn form