

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


function fixSchedueTime(itemInJson) { // duplicated function to fix timing format (24 hours issue)
    var time = new Date(jsonFlights[itemInJson].schedueTime);
    if (time.getHours() === 24) {
        time.setHours(schedueTime.getHours() % 24);
    }

    // Extract year, month, day, hour, and minute
    const year = time.getFullYear().toString().padStart(2, "0");
    const month = (time.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = time.getDate().toString().padStart(2, "0");
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");

    // Manually format the date and time
    const formattedTime = `${year}/${month}/${day}, ${hour}:${minute}`;
    return formattedTime;
}

function fixActualTime(itemInJson) { // duplicated function to fix timing format (24 hours issue)
    var time = new Date(jsonFlights[itemInJson].actualTime);
    if (time.getHours() === 24) {
        time.setHours(schedueTime.getHours() % 24);
    }

    // Extract year, month, day, hour, and minute
    const year = time.getFullYear().toString().padStart(2, "0");
    const month = (time.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = time.getDate().toString().padStart(2, "0");
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");

    // Manually format the date and time
    const formattedTime = `${year}/${month}/${day}, ${hour}:${minute}`;
    return formattedTime;
}

function populateTable() {
    for (let item in jsonFlights) {
        // var schedueTime = fixSchedueTime(item, schedueTime);
        // var actualTime = fixActualTime(item, actualTime)
        var schedueTime = new Date(jsonFlights[item].schedueTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim(); // to be removed later or changed for easier fixes
        var actualTime = new Date(jsonFlights[item].actualTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim(); // to be removed later or changed for easier fixes
        var bodyRow = document.createElement("tr");
        const image = document.createElement("img");
        image.src = jsonFlights[item].type === "A" ? "arrival.png" : "departure.png";
        styleImage(image);
        const firstCell = document.createElement("td");
        firstCell.appendChild(image);
        bodyRow.appendChild(firstCell);
        bodyRow.innerHTML += `<td>${jsonFlights[item].number}</td><td>${jsonFlights[item].operatorLong}</td>` +
            `<td>${schedueTime}</td><td>${actualTime}</td>` +
            `<td>${jsonFlights[item].airport}</td><td>${jsonFlights[item].city}</td>` +
            `<td>${jsonFlights[item].country}</td><td>${jsonFlights[item].terminal}</td><td>${jsonFlights[item].status}</td>`;
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


// Filter the table based on the selected filters
function filterTable() {
    const flightType = document.getElementsByName("flight-type");
    const flightNumber = document.getElementById("flight-number").value.trim();
    const country = document.getElementById("country").value.trim();
    const city = document.getElementById("city").value.trim();
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    console.log(country, city, from, to, flightType[0].checked, flightType[1].checked);

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
    bodyRow.innerHTML += `<td>${jsonFlights[item].number}</td><td>${jsonFlights[item].operatorLong}</td>` +
        `<td>${schedueTime}</td><td>${actualTime}</td>` +
        `<td>${jsonFlights[item].airport}</td><td>${jsonFlights[item].city}</td>` +
        `<td>${jsonFlights[item].country}</td><td>${jsonFlights[item].terminal}</td><td>${jsonFlights[item].status}</td>`;
    tableBody.appendChild(bodyRow)

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
    const row = event.currentTarget;
    const flightNumber = row.cells[1].textContent; // Assuming the flight number is in the second cell
    const flightInfo = document.querySelector(".flight-info");
    // Find the corresponding flight in jsonFlights array
    const flight = jsonFlights.find(item => item.number === parseInt(flightNumber));

    if (flight) {
        const fullInfoTable = document.getElementById("full-info");
        const tbody = document.createElement("tbody");


        // Create a new row for the popup
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${flight.type}</td>
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

        tbody.appendChild(newRow);
        flightInfo.appendChild(tbody);

        // Show the popup

        flightInfo.style.display = "block";



    }
}

document.getElementById("close-button").addEventListener("click", function () {
    document.querySelector('.flight-info').style.display = "none";
    document.getElementsByTagName("tbody")[0].remove();


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
