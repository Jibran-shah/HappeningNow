const baseUrl = "https://app.ticketmaster.com/discovery/v2/"
const apiKey = "vAljgX3WmjcytECApV0sMlJ9Bmsvx4T1";
const categorySelector = document.getElementById("categorySelector");
const eventsContainer = document.getElementById("eventsContainer");
const paginationAL = document.getElementById("pagination-arrow-left");
const paginationAR = document.getElementById("pagination-arrow-right");
const dateInput = document.getElementById("dateInput");
const keywordsInput = document.getElementById("keywordsInput");
const dateFilterButton = document.getElementById("dateFilterButton");
const loadingIdicator = document.getElementById("loadingIdicator");


hideElement(paginationAL)


let pageNo = 0;
let totalPages = 0;
let filterId = localStorage.getItem("filterId");
let keywords = "";
let dateInputValue = ""

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

loadFilters();
loadEvents(filterId,pageNo);

function makeOption(segment){
    const option = document.createElement("option");
    option.value = segment.id;
    option.textContent = segment.name;
    return option;
}

function loadFilters(){

    fetch(`${baseUrl}classifications.json?apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {

                categorySelector.innerHTML = "";

                if (data._embedded && data._embedded.classifications) {
                    data._embedded.classifications
                    .forEach(classification => {
                        if (classification.segment) {
                            const option = makeOption(classification.segment)
                            categorySelector.appendChild(option);
                        }
                    });

                } else {
                    const option = document.createElement("option");
                    option.textContent = "No categories found";
                    categorySelector.appendChild(option);

                }

                categorySelector.value = filterId;
    })

    .catch(error => {

        const option = document.createElement("option");
        option.textContent = "Error loading categories";
        categorySelector.appendChild(option);
    });
}







function loadEvents(filterId, pageNo, keywords = "", date = ""){

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    loadingIdicator.style.display = "block"

    const url = makeUrl(filterId, pageNo,keywords,date);

    fetch(url, { signal: controller.signal })
    .then(response => {
        clearTimeout(timeoutId);
        return response.json();
    })
    .then(data=>{
            
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        if(data.page && data.page.totalPages){
            totalPages = data.page.totalPages;
        }
    
        eventsContainer.innerHTML = "";
        if(data._embedded && data._embedded.events) {
            
            data._embedded.events.forEach(event => {
                const eventCard = makeEventCard(event,favorites);
                eventsContainer.appendChild(eventCard);
            });

        } 
        else {
            eventsContainer.innerHTML = "No events found."
        }
        loadingIdicator.style.display = "none"
    })
    .catch(error => {
        if (error.name === 'AbortError') {
            console.error('Fetch request timed out!');
            eventsContainer.innerHTML = "Request Time Out."
        } else {
            console.error('Fetch error:', error);
            eventsContainer.innerHTML = "An Error Occured While Tetching"
        }
        loadingIdicator.style.display = "none"
    });

}



function addToFavorites(button){

    const svg = button.querySelector("svg");

    svg.classList.toggle("isFavorite-svg");

    const eventId = button.getAttribute("event-id");
    const eventName = button.getAttribute("event-name");

    const event = {
        id:eventId,
        name:eventName
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!isEventFavorite(event,favorites)) {
        favorites.push(event);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}






categorySelector.addEventListener("change", function(e) {
    const filterId_ = e.target.value;
    filterId = filterId_;
    localStorage.setItem("filterId",filterId_);
    keywords = ""
    pageNo=0;
    dateInputValue = ""
    dateInput.value = ""
    keywordsInput.value = ""
    hideElement(paginationAL)
    loadEvents(filterId,pageNo,keywords);
});


paginationAL.addEventListener("click",(element)=>{

    if(pageNo <= 0){
        return 
    }

    pageNo--;

    if(pageNo === 0){
        hideElement(paginationAL)
    }

    if(pageNo === totalPages-2){
        showElement(paginationAR);
    }

    loadEvents(filterId,pageNo,keywords,dateInputValue);
    
})


paginationAR.addEventListener("click",(element)=>{

    if(pageNo >= totalPages-1){
        return
    }

    pageNo++;

    if(pageNo ==- totalPages-1){
        hideElement(paginationAR);
    }
    if(pageNo === 1){
        showElement(paginationAL);
    }   
    loadEvents(filterId,pageNo,keywords,dateInputValue);
})




keywordsInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
        pageNo = 0;
        const query = keywordsInput.value.trim();
        if(query){
            keywords = query;
            loadEvents(filterId, pageNo, query);
        }
    }
});




dateFilterButton.addEventListener("click",()=>{
    const dateInput_ =dateInput.value;
    dateInputValue = dateInput_;
    if (dateInput_) {
        console.log("Searching events on date:", dateInput_);
        loadEvents(filterId, 0, "", dateInput_);
    } else {
        alert("Please select a date.");
    }
})




function makeEventCard(event,favorites){
    
    let svgClassList = "favorite-svg"

    if (isEventFavorite({
        id:event.id,
        name:event.name
    },favorites)){
        svgClassList += " isFavorite-svg"
        console.log("called");
    }

    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card")

    const localDate = event.dates.start.localDate;
    const localTime = event.dates.start.localTime;

    const dateTimeString = `${localDate}T${localTime}`;
    const eventDate = new Date(dateTimeString);

    const venue = event._embedded.venues[0]; 

    const city = venue.city.name;
    const country = venue.country.name;

    eventCard.innerHTML = `
        <div class="event-image">
            <img src="${event.images[0].url}" alt="Event Image" >
        </div>
        <div class="event-card-content">
            <h3 class="clamp-text">${event.name}</h3>
            <p><strong>Date:</strong> ${eventDate.getDay()} ${monthNames[eventDate.getMonth()]},  ${eventDate.getFullYear()}</p>
            <p><strong>Location:</strong> ${city} , ${country}</p>
            <button class="favorite-btn" event-id="${event.id}" event-name="${event.name}" onclick="addToFavorites(this)">
                <svg xmlns="http://www.w3.org/2000/svg" class="${svgClassList}"
                    width="50px"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path 
                    d="M20.8 4.6c-1.4-1.4-3.7-1.4-5.1 0L12 8.3 8.3 4.6C6.9 3.2 4.6 3.2 3.2 4.6c-1.4 1.4-1.4 3.7 0 5.1L12 21.6l8.8-11.9c1.4-1.4 1.4-3.7 0-5.1z">
                    </path>
                </svg>
            </button>
        </div>
    `
    return eventCard;
}


function hideElement(element){
    element.style.display = "none";
}

function showElement(element){
    element.style.display = "block";
}



function isEventFavorite(event,favorites){
    let result = false;
    favorites.forEach(fav => {
        if (fav.id === event.id && fav.name === event.name) {
            result = true;
        }
    });
    return result;
}




function makeUrl(filterId, pageNo,keywords = "",date=""){
    let url = `${baseUrl}events.json?apikey=${apiKey}&size=12&page=${pageNo}`;

    if (filterId) {
        url += `&segmentId=${filterId}`;
    }

    if (date) {
        const startDateTime = `${date}T00:00:00Z`;
        const endDateTime = `${date}T23:59:59Z`;
        url += `&startDateTime=${startDateTime}&endDateTime=${endDateTime}`;
    }

    if (keywords) {
        url += `&keyword=${encodeURIComponent(keywords)}`;
    }
    return url;
}