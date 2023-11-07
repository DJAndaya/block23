const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});


describe("addNewPlayer & fetchSinglePlayer", () => {

  let player;
  beforeAll(async () => {
    await addNewPlayer({name: "test", breed: "test", imageUrl: "test" });

    const players = await fetchAllPlayers();
    for (let eachPlayer of players) {
      if (eachPlayer.name === "test") {
        let playerId = eachPlayer.id
        player = await fetchSinglePlayer(playerId)
      }
    }
  })

  test("returns an array", async () => {
    expect(Array.isArray(player)).toBe(true);
  })

  test("returns player with name and id", async () => {
    expect(player).toHaveProperty("name")
    expect(player).toHaveProperty("id")
  });
});
// TODO: Tests for `fetchSinglePlayer`

// TODO: Tests for `addNewPlayer`

// (Optional) TODO: Tests for `removePlayer`

// (Optional) TODO: Tests for `render` functions
