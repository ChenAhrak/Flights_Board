

const searchContainer = document.getElementById("searchContainer");


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
const table = document.getElementById("flights-table");
const tableBody = document.createElement("tbody");
tableBody.id = "table-body";

function populateTable() {
    for (let item in jsonFlights) {
        var bodyRow = document.createElement("tr");
        const image = document.createElement("img");
        image.src = jsonFlights[item].type === "A" ? "arrival.png" : "departure.png";
        image.style.display = "block";
        image.style.margin = "0 auto";
        image.style.width = "25px";
        image.style.height = "25px";
        const firstCell = document.createElement("td");
        firstCell.appendChild(image);
        bodyRow.appendChild(firstCell);
        bodyRow.innerHTML += `<td>${jsonFlights[item].number}</td><td>${jsonFlights[item].operatorLong}</td>` +
            `<td>${jsonFlights[item].schedueTime}</td><td>${jsonFlights[item].actualTime}</td>` +
            `<td>${jsonFlights[item].airport}</td><td>${jsonFlights[item].city}</td>` +
            `<td>${jsonFlights[item].country}</td><td>${jsonFlights[item].terminal}</td><td>${jsonFlights[item].status}</td>`;
        tableBody.appendChild(bodyRow)
        if (jsonFlights[item].type == "A") bodyRow.style.backgroundColor = "#afeeee";
        else {
            bodyRow.style.backgroundColor = "#9cffed";
        }
    }
    table.appendChild(tableBody);
    tableContainer.appendChild(table);
}
populateTable();

function filterTable() {

    const flightType = document.getElementsByName("flight-type");

    const country = document.getElementById("country").value.trim();
    const city = document.getElementById("city").value.trim();
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    console.log(country, city, from, to, flightType[0].checked, flightType[1].checked);
    if (country == "" && city == "" && from == "" && to == "" && !flightType[0].checked && !flightType[1].checked) {
        alert("Please select a filter");
    }
    else {
        tableBody.innerHTML = "";
        for (let item in jsonFlights) {
            if (country == jsonFlights[item].country) {
                var bodyRow = document.createElement("tr");
                const image = document.createElement("img");
                image.src = jsonFlights[item].type === "A" ? "arrival.png" : "departure.png";
                image.style.display = "block";
                image.style.margin = "0 auto";
                image.style.width = "25px";
                image.style.height = "25px";
                const firstCell = document.createElement("td");
                firstCell.appendChild(image);
                bodyRow.appendChild(firstCell);
                bodyRow.innerHTML += `<td>${jsonFlights[item].number}</td><td>${jsonFlights[item].operatorLong}</td>` +
                    `<td>${jsonFlights[item].schedueTime}</td><td>${jsonFlights[item].actualTime}</td>` +
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
}



const tableRows = document.querySelectorAll("tr");
const lightBlue = "#89cff0";

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