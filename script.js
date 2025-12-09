const API_URL = "https://script.google.com/macros/s/AKfycbydvHrO65CTY5wN2wixiFH49p90p27f3UlQTfyiwLezluKlqK_3lYkP3gK9dQpsBt4V/exec";
const API_KEY = "89274643";

// Voorraad ophalen en tonen
async function toonVoorraad(){
  const resp = await fetch(`${API_URL}?action=get&key=${API_KEY}`);
  const data = await resp.json();
  let html="<table border='1'><tr><th>Naam</th><th>Type</th><th>Aantal</th><th>Startvoorraad</th><th>Minimum</th><th>Aanpassen</th><th>Verwijderen</th></tr>";
  data.forEach(item=>{
    let kleur = item.aantal<=item.minimum ? "style='color:red'" : "";
    html+=`<tr ${kleur}>
      <td>${item.naam}</td>
      <td>${item.type}</td>
      <td>${item.aantal}</td>
      <td>${item.startvoorraad}</td>
      <td>${item.minimum}</td>
      <td><button onclick="toonUpdateForm('${item.naam}')">Aanpassen</button></td>
      <td><button onclick="deleteMedicijn('${item.naam}')">Verwijderen</button></td>
    </tr>`;
  });
  html+="</table>";
  document.getElementById("content").innerHTML=html;
  toonBijnaOp();
}

// Bijna op tonen
async function toonBijnaOp(){
  const resp = await fetch(`${API_URL}?action=bijnaop&key=${API_KEY}`);
  const data = await resp.json();
  let html="";
  data.forEach(item=>html+=`<p style="color:red">Bijna op: ${item.naam} (${item.aantal})</p>`);
  document.getElementById("bijnaop").innerHTML=html;
}

// Zoekfunctie
async function zoek(){
  const q = document.getElementById("zoekveld").value;
  const resp = await fetch(`${API_URL}?action=zoek&key=${API_KEY}&q=${q}`);
  const data = await resp.json();
  let html="<table border='1'><tr><th>Naam</th><th>Type</th><th>Aantal</th><th>Startvoorraad</th><th>Minimum</th><th>Aanpassen</th><th>Verwijderen</th></tr>";
  data.forEach(item=>{
    let kleur = item.aantal<=item.minimum ? "style='color:red'" : "";
    html+=`<tr ${kleur}>
      <td>${item.naam}</td>
      <td>${item.type}</td>
      <td>${item.aantal}</td>
      <td>${item.startvoorraad}</td>
      <td>${item.minimum}</td>
      <td><button onclick="toonUpdateForm('${item.naam}')">Aanpassen</button></td>
      <td><button onclick="deleteMedicijn('${item.naam}')">Verwijderen</button></td>
    </tr>`;
  });
  html+="</table>";
  document.getElementById("content").innerHTML=html;
}

// Formulier toevoegen
function toonAddForm(){
  document.getElementById("content").innerHTML=`
  <h3>Medicijn toevoegen</h3>
  Naam: <input type="text" id="naam"><br>
  Type: <select id="type">
    <option value="tabletten">Tabletten</option>
    <option value="pillen">Pillen</option>
    <option value="poeder">Poeder</option>
    <option value="spuiten">Spuiten</option>
    <option value="volume">Volume</option>
  </select><br>
  Aantal: <input type="number" id="aantal"><br>
  Startvoorraad: <input type="number" id="startvoorraad"><br>
  Minimum: <input type="number" id="minimum"><br>
  <button onclick="addMedicijn()">Opslaan</button>
  `;
}

// Toevoegen
async function addMedicijn(){
  const naam=document.getElementById("naam").value;
  const type=document.getElementById("type").value;
  const aantal=document.getElementById("aantal").value;
  const startvoorraad=document.getElementById("startvoorraad").value;
  const minimum=document.getElementById("minimum").value;
  const resp = await fetch(`${API_URL}?action=add&key=${API_KEY}&naam=${encodeURIComponent(naam)}&type=${encodeURIComponent(type)}&aantal=${aantal}&startvoorraad=${startvoorraad}&minimum=${minimum}`);
  const result = await resp.json();
  alert(result.message);
  toonVoorraad();
}

// Voorraad aanpassen
function toonUpdateForm(naam){
  document.getElementById("content").innerHTML=`
    <h3>Voorraad aanpassen: ${naam}</h3>
    Aantal wijziging (bijv. +5 of -3): <input type="number" id="wijzig"><br>
    <button onclick="updateMedicijn('${naam}')">Opslaan</button>
  `;
}

async function updateMedicijn(naam){
  const wijzig=document.getElementById("wijzig").value;
  const resp=await fetch(`${API_URL}?action=update&key=${API_KEY}&naam=${encodeURIComponent(naam)}&wijzig=${encodeURIComponent(wijzig)}`);
  const result=await resp.json();
  alert(result.message);
  toonVoorraad();
}

// Verwijderen
async function deleteMedicijn(naam){
  if(!confirm(`Weet je zeker dat je ${naam} wilt verwijderen?`)) return;
  const resp=await fetch(`${API_URL}?action=delete&key=${API_KEY}&naam=${encodeURIComponent(naam)}`);
  const result=await resp.json();
  alert(result.message);
  toonVoorraad();
}
