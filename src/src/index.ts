import fetch from 'node-fetch';


const ENDPOINT = 'https://escapefromtarkov.gamepedia.com/api.php';


// Trying to fetch categories pogu



function paramsAsURI(object: object): string {
  return '?' +
      Object.entries(object)
          .map(
              ([key, val]) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join('&');
}



async function GetWeaponsCategories(): Promise<object> {
  let params: object = {

    action: 'query',
    format: 'json',
    generator: 'categorymembers',
    gcmtitle: 'Category:Weapons',
    gcmlimit: 500,
    gcmtype: 'subcat'


  };
  let ignore = ['ns', 'pageid'];
  try {
    // promise pending
    // console.log(GetRequest(params, ignore));
    let obj = await GetRequest(params, ignore);
    return new Promise(resolve => resolve(obj));

  } catch (e) {
    return new Promise((resolve, reject) => {reject(e)});
  }
}


function GetRequest(params: object, toRemove: Array<string> = []): object {
  return fetch(ENDPOINT + paramsAsURI(params), {
           method: 'get',
         })
      .then(res => res.json())  // transform res object to json object
      .then((obj) => {
        obj = obj.query.pages;
        // console.log('ppPoof');
        if (toRemove.length) {
          for (let p in obj) {
            for (let other in toRemove) {
              let thing: string = toRemove[other];
              // console.log('checking if object has property:' + thing);
              if (obj[p].hasOwnProperty(thing)) {
                // console.log('pepes');
                delete obj[p][thing];
                // console.log(obj[p]);
              }
            }
          }
        }
        // console.log('before return ppHoppest');
        // console.log(obj);
        return obj;
      })
      .catch((err) => {
        return err;
      });
}



// invoking async context pajaL
(async function(): Promise<void> {
  console.log(await GetWeaponsCategories());
})();