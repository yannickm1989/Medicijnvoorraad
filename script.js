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
    const type = document.getElementById("type").value;
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
            <td>${rij.vorm || rij.type}</td>
            <td>${rij.aantal}</td>
            <td>
                <button onclick="wijzigVoorraad('${rij.naam}', 1)">+1</button>
                <button onclick="wijzigVoorraad('${rij.naam}', -1)">-1</button>
                <button onclick="verwijderMedicijn('${rij.naam}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    vulSelectMedicijnen(data);
}

// Vul dropdown voor vrije voorraad-aanpassing
function vulSelectMedicijnen(data) {
    const select = document.getElementById("selectMedicijn");
    select.innerHTML = '<option value="">-- Kies medicijn --</option>';
    data.forEach(rij => {
        const option = document.createElement("option");
        option.value = rij.naam;
        option.text = rij.naam;
        select.appendChild(option);
    });
}

// Voorraad wijzigen (+1 / -1 knoppen)
async function wijzigVoorraad(naam, wijzig) {
    const url = `${API_URL}?action=update&key=${API_KEY}&naam=${encodeURIComponent(naam)}&wijzig=${wijzig}`;
    await fetch(url);
    ladenVoorraad();
    laadWaarschuwingen();
}

// Vrije voorraad-aanpassing via input + dropdown
async function wijzigVoorraadVrij() {
    const naam = document.getElementById("selectMedicijn").value;
    const aantal = parseInt(document.getElementById("wijzigAantal").value);

    if (!naam || isNaN(aantal)) {
        alert("Gelieve een medicijn te kiezen en een geldig aantal in te vullen.");
        return;
    }

    const url = `${API_URL}?action=update&key=${API_KEY}&naam=${encodeURIComponent(naam)}&wijzig=${aantal}`;
    await fetch(url);

    document.getElementById("wijzigAantal").value = "";
    document.getElementById("selectMedicijn").value = "";
    ladenVoorraad();
    laadWaarschuwingen();
}

// Delete medicijn
async function verwijderMedicijn(naam) {
    if (!confirm(`Weet je zeker dat je ${naam} wilt verwijderen?`)) return;

    const url = `${API_URL}?action=delete&key=${API_KEY}&naam=${encodeURIComponent(naam)}`;
    const response = await fetch(url);
    const data = await response.json();

    alert(data.message);

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
                <button onclick="verwijderMedicijn('${rij.naam}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    vulSelectMedicijnen(data);
}

// Laden bij openen
window.onload = function() {
    ladenVoorraad();
    laadWaarschuwingen();
    setInterval(laadWaarschuwingen, 60000); // update elke minuut
};
