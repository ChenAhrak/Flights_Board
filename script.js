
const header = document.createElement("h1");
const tableContainer = document.getElementById("container");
const table = document.createElement("table");
const headerRow = document.createElement("tr");

header.innerHTML = "ברוכים הבאים ללוח הטיסות הכי גדול במדינה";
headerRow.innerHTML = "<td>המראות</td><td>נחיתות</td>"
tableContainer.appendChild(header);
table.appendChild(headerRow);
tableContainer.appendChild(table);

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

    }
    tableContainer.appendChild(table);
}
populateTable();
