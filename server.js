/* eslint-disable semi */

var fetch = require('node-fetch')
var express = require('express')
var browserify = require('browserify-middleware');
var gzip = require('compression');


express()
  .use(express.static('static'))
  .use('/js/bundle.js', browserify(__dirname + '/static/js/app.js'))
  .use(gzip({threshold: 0, filter: () => true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .get("/offline/", offline)
  //.use(notFound)
  .listen(8000)

function home(req, res) {
  //res.status(404).render('not-found.ejs')
  if(data.data === null){
    api.request().then(function () {
      res.render('home.ejs', {dataa: data.data, renderData: data.dataParsed, layers: data.layers});
    });
  }else {
    res.render('home.ejs', {dataa:data.data, renderData: data.dataParsed, layers: data.layers});
  }
}

function offline(req, res) {
  //res.status(404).render('not-found.ejs')
  if(data.data === null){
    api.request().then(function () {
      res.render('offline.ejs', {dataa: data.data, renderData: data.dataParsed, layers: data.layers});
    });
  }else {
    res.render('offline.ejs', {dataa:data.data, renderData: data.dataParsed, layers: data.layers});
  }
}


const api = {
 // apiBasisUrl: " https://api.druid.datalegend.net/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=",
  apiBasisUrl: "https://api.druid.datalegend.net/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=",
  apiEndUrl: "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
  sparqlquery: `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX hg: <http://rdf.histograph.io/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
    SELECT ?street ?naam ?start ?eind ?wkt WHERE {
      ?street a hg:Street .
      ?street rdfs:label ?naam .
      ?street geo:hasGeometry ?geo .
      ?street sem:hasEarliestBeginTimeStamp ?start .
      OPTIONAL {?street sem:hasEarliestEndTimeStamp ?eind }.
      ?geo geo:asWKT ?wkt .
    }
    ORDER BY ?start`,
  request() {
    const _this = this;
    // Makes a promise for the XMLHttpRequest request
    const promise = new Promise(function (resolve, reject) {

    _this.sparqlquery = encodeURIComponent(_this.sparqlquery);
    const url = `${_this.apiBasisUrl}${_this.sparqlquery}${_this.apiEndUrl}`;
    fetch(url,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  	.then(function (resp) {
      return resp.json();
    }).then(function(content) {
       data.data = content;
       console.log(content);
       data.parse();
       resolve();
  	}) .catch(function(error) {
  		// if there is any error you will catch them here
  		console.log(error);
  	});
  });
    return promise;
  }
};

const data = {
  data: null,
  dataParsed: {},
  layersTemp: {},
  layers: {},
  parse() {
    const _this = this

    // Object.keys(data.data.results.bindings).forEach(function(key) {
    //   var value = data.data.results.bindings[key].start.value;

    //   if (!_this.dataParsed[value]) {
    //     _this.dataParsed[value] = [];
    //   }

    //   _this.dataParsed[value].push({
    //     naam: data.data.results.bindings[key].naam.value,
    //     url: data.data.results.bindings[key].street.value,
    //   });
    // });

    Object.keys(data.data).forEach(function(key) {
      var value = data.data[key].start;
      //rconsole.log(key);
      if (!_this.dataParsed[value]) {
        _this.dataParsed[value] = [];
      }

      _this.dataParsed[value].push({
        naam: data.data[key].naam,
        url: data.data[key].street,
      });
    });
    //console.log(_this.dataParsed);
    this.makeLayers()
  },
  makeLayers() {
    const _this = this;

    data.data.forEach(function (el) {
      let tempCordi = el.wkt;
      tempCordi = tempCordi.replace("MULTILINESTRING((", "");
      tempCordi = tempCordi.replace("LINESTRING(", "");
      tempCordi = tempCordi.replace(/\(/g, "");
      tempCordi = tempCordi.replace(/\)/g, "");
      tempCordi = tempCordi.replace(/POINT/g, "");
      tempCordi = tempCordi.split(",");
      tempCordi = tempCordi.map(function (obj) {
        obj = obj.split(" ");
        return obj;
      })
      el.wkt = tempCordi;
      if (!data.layersTemp[el.start]) {
        data.layersTemp[el.start] = [];
      }
      data.layersTemp[el.start].push(el);
    });

    Object.keys(data.layersTemp).forEach(function(key) {
      var value = data.layersTemp[key];
      if (!_this.layers[key]) {
        _this.layers[key] = [];
      }

      Object.keys(value).forEach(function(index) {
        let cordi = value[index].wkt;
        let tempObject = {
          "type": "LineString",
          "coordinates": cordi
        };
        data.layers[key].push(tempObject)
      });
    });
  }
}
