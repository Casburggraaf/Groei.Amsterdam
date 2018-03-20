import data from "./data.js";

// Request and handle api calls
const api = {
  apiBasisUrl: "https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=",
  //apiBasisUrl: "https://data.adamlink.nl/_api/datasets/AdamNet/all/services/endpoint/sparql",
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
    const url = `${_this.apiBasisUrl}${_this.sparqlquery}${_this.apiEndUrl}`
    fetch(url)
  	.then(function (resp) {
      return resp.json();
    }).then(function(content) {
      document.body.style.setProperty('--loader-status', 'none');
      try {localStorage.setItem(`allData`, JSON.stringify(content));} catch (e) {console.log("Locall Storage error");}
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

export default api;
