// App object - alle lokale logica
const App = (function(){
  const STORAGE_KEY = 'medicijnVoorraad_v00_25';

  // voorbeeldstructuur item:
  // {naam:"Paracetamol", type:"tabletten", aantal:10, startvoorraad:10, minimum:2}

  function load(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      console.error('load error', e);
      return [];
    }
  }

  function save(data){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e){
      console.error('save error', e);
    }
  }

  function getAll(){
    return load();
  }

  function addItem(item){
    const data = load();
    // als naam al bestaat, optioneel samenvoegen: hier voegen we nieuw toe als aparte naam
    data.push(item);
    save(data);
  }

  function findIndexByName(naam){
    const data = load();
    return data.findIndex(i => i.naam === naam);
  }

  function updateAmount(naam, diff){
    const data = load();
    const idx = data.findIndex(i => i.naam === naam);
    if (idx === -1) return false;
    let nieuw = Number(data[idx].aantal) + Number(diff);
    if (nieuw < 0) nieuw = 0;
    data[idx].aantal = nieuw;
    save(data);
    return true;
  }

  function deleteItem(naam){
    let data = load();
    data = data.filter(i => i.naam !== naam);
    save(data);
  }

  function search(q){
    if(!q) return load();
    const low = q.toLowerCase();
    return load().filter(i => i.naam.toLowerCase().includes(low));
  }

  function bijnaOp(){
    return load().filter(i => Number(i.aantal) <= Number(i.minimum));
  }

  // future: API call placeholders (commented) - replace localStorage calls with fetch(...) to your webapp
  /*
  async function addItemRemote(item){
    await fetch(`${API_URL}?action=add&key=${API_KEY}&naam=${...}`);
  }
  */

  return {
    getAll,
    addItem,
    updateAmount,
    deleteItem,
    search,
    bijnaOp
  };
})();
