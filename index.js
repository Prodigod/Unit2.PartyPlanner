/**A user enters the website and finds a list of the names, dates, times, locations, and descriptions of all the parties that are happening.
Next to each party in the list is a delete button. The user clicks the delete button for one of the parties. That party is then removed from the list.
There is also a form that allows the user to enter information about a new party that they want to schedule. After filling out the form and submitting it, the user observes their party added to the list of parties.



Which components can be created directly in the HTML? Which components need to be created in JavaScript?
Can you render mock data to the page?
Can you render real data to the page?
Are you able to fetch an array of all the parties from the API?
Is state correctly updated to match the data from the API?
Are you passing the correct arguments to fetch?
Does the API return an error? If so, what is the error message?
Is there an event listener on the form? Does it correctly add a new party to the list of parties?
Is there an event listener attached to each delete button? Does it correctly remove a party from the list of parties?

Getting Started */



const COHORT = "2109-CPU-RM-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;


// ===state==


   let events = [];




/** Updates state with artists from API */

async function getEvents() {
    try {
    const response = await fetch(API_URL); 
    const json = await response.json();
    events = json.data
    } catch (e) {
    console.error(e);
    }
    }
   
    

    /** Updates state with events from USER */
    async function addEvent(event) {
        try { const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });
            
        const json = await response.json();
        if (json.error) {
            throw new Error(json.error.message);
        }
        } catch (error) {
            console.error(error);

        }
    }

    const deleteEvent = async(id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const parsed = await response.json();
                throw new Error(parsed.error.message);
            }
        } catch (e) {
            console.error(e)
        }
   };

// ===Render===
//Renders the events as a list

async function renderEvents() {
const $eventList = document.querySelector(".events");

if (events.length <= 0) {
    $eventList.innerHTML = `<li> No parties</li>`;
    return;
}


    const $events = events.map((event) => {
        const $li = document.createElement("li")
        $li.innerHTML =  `<h2>${event.name}</h2>
        <time datetime="${event.date}">${event.date.slice(0, 10)}</time>
        <address>${event.location}</address>
        <p>${event.description}</p>
        <button>Delete Party</button>
    `;
    const $button = $li.querySelector("button");
    $button.addEventListener("click", async () => {
        await deleteEvent(event.id);  
        await getEvents();
        renderEvents();
    });
    $eventList.appendChild($li);
    });
}

    





//script


async function init() {
    await getEvents();
    renderEvents();
}

init();


//handler for form submission 
const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const date = new Date($form.date.value).toISOString();
    const event = {
        name: $form.name.value,
        description: $form.description.value,
        date,
        location: $form.location.value,

    };

    await addEvent(event);

    await getEvents();
    renderEvents();
  });
  