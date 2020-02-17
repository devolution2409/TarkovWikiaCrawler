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



function GetWeaponsCategories(): object {
  let params: object = {

    action: 'query',
    format: 'json',
    generator: 'categorymembers',
    gcmtitle: 'Category:Weapons',
    gcmlimit: 500,
    gcmtype: 'subcat'


  };
  let ignore = ['ns', 'pageid'];

  GetRequest(params, ignore)
      .then(obj => {
        console.log(obj);
      })
      .catch(err => {
        console.log(err);
      });

  return [];
}


function GetRequest(
    params: object, toRemove: Array<string> = []): Promise<object> {
  fetch(ENDPOINT + paramsAsURI(params), {
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
        console.log('before return ppHoppest');
        console.log(obj);
        return new Promise<object>(resolve => {
          resolve(obj);
        });
      })
      .catch(err => {
        return new Promise<object>((resolve, reject) => {
          reject(err);
        });
      });

  return new Promise<object>((resolve, reject) => {
    reject({'err': 'End of function reached'});
  });
}


GetWeaponsCategories();