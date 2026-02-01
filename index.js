let distros = [];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

// these two rand1 and rand2 options should be displayed on two id's
// the buttons will trigger a action event which will the elo ranking system
// then the according to the elo the leaderboard will get updated live

function displayDistro(event){

  if (distros.length === 0) return;

  let rand1 = Math.floor(Math.random() * distros.length); // this returns a index
  let rand2 = Math.floor(Math.random() * distros.length);

  // if rand1 and rand2 give same values by chance
  while (rand1 === rand2){
    rand2 = Math.floor(Math.random() * distros.length);
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

button1.addEventListener("click", displayDistro);
button2.addEventListener("click", displayDistro);

init();