/* eslint-disable semi */

var fetch = require('node-fetch')
var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var fs = require('fs');
var NodeMonkey = require('node-monkey')
var browserify = require('browserify-middleware');
//NodeMonkey()

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  // .use('/js/bundle.js', browserify(__dirname + '/static/js'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  //.use(notFound)
  .listen(8000)

function home(req, res) {
  //res.status(404).render('not-found.ejs')
  if(data.data === null){
    api.request().then(function () {
      res.render('home.ejs', {dataa: data.data, renderData: data.dataParsed});
    });
  }else {
    res.render('home.ejs', {dataa:data.data, renderData: data.dataParsed});
  }
}


const api = {
  apiBasisUrl: "https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=",
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
    fetch(url)
  	.then(function (resp) {
      return resp.json();
    }).then(function(content) {
       data.data = content;
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
  parse() {
    const _this = this

    Object.keys(data.data.results.bindings).forEach(function(key) {
      var value = data.data.results.bindings[key].start.value;

      if (!_this.dataParsed[value]) {
        _this.dataParsed[value] = [];
      }

      _this.dataParsed[value].push({
        naam: data.data.results.bindings[key].naam.value,
        url: data.data.results.bindings[key].street.value,
      });
    });
    //console.log(data.dataParsed);
  }
}
