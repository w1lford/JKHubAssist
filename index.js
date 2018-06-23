const {app, BrowserWindow} = require('electron')
const https = require ('https')
const cheerio = require ('cheerio')

var jsonData = [];
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

function createWindow () {
    // Create the browser window.
  //win = new BrowserWindow({width: 800, height: 600})
    // and load the index.html of the app.
    //win.loadFile('index.html')
}

const promise = getResponse('/files');
promise.then( (res) => {
  console.log('Connected with status code ' + res.status);
  const $ = cheerio.load(res.data); //load response into cheerio
  //find all dom elements with title "View Category"
  var category = $('#idm_categories').children('li');
  category.children('a[title="View Category"]').each(function(i, elem) {
    //process each category
    var title = $(this).text();
    var subcat = $(this).parent().children("ul").children("li").children('a');
    //console.log(title);
    jsonData["category"] = title;
    subcat.each(function(i, elem) {
      //process each subcategory
      var subcatTitle = $(this).text();
      var subcatURL = $(this).attr("href");
      var subcatPath = subcatURL.substring(17); //shave 'https://jkhub.org' off the URL...too hacky??

      jsonData["category"]["subcategory"] = subcatTitle
      var string = "{'category':" + title }
      //console.log("\t" + subcatPath);
      /*
      var promise = getResponse(subcatPath);
      promise.then( (res) => {

      })
      */
    });
  });
  console.log(jsonData);
}).catch( (reason) => {
  console.log("Could not get response.")
  console.log("Reason: " + reason);
})


app.on('ready', createWindow)
