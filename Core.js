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
  return new Promise( (resolve, reject) => {
    getResponse('/files').then( (res) => {
      console.log('Connected with status code ' + res.status);
      console.log('Fetching categories...')
      const $ = cheerio.load(res.data); //load response into cheerio
      //find all dom elements with attribute title="View Category" (should be everything we need)
      var metadata = new Array();
      $('a[title="View Category"]').each(function(i, elem) {
      //process each category
      var title = $(this).text();
      var subcat = $(this).parent().children("ul").children("li").children('a');
      //console.log("Category found: " + title);
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
        //console.log("\t" + subcatPath);
        //copy the data to the object
        metadata[i]["subcategory"].push({name: subcatTitle, url: subcatURL, path: subcatPath});
        });
      });
      resolve(metadata);
    }).catch( (reason) => {
      console.log(reason);
    })
  })
};

//Scrapes data for a file page and recursively follows every "next" button on JKHub
//Fires off a get request for each file page in a category (could be a lot)
function scrapeModdata(url) {
  return new Promise( (resolve, reject) => {
      getResponse(url).then ( (res => {
        var files = new Array();
        const $ = cheerio.load(res.data);
        $('div[class="basic_info"]').each(function(i, elem) {
          var title = $(this).children('h3').children('a[title]').text(); //mod title
          var author = $(this).children('div[class="desc lighter"]').children('a').children('span').text(); //mod author
          var desc = $(this).children('span[class="desc"]').text(); //description
          var url = $(this).parent().children('a').attr('href'); // url
          var thumb = $(this).parent().children('a').children('img').attr('src'); //image thumbnail url
          files.push({name: title, author: author, description: desc, url: url, thumb: thumb});
          //console.log("Found: " + title)
        })

        const nextbutton = $('a[rel="next"]');
        const url = nextbutton.attr('href')
        if(nextbutton.html() !== null) { //if there's a next button
          console.log('Following link ' + url);
          scrapeModdata(url).then ( dat => {
            dat.forEach( (item) => {
              files.push(item); //don't push the array, but the contents of it.
            })
            resolve(files);
          }); //recursively visit each file page via the 'next' button
        } else { resolve(files); } //not sure why I need this buuuuut
      }))
    })
}

//iterate through the object, store file list in category list, and write to json file.
function getFileList() {
  return new Promise (( resolve, reject) => {
    scrapeCategories().then( (data) => {
      var metadata = data;
      metadata.forEach( (cat, index, arr) => {
          cat["subcategory"].forEach( (subcat, index) => {
            scrapeModdata(subcat.url).then( (dat) => {
              subcat.files = dat;
              var text = JSON.stringify(metadata, null, 4);
              fs.writeFile("data.json", text, ( err ) => {
                if (err) {
                  console.log(err);
                }
              })
              console.log("Finished category " + subcat.name);
            });
          })
      })
    })
  });
}

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})
    // and load the index.html of the app.
    win.loadFile('index.html')
}
app.on('ready', createWindow)
