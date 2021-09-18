const ffxivKey = "a308a0bb8cc54a5c8f2f0c8bcb094b6641792b1ef5454012abfc2abb1dad94e3";
const ffxivUrl = "https://xivapi.com/";
const characterSearch = "character/search";
const characterid = "character/";

let lastRes = '';
const fetchCharacterSearch = function(charname) {
  return fetch(ffxivUrl + characterSearch + '?name=' + charname + "&server=Zalera" +'&private_key=' + ffxivKey)
  .then(function (res){
    return res.json();
  }).then(function(json) {
    console.log(json);
    lastRes = json;
    console.log(lastRes);
  });
}

fetchCharacterSearch("Mellow Mushroom");

// How do we access the values we are return in the function above? For example, how do we store the character ID returned into a variable so that we can pass that variable into the function below.
// Once we pass that variable ID value to the function below, we can call that function and return any character statistics



const fetchcharacterid = function(charid) {
  fetch(ffxivUrl + characterid + charid + "?private_key=" + ffxivKey)
  .then(function (res){
    return res.json();
  }).then(function(json) {
    console.log(json);
    lastRes = json;
  });
}

// fetchcharacterid();