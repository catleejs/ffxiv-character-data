const ffxivKey = "a308a0bb8cc54a5c8f2f0c8bcb094b6641792b1ef5454012abfc2abb1dad94e3";
const ffxivUrl = "https://xivapi.com/";
const characterSearch = "character/search";
const characterid = "character/";
const historyKey = 'searchHistory';
const errorDiv = document.querySelector('#search-error');

const xivServers = ["Adamantoise", "Aegis", "Alexander", "Anima", "Asura", "Atomos", "Bahamut", "Balmung", "Behemoth", "Belias", "Brynhildr", "Cactuar", "Carbuncle", "Cerberus", "Chocobo", "Coeurl", "Diabolos", "Durandal", "Excalibur", "Exodus", "Faerie", "Famfrit", "Fenrir", "Garuda", "Gilgamesh", "Goblin", "Gungnir", "Hades", "Hyperion", "Ifrit", "Ixion", "Jenova", "Kujata", "Lamia", "Leviathan", "Lich", "Louisoix", "Malboro", "Mandragora", "Masamune", "Mateus", "Midgardsormr", "Moogle", "Odin", "Omega", "Pandaemonium", "Phoenix", "Ragnarok", "Ramuh", "Ridill", "Sargatanas", "Shinryu", "Shiva", "Siren", "Tiamat", "Titan", "Tonberry", "Typhon", "Ultima", "Ultros", "Unicorn", "Valefor", "Yojimbo", "Zalera", "Zeromus", "Zodiark", "Spriggan", "Twintania", "HongYuHai", "ShenYiZhiDi", "LaNuoXiYa", "HuanYingQunDao", "MengYaChi", "YuZhouHeYin", "WoXianXiRan", "ChenXiWangZuo", "BaiYinXiang", "BaiJinHuanXiang", "ShenQuanHen", "ChaoFengTing", "LvRenZhanQiao", "FuXiaoZhiJian", "Longchaoshendian", "MengYuBaoJing", "ZiShuiZhanQiao", "YanXia", "JingYuZhuangYuan", "MoDuNa", "HaiMaoChaWu", "RouFengHaiWan", "HuPoYuan"]
const xivStatMap = {
  1: "Strength",
  2: "Dexterity",
  3: "Vitality",
  4: "Intelligence",
  5: "Mind",
  6: "Piety",
  7: "HP",
  8: "MP",
  19: "Spell Speed",
  20: "Attack Power",
  21: "Defense",
  22: "Direct Hit Rate",
  24: "Magic Defense",
  27: "Critical Hit",
  33: "Attack Magic Potency",
  34: "Healing Magic Potency",
  44: "Determination",
  45: "Skill Speed",
  46: "Tenacity",
}
const xivStatKeys = Object.keys(xivStatMap).reduce((acc, k) => {
  acc[xivStatMap[k]] = k;
  return acc;
}, {});
const coreStats = [
  'HP',
  'MP',
  'Strength',
  'Dexterity',
  'Vitality',
  'Intelligence',
  'Mind',
  'Piety',
];

const imgchUrl = 'https://image-charts.com/chart?';
const imgchType = 'cht=bvs';
const barColor = 'CCCCCC';

let lastRes = '';

const initServerSelect = () => {
  const serverSelect = document.querySelector('#server-list');
  for (s of xivServers) {
    let e = document.createElement('option');
    e.text = s;
    e.value = s;
    serverSelect.appendChild(e);
  }
}
initServerSelect();

const fetchCharacterSearch = function (charname, server = 'Zalera') {
  return fetch(ffxivUrl + characterSearch + '?name=' + charname + `&server=${server}` + '&private_key=' + ffxivKey)
    .then(function (res) {
      return res.json();
    }).then(function (json) {
      console.log(json);
      lastRes = json;
      return json;
    });
}

const fetchcharacterid = function (charid) {
  return fetch(ffxivUrl + characterid + charid + "?private_key=" + ffxivKey)
    .then(function (res) {
      return res.json();
    }).then(function (json) {
      console.log(json);
      lastRes = json;
      return json;
    });
}

const statNameHTML = (stat) => {
  let r = document.createElement('span');
  r.textContent = stat;
  return r;
}

const statValHTML = (val) => {
  let r = document.createElement('span');
  r.textContent = val;
  return r;
}

const showStats = (characterData, statNames = coreStats) => {
  let disp = document.querySelector('#character-stats');
  let nameTarget = disp.querySelector('#character-name');
  let classTarget = disp.querySelector('#character-class');
  let statsTarget = disp.querySelector('#stat-display');

  nameTarget.textContent = characterData.Name;

  classTarget.textContent = characterData.ActiveClassJob.UnlockedState.Name;

  statsTarget.innerHTML = '';
  let statEls = statNames.map(k => {
    let val = characterData.GearSet.Attributes[xivStatKeys[k]];
    let p = document.createElement('div');
    p.classList.add('is-flex');
    p.classList.add('is-justify-content-space-between');
    p.appendChild(statNameHTML(k));
    p.appendChild(statValHTML(val));
    statsTarget.appendChild(p);
  });
}

document.querySelector('#close-error').addEventListener('click', ev => {
  ev.preventDefault();
  if (errorDiv.classList.contains('is-active')) {
    errorDiv.classList.remove('is-active');
  }
})

function showSearchError(err) {
  errorDiv.querySelector('p').textContent = err;
  errorDiv.classList.add('is-active');
}

const histMenu = document.querySelector('#history-select');
histMenu.addEventListener('click', ev => {
  ev.preventDefault();
  histMenu.classList.toggle('is-active');
})

document.querySelector('#search-button').addEventListener('click', ev => {
  ev.preventDefault();
  let text = document.querySelector('#search-text');

  let searchStr = text.value;
  if ('' === searchStr) {
    showSearchError('Please enter a name to search!')
    console.log('no character name to search');
    return false;
  }

  let server = document.querySelector('#server-list').value;
  if ('' === server) {
    showSearchError('Please select a server!')
    console.log('unselected server');
    return false;
  }

  let loader = document.querySelector('#search-loader');
  loader.classList.add('is-active');
  let joke = readyJokes.shift() || { setup: 'woah,', delivery: "I'm all out of jokes!" };
  loader.querySelector('#joke-el').textContent = [joke.setup, joke.delivery].join(' ');

  searchStr.replace(' ', '+');
  fetchCharacterSearch(searchStr, server)
    .then(json => {
      return fetchcharacterid(json.Results[0].ID);
    })
    .then(res => {
      loader.classList.remove('is-active');
      pushlocal(res.Character);
      makeHistory();
      document.querySelector('#character-avi').innerHTML = `<img alt="Character's Avatar" src=${res.Character.Avatar}>`;
      showStats(res.Character);
    })
    .catch(err => {
      if (loader.classList.contains('is-active')) {
        loader.classList.remove('is-active');
      }
      showSearchError(err.message);
      console.log(err);
    });
});

function fetchInfo(charaData, flag) {
  var history = document.querySelector('.search-history');
}

// creating localStorage for persistent data; in progress
function getHistory() {
  return JSON.parse(localStorage.getItem(historyKey));
}

// Initialize history storage
const charaData = getHistory();
var searchHistory = null;
if (charaData && charaData.length > 0) {
  fetchInfo(charaData[0], true);
  searchHistory = charaData;
} else {
  searchHistory = [];
  localStorage.setItem(historyKey, JSON.stringify(searchHistory));
}

function pushlocal(p) {
  var history = getHistory();
  if ((i = history.findIndex(e => e.ID === p.ID)) === -1) {
    history.push(p)
  } else {
    history[i] = p;
  }
  localStorage.setItem(historyKey, JSON.stringify(history))
}

function makeHistory() {
  var list = getHistory();
  document.querySelector('.search-history').innerHTML = '';
  for (var i = 0; i < list.length; i++) {
    console.log(list[i]);
    var listItem = document.createElement('a');
    listItem.textContent = list[i].Name;
    listItem.id = `history_${list[i].ID}`;
    listItem.classList.add('history-entry');
    listItem.classList.add('button');
    document.querySelector('.search-history').appendChild(listItem);
  }
}

document.querySelector('.search-history').addEventListener('click', (ev) => {
  ev.preventDefault();
  const t = ev.target;
  if (!t.classList.contains('history-entry')) {
    return false;
  }
  const id = parseInt(t.id.replace('history_', ''));
  const hist = getHistory();
  const i = hist.findIndex(e => e.ID === id);
  const ch = hist[i];
  document.querySelector('#character-avi').innerHTML = `<img alt="Character's Avatar" src=${ch.Avatar}>`;
  showStats(ch);
});

makeHistory();

const jokeURL = 'https://v2.jokeapi.dev';
const jokeEndpoint = '/joke/';
const jokeCategories = ['Programming',
  'Pun',
  'Spooky',
];
const safe = 'safe-mode';
const jokeType = 'twopart';

function fetchJoke(amount = 1) {
  return fetch(jokeURL + jokeEndpoint + jokeCategories.join(',') + '?' +
    [
      safe,
      `type=${jokeType}`,
      `amount=${amount}`
    ].join('&'))
    .then(res => res.json());
}

let readyJokes = [];
setInterval(() => {
  if (readyJokes.length >= 3) {
    return;
  }
  fetchJoke()
    .then((json) => {
      readyJokes.push(json);
    })
}, 5000);


