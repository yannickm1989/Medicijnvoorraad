const API_URL = "https://script.google.com/macros/s/AKfycbxcwTnKnY49Ay9ZRSdV_GClL6lGr34Bgfjbu5eG0POyWJGho2D6BWfS2E4o13KiYAoq-g/exec";
const API_KEY = "89274643";

// TAB WISSELEN
function openTab(id) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// OPSLAAN
async function opslaan() {
    const naam = document.getElementById("naam").value.trim();
    const type = document.getElementById("type").value.trim();
    const aantal = document.getElementById("aantal").value.trim();

    if (!naam || !type || !aantal) {
        document.getElementById("status").innerText = "Gelieve alle velden in te vullen.";
        return;
    }

    const url = `${API_URL}?action=add&key=${API_KEY}&naam=${encodeURIComponent(naam)}&type=${encodeURIComponent(type)}&aantal=${encodeURIComponent(aantal)}`;

    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("status").innerText = data.message;

    ladenVoorraad();
}

// VOORRAAD LADEN
async function ladenVoorraad() {
    const url = `${API_URL}?action=get&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const tbody = document.querySelector("#tabel tbody");
    tbody.innerHTML = "";

    data.forEach(rij => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${rij.naam}</td>
            <td>${rij.type}</td>
            <td>${rij.aantal}</td>
        `;
        tbody.appendChild(tr);
    });
}
