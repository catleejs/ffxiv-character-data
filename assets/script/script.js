const ffxivKey = "a308a0bb8cc54a5c8f2f0c8bcb094b6641792b1ef5454012abfc2abb1dad94e3";
const ffxivUrl = "https://xivapi.com/";
const characterSearch = "character/search";
const characterid = "character/";
const barColor = 'CCCCCC';

const imgchUrl = 'https://image-charts.com/chart?';
const imgchType = 'cht=bvs';

let lastRes = '';
const fetchCharacterSearch = function(charname) {
  return fetch(ffxivUrl + characterSearch + '?name=' + charname + "&server=Zalera" +'&private_key=' + ffxivKey)
  .then(function (res){
    return res.json();
  }).then(function(json) {
    console.log(json);
    lastRes = json;
    return json;
  });
}

const fetchcharacterid = function(charid) {
  fetch(ffxivUrl + characterid + charid + "?private_key=" + ffxivKey)
  .then(function (res){
    return res.json();
  }).then(function(json) {
    console.log(json);
    lastRes = json;
    return json
  });
}

const attachStatChart = function (target, width, height, statnames, statvals, statcolors=[barColor]) {
  const chartUrl = imgchUrl +
    [
      imgchType,
      'chd=t:' + statvals.join(','),
      'chl=' + statnames.join('|'),
      `chs=${width}x${height}`
      `chco=${statcolors.join('|')}`,
    ].join('&');
  target.innerHTML = `<img alt='character stats' src=${chartUrl}></img>`;
}

document.querySelector('#search-button').addEventListener('click', ev => {
  ev.preventDefault();
  let text = document.querySelector('#search-text');
  let searchStr = text.value;
  searchStr.replace(' ', '+');
  fetchCharacterSearch(searchStr)
  .then(json => {
    document.querySelector('#character-avi').innerHTML = `<img alt="Character's Avatar" src=${json.Results[0].Avatar}>`;
    return fetchcharacterid(json.Results[0].ID);
  })
  .then(res => {
  });
});

// creating localStorage for persistent data; in progress
window.localStorage.setItem('characterid', JSON.stringify(characterid));
window.localStorage.getItem('characterid');
JSON.parse(window.localStorage.getItem('characterid'));
