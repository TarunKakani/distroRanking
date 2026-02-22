let distros = [];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

const K = 32

function getExpectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function calculateElo(winnerRating, loserRating) {
  const expectedWinner = getExpectedScore(winnerRating, loserRating);
  const expectedLoser = getExpectedScore(loserRating, winnerRating);

  const newWinnerRating = winnerRating + K * (1 - expectedWinner)
  const newLoserRating = loserRating + K * (0 - expectedLoser)

  return [Math.round(newWinnerRating), Math.round(newLoserRating)] // return a array [newWinnerRating, newLoserRating]
}

function randomDistroIndex() {
  return Math.floor(Math.random() * distros.length);
}

function updateChallenger(event) {
  const winnerButton = event.currentTarget; // this will be the button you click
  const winnerId = winnerButton.id;

  let loserButton; // this should be the one to change
  if (winnerId === "button1") {
    loserButton = document.getElementById("button2");
  }
  else {
    loserButton = document.getElementById("button1");
  }

  const winnerName = winnerButton.querySelector("span").textContent;
  const loserName = loserButton.querySelector("span").textContent;

  const winnerIndex = distros.findIndex((d) => d.name === winnerName);
  const loserIndex = distros.findIndex((d) => d.name === loserName);

  if (winnerIndex === -1 || loserIndex === -1) return; 

  const currentWinnerRating = distros[winnerIndex].rating || 1200;
  const currentLoserRating = distros[loserIndex].rating || 1200;
  

  // send the rating back to api (with patch request)
  async function updateBackend(distroName, newRating){
    try{
      await fetch("http://localhost:4444/api/update-rating",{
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: distroName,
          rating: newRating
        })
      });
    }
    catch (err){
      console.error("Failed to save rating", err);
    }
  }

  const [newWinnerRating, newLoserRating] = calculateElo(
    currentWinnerRating, 
    currentLoserRating
  );

  // update the local array
  distros[winnerIndex].rating = newWinnerRating;
  distros[loserIndex].rating = newLoserRating;

  console.log(`${winnerName}: ${currentWinnerRating} -> ${newWinnerRating}`);
  console.log(`${loserName}: ${currentLoserRating} -> ${newLoserRating}`);
  
  updateBackend(winnerName, newWinnerRating);
  updateBackend(loserName, newLoserRating);

  if (document.startViewTransition) {
    document.startViewTransition(() => renderLeaderboard());
  } else {
    renderLeaderboard(); 
  }

  let newIndex = randomDistroIndex();

  // if newIndex and winnerIndex become same
  while (newIndex === winnerIndex) {
    newIndex = randomDistroIndex();
  }

  // now lets update the loser button
  loserButton.querySelector("span").textContent = distros[newIndex].name;
}

function displayDistro() {

  if (distros.length === 0) return;

  let rand1 = randomDistroIndex();
  let rand2 = randomDistroIndex();

  while (rand1 === rand2) {
    rand2 = randomDistroIndex();
  }

  document.getElementById("distro-1").textContent = distros[rand1].name; // we combine the both and get the array index of distro and its name which is the string
  document.getElementById("distro-2").textContent = distros[rand2].name;
}

function renderLeaderboard(){
  const leaderboardList = document.getElementById("leaderboard-list")

  leaderboardList.innerHTML = "";

  const sortedDistros = [...distros].sort((a,b) => b.rating - a.rating);

  sortedDistros.forEach((distro) => {
    const listItem = document.createElement("li");

    const currentRating = distro.rating || 1200;

    // This wraps the name and rating in spans so we can push them to opposite sides
    listItem.innerHTML = `<span class="distro-name">${distro.name}</span> <span class="distro-rating">${currentRating}</span>`;

    const safeName = distro.name.replace(/[^a-zA-Z0-9]/g, "");
    listItem.style.viewTransitionName = `distro-${safeName}`;

    leaderboardList.appendChild(listItem);
  });
}

// function to fetch the api route data
async function init() {
  try {
    const response = await fetch("http://localhost:4444/api/distros");
    distros = await response.json() // this will fill the array

    displayDistro();
    renderLeaderboard(); // update when the page loads
  }
  catch (error) {
    console.error("Error fetching distros:", error);
    document.getElementById("distro-1").textContent = "Error Loading";
  }
}

button1.addEventListener("click", updateChallenger);
button2.addEventListener("click", updateChallenger);

init();