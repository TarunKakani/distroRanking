let distros = [];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

// these two rand1 and rand2 options should be displayed on two id's
// the buttons will trigger a action event which will the elo ranking system
// then the according to the elo the leaderboard will get updated live

function randomDistroIndex(){
  return Math.floor(Math.random() * distros.length);
}

function updateChallenger(event){
  const winnerButton = event.currentTarget; // this will be the button you click
  const winnerId = winnerButton.id;

  let loserButton; // this should be the one to change
  if (winnerId === "button1"){
    loserButton = document.getElementById("button2");
  }
  else{
    loserButton = document.getElementById("button1");
  }

  const winnerName = winnerButton.querySelector("p").textContent;
  const winnerIndex = distros.findIndex(d => d.name === winnerName);

  let newIndex = randomDistroIndex();
  
  // if newIndex and winnerIndex become same
  while (newIndex === winnerIndex){
    newIndex = randomDistroIndex();
  }

  // now lets update the looser button
  loserButton.querySelector("p").textContent = distros[newIndex].name;

  // update the elo logic
  //
}

function displayDistro(){

  if (distros.length === 0) return;

  let rand1 = randomDistroIndex();
  let rand2 = randomDistroIndex();
  
  while (rand1 === rand2){
    rand2 = randomDistroIndex();
  }

  document.getElementById("distro-1").textContent = distros[rand1].name; // we combine the both and get the array index of distro and its name which is the string
  document.getElementById("distro-2").textContent = distros[rand2].name;
}

// function to fetch the api route data
async function init() {
  try{
    const response = await fetch("http://localhost:4444/api/distros");
    distros = await response.json() // this will fill the array

    displayDistro();   
  }
  catch(error){
    console.error("Error fetching distros:", error);
    document.getElementById("distro-1").textContent = "Error Loading";
  }
}

button1.addEventListener("click", updateChallenger);
button2.addEventListener("click", updateChallenger);

init();