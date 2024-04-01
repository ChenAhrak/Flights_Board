﻿

// Extract unique country values from jsonFlights
const uniqueCountries = new Set(" "); // Initialize with an empty string to add an empty option
const countries = document.getElementById("country");

const departuresCheck = document.getElementById("departures");
departuresCheck.checked = true;
const arrivalsCheck = document.getElementById("arrivals");
arrivalsCheck.checked = true;

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
const table = document.getElementById("flights-table");
const tableBody = document.createElement("tbody");
tableBody.id = "table-body";

function fixTime(time) { // duplicated function to fix timing format (24 hours issue)
    const timeString = time.split(/[/ , : " "]+/);
    var year = timeString[2];
    var month = timeString[0]; // Months are 0-indexed
    var day = timeString[1];
    var hour = timeString[3];
    var minute = timeString[4];

    if (hour > 23) {
        hour = Number(hour % 24);
        hour = hour.toString().padStart(2, "0");
    }
    // Manually format the date and time
    const formattedTime = `${month}/${day}/${year}, ${hour}:${minute}`;
    return formattedTime;
}

function populateTable() {
    for (let item in jsonFlights) {
        var schedueTime = new Date(jsonFlights[item].schedueTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim(); // to be removed later or changed for easier fixes
        schedueTime = fixTime(schedueTime);
        var actualTime = new Date(jsonFlights[item].actualTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim(); // to be removed later or changed for easier fixes
        actualTime = fixTime(actualTime);
        var bodyRow = document.createElement("tr");
        const image = document.createElement("img");
        image.src = jsonFlights[item].type === "A" ? "arrival.png" : "departure.png";
        styleImage(image);
        const firstCell = document.createElement("td");
        firstCell.appendChild(image);
        bodyRow.appendChild(firstCell);
        bodyRow.innerHTML += `
                <td>${jsonFlights[item].number}</td>
                <td>${jsonFlights[item].operatorLong}</td>
                <td>${schedueTime}</td><td>${actualTime}</td>
                <td>${jsonFlights[item].airport}</td>
                <td>${jsonFlights[item].city}</td>
                <td>${jsonFlights[item].country}</td>
                <td>${jsonFlights[item].terminal}</td>
                <td>${jsonFlights[item].status}</td>`;
        tableBody.appendChild(bodyRow)
        if (jsonFlights[item].actualTime.toString() != jsonFlights[item].schedueTime.toString()) {
            var fourthChild = bodyRow.children[3];
            var fifthChild = bodyRow.children[4];
            fourthChild.style.color = "red";
            fourthChild.style.fontWeight = "bold";
            fifthChild.style.color = "red";
            fifthChild.style.fontWeight = "bold";
        }
        if (jsonFlights[item].type == "A") bodyRow.style.backgroundColor = "#afeeee";
        else {
            bodyRow.style.backgroundColor = "#9cffed";
        }
    }
    table.appendChild(tableBody);
    tableContainer.appendChild(table);
    tableContainer.style.textAlign = "center";
}
populateTable();

function tableFilterDraft() { // Going to test a difference simpler implementation

}


// Filter the table based on the selected filters
function filterTable() {
    const flightType = document.getElementsByName("flight-type");
    const flightNumber = document.getElementById("flight-number").value.trim();
    const country = document.getElementById("country").value.trim();
    const city = document.getElementById("city").value.trim();
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    console.log(country, city, from, to, flightType[0].checked, flightType[1].checked);

    // Remove the no match container if it exists
    if (document.querySelector(".no-match-container")) {
        document.querySelector(".no-match-container").remove();
        table.style.display = "block";
    }

    // when all filters are empty
    if (country == "" && city == "" && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
        alert("בחר באחת או יותר מאפשרויות החיפוש");
    }
    else {
        tableBody.innerHTML = "";
        for (let item in jsonFlights) {
            const schedueTime = new Date(jsonFlights[item].schedueTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim();
            const actualTime = new Date(jsonFlights[item].actualTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim();

            //when only one filter is selected
            if (country == jsonFlights[item].country && city == "" && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) { // why county has value
                generateTable(item, schedueTime, actualTime);
            }

            //when only one filter is selected
            else if (country == "" && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);
            }
            else if (country == "" && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == "" && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == "" && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }

            else if (country == "" && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }

            //when two filters are selected
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }

            //when three filters are selected
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }

            //when four filters are selected
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);


            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
                generateTable(item, schedueTime, actualTime);

            }

            //when five filters are selected
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
                generateTable(item, schedueTime, actualTime);

            }

            //when no match is found
            else if (item == jsonFlights.length - 1 && tableBody.innerHTML == "") {
                table.style.display = "none";
                console.log("No match");
                const noMatchDiv = document.createElement("div");
                const noMatchImg = document.createElement("img");
                const noMatch = document.createElement("h1");
                noMatchDiv.className = "no-match-container";
                noMatchImg.src = "nomatch.png";
                noMatchImg.style.width = "100px";
                noMatchImg.style.height = "100px";
                noMatch.textContent = "לא נמצאו תוצאות התואמות לחיפוש שלך";
                noMatchDiv.appendChild(noMatchImg);
                noMatchDiv.appendChild(noMatch);
                tableContainer.appendChild(noMatchDiv);
                break;

            }
        }
    }
    const tableRows = document.querySelectorAll("tr");
    const mainTable = document.getElementById("table-body").querySelectorAll("tr");
    mainTable.forEach((row) => row.addEventListener("click", showFullInfo));
    tableRows.forEach((row) => changeRowColor(row, lightBlue));
}

function generateTable(item, schedueTime, actualTime) {
    var bodyRow = document.createElement("tr");
    const image = document.createElement("img");
    image.src = jsonFlights[item].type === "A" ? "arrival.png" : "departure.png";
    styleImage(image);
    const firstCell = document.createElement("td");
    firstCell.appendChild(image);
    bodyRow.appendChild(firstCell);
    bodyRow.innerHTML += `
            <td>${jsonFlights[item].number}</td>
            <td>${jsonFlights[item].operatorLong}</td>
            <td>${fixTime(schedueTime)}</td>
            <td>${fixTime(actualTime)}</td>
            <td>${jsonFlights[item].airport}</td>
            <td>${jsonFlights[item].city}</td>
            <td>${jsonFlights[item].country}</td>
            <td>${jsonFlights[item].terminal}</td>
            <td>${jsonFlights[item].status}</td>`;
    tableBody.appendChild(bodyRow)
    if (fixTime(schedueTime) != fixTime(actualTime)) {
        var fourthChild = bodyRow.children[3];
        var fifthChild = bodyRow.children[4];
        fourthChild.style.color = "red";
        fourthChild.style.fontWeight = "bold";
        fifthChild.style.color = "red";
        fifthChild.style.fontWeight = "bold";
    }
    if (jsonFlights[item].type == "A") bodyRow.style.backgroundColor = "#afeeee";
    else {
        bodyRow.style.backgroundColor = "#9cffed";
    }
}

function styleImage(imageElement) {
    imageElement.style.display = "block";
    imageElement.style.margin = "0 auto";
    imageElement.style.width = "25px";
    imageElement.style.height = "25px";
}



function showFullInfo(event) {
    if (document.getElementById("temp-row")) document.getElementById("temp-row").remove();
    const row = event.currentTarget;
    const flightNumber = row.cells[1].textContent; // Assuming the flight number is in the second cell
    const flightInfo = document.querySelector(".flight-info");
    // Find the corresponding flight in jsonFlights array
    const flight = jsonFlights.find(item => item.number === parseInt(flightNumber));

    if (flight) {
        const fullInfoTable = document.getElementById("full-info");
        var tbody = document.getElementById("info-body");
        const image = document.createElement("img");
        image.src = flight.type === "A" ? "arrival.png" : "departure.png";
        styleImage(image);
        const firstCell = document.createElement("td");
        firstCell.appendChild(image);
        tbody.appendChild(firstCell);

        // Create a new row for the popup
        tbody.innerHTML += `
            <td>${flight.operatorShort}</td>
            <td>${flight.number}</td>
            <td>${flight.operatorLong}</td>
            <td>${flight.schedueTime}</td>
            <td>${flight.actualTime}</td>
            <td>${flight.cityCode}</td>
            <td>${flight.airport}</td>
            <td>${flight.city}</td>
            <td>${flight.country}</td>
            <td>${flight.terminal}</td>
            <td>${flight.counter}</td>
            <td>${flight.zone}</td>
            <td>${flight.status}</td>
        `;
        tbody.firstChild.id = "temp-row";
        //tbody.appendChild(newRow);
        fullInfoTable.appendChild(tbody);

        // Show the popup
        flightInfo.style.display = "block";
    }
}

document.getElementById("close-button").addEventListener("click", function () {
    document.querySelector('.flight-info').style.display = "none";
    document.getElementById("temp-row").remove();
});

const mainTable = document.getElementById("flights-table").querySelectorAll("tr");
mainTable.forEach(row => row.addEventListener("click", showFullInfo));



// Function to change the background color of a row when the mouse hovers over it
function changeRowColor(rows, color) {
    const rowColor = rows.style.backgroundColor;
    rows.addEventListener("mouseover", function () {
        this.style.backgroundColor = color;
    });
    rows.addEventListener("mouseout", function () {
        this.style.backgroundColor = rowColor;
    });
}


const tableRows = document.querySelectorAll("tbody tr");
const lightBlue = "#89cff0";
tableRows.forEach((row) => changeRowColor(row, lightBlue));
