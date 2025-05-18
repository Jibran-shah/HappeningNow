# 📖 Documentation for: HappeningNow (Events Finder Web App)

## 📌 Project Overview
This project is a web-based event finder application that allows users to search, filter, and favorite local events using data from the Ticketmaster API.  
It provides dynamic filtering by category, date, and keywords with pagination controls and uses `localStorage` to remember selected filters and favorited events.

---

## 📄 Code Documentation

### 🌐 Global Variables
- `baseUrl`: Base URL for the Ticketmaster API.
- `apiKey`: API key for authenticating requests.
- `categorySelector`: HTML select element for event category filtering.
- `eventsContainer`: Container div where event cards are displayed.
- `paginationAL` / `paginationAR`: Left and right arrow buttons for pagination.
- `dateInput` / `keywordsInput`: Input fields for date and keyword filters.
- `dateFilterButton`: Button to trigger date-based filtering.
- `loadingIndicator`: Element shown while data is loading.
- `pageNo` / `totalPages`: Track pagination state.
- `filterId` / `keywords` / `dateInputValue`: Store current filter and search values.
- `monthNames`: Array mapping month numbers to names for display.

### 🔧 Functions

- `makeOption(segment)`:  
  Creates an HTML option element for a category filter dropdown using event segment data.

- `loadFilters()`:  
  Fetches event categories from the API, populates the dropdown, and sets the saved selection (if available in `localStorage`).

- `loadEvents(filterId, pageNo, keywords, date)`:  
  Fetches event data from the API based on selected filters, builds event cards dynamically, and handles errors or timeouts.

- `makeEventCard(event, favorites)`:  
  Creates a styled event card for each event, showing the event image, name, date, location, and a favorite button. Highlights if the event is already marked favorite.

- `addToFavorites(button)`:  
  Adds an event to favorites by toggling the favorite icon and storing event details in `localStorage`.

- `hideElement(element)` / `showElement(element)`:  
  Utility functions to hide or display UI elements.

- `isEventFavorite(event, favorites)`:  
  Checks whether a given event is already saved in the favorites list.

- `makeUrl(filterId, pageNo, keywords, date)`:  
  Builds a complete API request URL string based on filters and pagination state.

### 🎛️ Event Listeners

- **`categorySelector` change**:  
  Updates the category filter, resets search fields and pagination, and reloads events.

- **`paginationAL` click**:  
  Moves to the previous page if not on the first page.

- **`paginationAR` click**:  
  Moves to the next page if not on the last page.

- **`keywordsInput` keydown**:  
  Listens for Enter key press to trigger keyword search.

- **`dateFilterButton` click**:  
  Fetches events for the selected date.

---

## 📖 Project Documentation

### 📌 HappeningNow  
**Local Event Finder Web Application**

### 🎯 Objective  
Develop a web application for discovering local events, with dynamic filters for categories, keywords, and dates, integrating with the Ticketmaster API, and utilizing `localStorage` for saving user preferences.

### ✨ Features  

- **Event Listing**:  
  Display events as cards with images, names, dates, and locations.

- **Category Filtering**:  
  Choose event categories via dropdown.

- **Keyword Search**:  
  Enter keywords to find related events.

- **Date Filtering**:  
  Filter events occurring on a specific date.

- **Pagination**:  
  Navigate through event pages.

- **Favorites**:  
  Mark and save favorite events using `localStorage`.

- **Persistent Filters**:  
  Retain last selected category filter via `localStorage`.

### 🛠️ Technologies Used  

- HTML5  
- CSS3  
- JavaScript (ES6)  
- Ticketmaster Discovery API  
- localStorage  

### 🔍 How It Works  

- Categories are loaded from the API into a dropdown.
- Users select a category, enter a keyword, or choose a date.
- Events matching the selected filters appear as cards.
- Pagination arrows let users navigate through result pages.
- Clicking the heart icon marks an event as favorite, saving it locally.
- Favorites persist across sessions through `localStorage`.

