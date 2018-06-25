const {app, BrowserWindow} = require('electron')
const https = require ('https')
const cheerio = require ('cheerio')
const fs = require('fs')

//Returns server response from JKHub.org given a path
function getResponse(path) {
  const response = {};
  const options = {
    protocol: 'https:',
    hostname: 'jkhub.org',
    port: 443,
    path: path,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36 OPR/53.0.2907.99',
    }
  };
  return new Promise ((resolve, reject) => {
    const req = https.request(options, (res) => {
      response["status"] = res.statusCode;
      response["headers"] = JSON.stringify(res.headers);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response["data"] += chunk;
        //console.log(response.data);
      });
      res.on('end', () => {
        //console.log(response.data)
        resolve(response);
      });
    });
    req.on('error', (e) => {
      reject(`${e.message}`);
    });
    req.end();
  });
}

//Scrapes response and returns a javascript object
//containing metadata about the file categories hosted on JKHUB.org (only sends 1 get request)
function scrapeCategories() {
  return new Promise( (resolve) => { //lol wtf am I doing
    getResponse('/files').then( (res) => {
      console.log('Connected with status code ' + res.status);
      const $ = cheerio.load(res.data); //load response into cheerio
      //find all dom elements with attribute title="View Category" (should be everything we need)
      var metadata = new Array();
      $('a[title="View Category"]').each(function(i, elem) {
      //process each category
      var title = $(this).text();
      var subcat = $(this).parent().children("ul").children("li").children('a');
      console.log("Category found: " + title);
      var data = { //create new object to hold metadata
        category: title,
        subcategory: new Array()
      };
      metadata.push(data);
      subcat.each(function(j, elem) {
        //process each subcategory
        var subcatTitle = $(this).text();
        var subcatURL = $(this).attr("href");
        var subcatPath = subcatURL.substring(17); //shave 'https://jkhub.org' off the URL...too hacky??
        console.log("\t" + subcatPath);
        //copy the data to the object
        metadata[i]["subcategory"].push({name: subcatTitle, url: subcatURL, path: subcatPath});
        });
      });
      //console.log(metadata);
      resolve(metadata);
    }).catch( (reason) => {
      console.log("Looks like we couldn't scrape the categories")
      console.log(reason);
    })
  })
};

function createWindow () {
    // Create the browser window.
    //win = new BrowserWindow({width: 800, height: 600})
    // and load the index.html of the app.
    //win.loadFile('index.html')
}
scrapeCategories().then( (data) => {
  var text = JSON.stringify(data, null, 4)
  fs.writeFile("data.json", text)
  win = new BrowserWindow({width: 800, height: 600})
  win.loadFile('data.json')
});

//app.on('ready', createWindow)
