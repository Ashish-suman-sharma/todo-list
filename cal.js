function openCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    calendarContainer.style.display = "flex";
    populateCalendar();
}

function closeCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    calendarContainer.style.display = "none";
}

function populateCalendar() {
    const calendarBody = document.getElementById("calendar-body");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");
            const day = i * 7 + j - firstDay + 1;

            if (day > 0 && day <= daysInMonth) {
                cell.textContent = day;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}
