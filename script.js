const API_URL = "https://script.google.com/macros/s/AKfycbxcwTnKnY49Ay9ZRSdV_GClL6lGr34Bgfjbu5eG0POyWJGho2D6BWfS2E4o13KiYAoq-g/exec";
const API_KEY = "89274643";

// TAB wisselen
function openTab(id) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// OPSLAAN medicijn
async function opslaan() {
    const naam = document.getElementById("naam").value.trim();
    const type = document.getElementById("type").value.trim();
    const aantal = document.getElementById("aantal").value.trim();
    const startvoorraad = document.getElementById("startvoorraad").value.trim();
    const minimum = document.getElementById("minimum").value.trim();

    if (!naam || !type || !aantal || !startvoorraad || !minimum) {
        document.getElementById("status").innerText = "Gelieve alle velden in te vullen.";
        return;
    }

    const url = `${API_URL}?action=add&key=${API_KEY}&naam=${encodeURIComponent(naam)}&type=${encodeURIComponent(type)}&aantal=${encodeURIComponent(aantal)}&startvoorraad=${encodeURIComponent(startvoorraad)}&minimum=${encodeURIComponent(minimum)}`;

    const response = await fetch(url);
    const data = await response.json();
    document.getElementById("status").innerText = data.message;

    // Voorraad en waarschuwingen updaten
    ladenVoorraad();
    laadWaarschuwingen();
}

// VOORRAAD laden
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
            <td>
                <button onclick="wijzigVoorraad('${rij.naam}', 1)">+1</button>
                <button onclick="wijzigVoorraad('${rij.naam}', -1)">-1</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Voorraad wijzigen (+1 / -1)
async function wijzigVoorraad(naam, wijzig) {
    const url = `${API_URL}?action=update&key=${API_KEY}&naam=${encodeURIComponent(naam)}&wijzig=${wijzig}`;
    await fetch(url);
    ladenVoorraad();
    laadWaarschuwingen();
}

// WAARSCHUWING bijna op
async function laadWaarschuwingen() {
    const url = `${API_URL}?action=bijnaop&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const waarschuwingDiv = document.getElementById("waarschuwing");
    if (data.length === 0) {
        waarschuwingDiv.innerText = "";
    } else {
        let tekst = "⚠️ Bijna op: ";
        data.forEach(item => {
            tekst += `${item.naam} (${item.aantal})  `;
        });
        waarschuwingDiv.innerText = tekst;
    }
}

// ZOEKEN medicijn
async function zoekMedicijn() {
    const query = document.getElementById("zoekveld").value.trim();
    const url = `${API_URL}?action=zoek&q=${encodeURIComponent(query)}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const tbody = document.querySelector("#tabel tbody");
    tbody.innerHTML = "";

    data.forEach(rij => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${rij.naam}</td>
            <td>${rij.vorm || rij.type}</td>
            <td>${rij.aantal}</td>
            <td>
                <button onclick="wijzigVoorraad('${rij.naam}', 1)">+1</button>
                <button onclick="wijzigVoorraad('${rij.naam}', -1)">-1</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Laden bij openen
window.onload = function() {
    ladenVoorraad();
    laadWaarschuwingen();
    setInterval(laadWaarschuwingen, 60000); // update elke minuut
};
