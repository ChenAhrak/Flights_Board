



const header = document.createElement("h1");
header.innerHTML = "ברוכים הבאים ללוח הטיסות הכי גדול במדינה";
document.body.insertBefore(header, document.body.firstChild); // Insert at the beginning of the body

const searchContainer = document.getElementById("searchContainer");
const searchForm = document.createElement("form")

searchForm.innerHTML = `
    <input type="radio" name="typeOfFlight" id="departures">
    <label for="departures">המראות</label><br>
    <input type="radio" name="typeOfFlight" id="arrivals">
    <label for="arrivals">נחיתות</label><br>
    <input type="text" placeholder="מספר טיסה"><br>
    <select name="country" id="country"></select><br>
    <select name="city" id="city"></select><br>
    <input type="date" id="from" placeholder="מתאריך"><br>
    <input type="date" id="to" placeholder="עד תאריך"><br>
    <button>חיפוש</button>`;


searchContainer.appendChild(searchForm);

// Extract unique country values from jsonFlights
const uniqueCountries = new Set(" "); // Initialize with an empty string to add an empty option
const countries = document.getElementById("country");

for (let item in jsonFlights) {
    if (jsonFlights[item].country) {
        uniqueCountries.add(jsonFlights[item].country);
    }
}

// Add options to the select element
uniqueCountries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countries.appendChild(option);
});

// Extract unique city values from jsonFlights
const uniqueCities = new Set(" "); // Initialize with an empty string to add an empty option
const cities = document.getElementById("city");

for (let item in jsonFlights) {
    if (jsonFlights[item].city) {
        uniqueCities.add(jsonFlights[item].city);
    }
}

// Add options to the select element
uniqueCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cities.appendChild(option);
});

const tableContainer = document.getElementById("tableContainer");
const table = document.createElement("table");

// Create the table header row
const headerRow = document.createElement("tr");
const searchInput = document.createElement("input");

headerRow.innerHTML = "<td>המראות</td><td>נחיתות</td>"
tableContainer.appendChild(table);


table.appendChild(headerRow);


const bodyRows = document.createElement("tr");
bodyRows.innerHTML = "<td>מספר הטיסה</td><td>שם מלא של חברת התעופה</td><td>זמן מתוכנן</td>" +
    "<td>זמן בפועל</td><td>שם שדה התעופה ביעד / במקור</td>" +
    "<td>שם העיר ביעד / במקור</td><td>ארץ היעד / המקור</td>" +
    "<td>טרמינל</td><td>סטטוס</td>"

table.appendChild(bodyRows);

function populateTable() {
    for (let item in jsonFlights) {
        var bodyRow = document.createElement("tr");
        bodyRow.innerHTML = `<td>${jsonFlights[item].number}</td><td>${jsonFlights[item].operatorLong}</td>` +
            `<td>${jsonFlights[item].schedueTime}</td><td>${jsonFlights[item].actualTime}</td>` +
            `<td>${jsonFlights[item].airport}</td><td>${jsonFlights[item].city}</td>` +
            `<td>${jsonFlights[item].country}</td><td>${jsonFlights[item].terminal}</td><td>${jsonFlights[item].status}</td>`;
        table.appendChild(bodyRow)
        if (jsonFlights[item].type == "A") bodyRow.style.backgroundColor = "#f6f9d4";
        else {
            bodyRow.style.backgroundColor = "#ffebeb";
        }
    }
    tableContainer.appendChild(table);
}
populateTable();

const tableRows = document.querySelectorAll("tr");
const lightBlue = "#F0F8FF";

function changeRowColor(rows, color) {
    const rowColor = rows.style.backgroundColor;
    rows.addEventListener("mouseover", function () {
        this.style.backgroundColor = color;
    });
    rows.addEventListener("mouseout", function () {
        this.style.backgroundColor = rowColor;
    });
}

tableRows.forEach((row) => changeRowColor(row, lightBlue));