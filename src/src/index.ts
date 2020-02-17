import {resolve} from 'dns';
import fetch from 'node-fetch';


// TODO: weapon interface

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



async function FetchWeaponsCategories(): Promise<any> {
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

async function FetchAllWeapons(): Promise<any> {
  // fetching weapon categories
  let result: any = {};

  let obj: object;
  try {
    obj = await FetchWeaponsCategories();
  } catch (e) {
    return new Promise((resolve, reject) => reject());
  }
  /*3518': { title: 'Category:Shotguns' },
  '3520': { title: 'Category:Submachine guns' },
  '3521': { title: 'Category:Assault carbines' },
  '3524': { title: 'Category:Sniper rifles' },
  '3527': { title: 'Category:Throwable weapons' },
  '3533': { title: 'Category:Grenade launchers' },*/

  for (let k in obj) {
    // Element implicitly has an 'any' type because expression of type 'string'
    // can't be used to index type '{}'.
    // no index signature with a parameter of type 'string' was found on type
    // '{}'
    //@ts-ignore
    //    console.log(obj[k].title);


    let params: object = {
      action: 'query',
      format: 'json',
      generator: 'categorymembers',
      //@ts-ignore
      gcmtitle: obj[k].title,
      gcmlimit: 500,
    };
    //@ts-ignore
    let key: string = obj[k].title.substr(9);

    let unwanted: Array<string> = ['ns', 'pageid'];
    try {
      //@ts-ignore
      let data = await GetRequest(params, unwanted);
      result[key] = data;
      // console.log(test);
    } catch (e) {
      // console.log(e);
      return new Promise((resolve, reject) => reject(e));
    }
    // Category:Shotguns
    // Category:Submachine guns
    // Category:Assault carbines
  }

  return new Promise(resolve => resolve(result));
}

/**
 * Fetches stats about a single weapon.
 * To be used in FetchAllWeaponsStats
 */
// deprecated kekw
async function FetchWeaponStat(name: string): Promise<any> {
  let params: object = {
    action: 'query',
    prop: 'revisions',
    titles: name,
    rvslots: '*',
    rvprop: 'content',
    formatversion: 2,
    format: 'json',
  };

  //@ts-ignore
  let truc = await GetRequest(params);
  //@ts-ignore
  console.log(truc);
}

async function FetchAllWeaponsStats(): Promise<any> {
  let weapons = await FetchAllWeapons();

  let names = [];

  for (let categories in weapons) {
    for (let thing in weapons[categories]) {
      //     console.log();
      names.push(weapons[categories][thing].title);
    }
  }

  // console.log(weapons);
  let params: object = {
    action: 'query',
    prop: 'revisions',
    titles: names.join('|'),
    rvslots: '*',
    rvprop: 'content',
    formatversion: 2,
    format: 'json',
  };

  //@ts-ignore
  try {
    let truc = await GetRequest(params);
    //@ts-ignore
    console.log(truc);
  } catch (e) {
    console.log('error ')
  }
}



function GetRequest(params: object, toRemove: Array<string> = []): object {
  console.log('query string:');
  console.log(ENDPOINT + paramsAsURI(params));
  return fetch(ENDPOINT + paramsAsURI(params), {
           method: 'get',
         })
      .then(res => res.json())  // transform res object to json object
      .then((obj) => {
        if (obj.hasOwnProperty('error')) {
          throw obj.error;
        }
        if (obj.hasOwnProperty('query') && obj.query.hasOwnProperty('pages'))
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
        //  console.log(err);
        return err;
      });
}



// invoking async context pajaL
(async function(): Promise<void> {
  // console.log(await FetchWeaponsCategories());


  try {
    await FetchAllWeaponsStats();
  } catch (e) {
    console.log(e);
  }
})();