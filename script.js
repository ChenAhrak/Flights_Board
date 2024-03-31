

const searchContainer = document.getElementsByClassName("searchContainer"); // redundant?
const perFlightInfo = document.getElementById("full-info");

perFlightInfo.style.visibility = "hidden";


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
        var schedueTime = fixSchedueTime(item, schedueTime);
        var actualTime = fixActualTime(item, actualTime)
        //var schedueTime = new Date(jsonFlights[item].schedueTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim(); // to be removed later or changed for easier fixes
        //var actualTime = new Date(jsonFlights[item].actualTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim(); // to be removed later or changed for easier fixes
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

function filterTable() {
    const flightType = document.getElementsByName("flight-type");
    const flightNumber = document.getElementById("flight-number").value.trim();
    const country = document.getElementById("country").value.trim();
    const city = document.getElementById("city").value.trim();
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    console.log(country, city, from, to, flightType[0].checked, flightType[1].checked);
    if (country == "" && city == "" && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
        alert("בחר באחת או יותר מאפשרויות החיפוש");
    }
    else {
        tableBody.innerHTML = "";
        for (let item in jsonFlights) {
            const schedueTime = new Date(jsonFlights[item].schedueTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim();
            const actualTime = new Date(jsonFlights[item].actualTime).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).trim();

            // when all filters are empty
            if (country == jsonFlights[item].country && city == "" && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) { // why county has value
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

            //when only one filter is selected
            else if (country == "" && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == "" && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == "" && city == "" && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == "" && city == "" && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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

            else if (country == "" && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
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

            //when two filters are selected
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == "" && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == "" && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == "" && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == "" && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == "" && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == "" && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
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

            //when three filters are selected
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == "" && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            //when four filters are selected
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == "" && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == "" && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && from == "" && to == "" && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && !flightType[0].checked && !flightType[1].checked) {
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

            //when five filters are selected
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[0].checked && flightType[0].value == jsonFlights[item].type) {
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
            else if (country == jsonFlights[item].country && city == jsonFlights[item].city && flightNumber == jsonFlights[item].number && new Date(from) <= new Date(jsonFlights[item].schedueTime) && new Date(to) >= new Date(jsonFlights[item].schedueTime) && flightType[1].checked && flightType[1].value == jsonFlights[item].type) {
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
        }
    }
    const tableRows = document.querySelectorAll("tr");
    const mainTable = document.getElementById("table-body").querySelectorAll("tr");
    mainTable.forEach((row) => row.addEventListener("click", showFullInfo));
    tableRows.forEach((row) => changeRowColor(row, lightBlue));
}

function styleImage(imageElement) {
    imageElement.style.display = "block";
    imageElement.style.margin = "0 auto";
    imageElement.style.width = "25px";
    imageElement.style.height = "25px";
}

const tableRows = document.querySelectorAll("tr");
const lightBlue = "#89cff0";


function showFullInfo() { // making a div with flight details visible when selecting a flight (work in progress)
    perFlightInfo.style.visibility = "visible";


}

function changeRowColor(rows, color) {
    const rowColor = rows.style.backgroundColor;
    rows.addEventListener("mouseover", function () {
        this.style.backgroundColor = color;
    });
    rows.addEventListener("mouseout", function () {
        this.style.backgroundColor = rowColor;
    });
}

const mainTable = document.getElementById("table-body").querySelectorAll("tr");
mainTable.forEach((row) => row.addEventListener("click", showFullInfo));

tableRows.forEach((row) => changeRowColor(row, lightBlue));
