let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection")

  fetch('http://localhost:3000/toys')   /*fetch request to pull data from the API, JSON the data and appends them to the DOM with help from pullToys */
  .then(response => response.json())
  .then(data => pullToys(data))
  
  function pullToys(toys) {
    toys.map((toy)=> {                              /*Running through all toys and filling them in to match the layout in readme.*/
      toyCollection.innerHTML +=                           /*adds the layout to the correct container for each toy */
      `<div class="card">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar"/>
      <p>${toy.likes} Likes </p>
      <button class="like-btn" id=${toy.id}>Like <3</button>
      <button class="delete-btn" id=${toy.id}>Delete</button>
      </div>`
    })

    toyFormContainer.addEventListener('submit', (event)=>{      /*Event listener needed to grab new toy info once its submitted */
      event.preventDefault();                                   /* Prevents the page from reloading */
      const toyName = event.target.name.value                    /*Assigns user input to these variables */
      const toyImage = event.target.image.value
      fetch('http://localhost:3000/toys', {                     /*post fetch data to the database */
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',                   /*makes sure that the data is sent and received in the correct form */
          'Accept': 'application/json'
        },
        body: JSON.stringify({                                  /*saves this data on the back end */
          name: toyName,
          image: toyImage,
          likes: 1
        })
      }) 
      .then(response => response.json())
      .then(data => {
        toyCollection.innerHTML +=                           /*adds the layout to the correct container for each toy */
        `<div class="card">
        <h2>${data.name}</h2>
        <img src=${data.image} class="toy-avatar"/>           
        <p>${data.likes} Likes </p>
        <button class="like-btn" id=${data.id}>Like <3</button>
        <button class="delete-btn" id=${data.id}>Delete</button>
        </div>`                                              /*Displays the new toy on the page */
        event.target.reset()
      })
    })
    toyCollection.addEventListener('click', (event)=> {       /*listens for a click on the like button */
      if (event.target.className === "like-btn"){
        let likeCount = parseInt(event.target.previousElementSibling.innerText)     /*grabs the current like count from the page and sets it to a variable */
        let newLikeCount = likeCount + 1                      /*Adds to the like count in a new variable */
        fetch(`http://localhost:3000/toys/${event.target.id}`, {      /*submits the like update to the specific toy */
          method: 'PATCH',
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            likes: newLikeCount
          })
        })
        .then(response => response.json())
        .then(data => {
          event.target.previousElementSibling.innerText = `${data.likes} Likes`   /*Updates the page to show the same amount of likes. */
        })
      }
      if (event.target.className === "delete-btn"){                       /*if the event listener "click" happens on delete, run this code */
        fetch(`http://localhost:3000/toys/${event.target.id}`, {        /*fetches specific toy */
          method: 'DELETE'
      })
      .then(response => {
        event.target.parentElement.remove()
      })
    }
  })
}

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


