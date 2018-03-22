/* eslint-disable semi */

var fetch = require('node-fetch')
var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var fs = require('fs');

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  //.use(notFound)
  .listen(8000)

function home(req, res) {
  //res.status(404).render('not-found.ejs')
  if(data.data === null){
    api.request().then(function () {
      res.render('home.ejs', {dataa:data.data})
    });
  }else {
    res.render('home.ejs', {dataa:data.data})
  }
}


const api = {
  apiBasisUrl: "https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=",
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
  dataParsed: {}
}
