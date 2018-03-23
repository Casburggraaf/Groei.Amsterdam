(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
// import data from "./modules/data.js";
// import map from "./modules/map.js";
var data = require("./modules/data.js");
var map = require("./modules/map.js");



(function () {
  "use strict";
  // Init Aplication
  const app = {
    rootElement: document.body,
    init() {
      document.querySelector("body").classList.remove("no-javscript");

      this.slider()

      data.data = window.dataa;
      console.log(map);
      map.init();
      this.sliderPLayer();
    },
    slider() {
      var slider = document.getElementById("myRange");
      var output = document.getElementById("demo");
      output.innerHTML = slider.value;

      slider.oninput = function() {
        output.innerHTML = this.value;
        data.filter(this.value)
        map.render();
      }
    },
    sliderPLayer() {
      let _this = this;
      let player = false;

      document.querySelector("#play").addEventListener("click", function () {
        player = !player;
        if (player) {
          _this.autoPlay.start();
        } else {
          _this.autoPlay.stop();
        }
        //console.log(this);
        this.querySelector(".fa-play").classList.toggle("hid");
        this.querySelector(".fa-pause").classList.toggle("hid");
      });

      document.querySelector("#forward").addEventListener("click", function () {
        _this.autoPlay.set_interval(_this.autoPlay.iv / 1.5);
      });
      //this.autoPlay.start();
      document.body.onkeyup = function(e){
        if(e.keyCode == 32){
          player = !player;
          if (player) {
            _this.autoPlay.start();
            document.querySelector(".fa-play").classList.toggle("hid");
            document.querySelector(".fa-pause").classList.toggle("hid");
          } else {
            _this.autoPlay.stop();
            document.querySelector(".fa-play").classList.toggle("hid");
            document.querySelector(".fa-pause").classList.toggle("hid");
          }
        } else if(e.keyCode == 37){
          if (player === false) {
            document.querySelector("#myRange").value = parseInt(document.querySelector("#myRange").value)  - 1;
            data.filter(document.querySelector("#myRange").value)
            document.getElementById("demo").innerHTML = document.querySelector("#myRange").value;
            map.render();
          }
        } else if(e.keyCode == 39){
          if (player === false) {
            document.querySelector("#myRange").value = parseInt(document.querySelector("#myRange").value)  + 1;
            data.filter(document.querySelector("#myRange").value)
            document.getElementById("demo").innerHTML = document.querySelector("#myRange").value;
            map.render();
          }
        }
      };
    },
    autoPlay: {
      running: false,
      iv: 1000,
      timeout: false,
      cb : function(){
        if (document.querySelector("#myRange").value !== document.querySelector("#myRange").max) {
          document.querySelector("#myRange").value = parseInt(document.querySelector("#myRange").value)  + 1;
          data.filter(document.querySelector("#myRange").value)
          document.getElementById("demo").innerHTML = document.querySelector("#myRange").value;
          map.render();
        } else if (document.querySelector("#myRange").value === document.querySelector("#myRange").max) {
          document.querySelector("#myRange").value = document.querySelector("#myRange").min
        }
      },
      start : function(cb,iv){
          var elm = this;
          clearInterval(this.timeout);
          this.running = true;
          if(cb) this.cb = cb;
          if(iv) this.iv = iv;
          this.timeout = setTimeout(function(){elm.execute(elm)}, this.iv);
      },
      execute : function(e){
          if(!e.running) return false;
          e.cb();
          e.start();
      },
      stop : function(){
          this.running = false;
      },
      set_interval : function(iv){
          clearInterval(this.timeout);
          this.start(false, iv);
      }
    }
  };
  // Start the Aplication
  app.init();
})();

},{"./modules/data.js":2,"./modules/map.js":3}],2:[function(require,module,exports){
// import map from "./map.js";
var map = require("./map.js");


const data = {
  data: null,
  dataParsed: {},
  dataFiltert: null,
  filter(date) {
    let newStreats = this.data.results.bindings.filter(function (el) {
      return el.start.value === date
    });
    this.dataFiltert = newStreats;

    let list = document.querySelector("#straten");

    if(list.querySelector(`#jaar-${date}`)){
      list.querySelector(`#jaar-${date}`).scrollIntoView({
        block: "start",
        behavior: 'smooth'
      });
    }
  }
};

module.exports = data;
// export const data;

},{"./map.js":3}],3:[function(require,module,exports){
// import data from "./data.js";
var data = require("./data.js");


const map = {
  mymap: L.map('map', { zoomControl:false }).setView([52.37, 4.86], 13),
  layers: {},
  geoLayers: {},
  prevRender: parseInt(document.querySelector("#myRange").value),
  init() {
    L.tileLayer(`https://api.mapbox.com/styles/v1/hamkaastosti/cjeigw5bw7lz02rp1bjtz0w1z/tiles/256/{z}/{x}/{y}?access_token={accessToken}`, {
      attribution: '<a href="https://casburggraaf.com/">Cas Burggraaf&copy</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiaGFta2Fhc3Rvc3RpIiwiYSI6ImNqZWgyYTl3dTJsdnIzM2xpN2l0MXBsNGYifQ.C2VXaN0XiPlMwmCS1wCsVg'
    }).addTo(this.mymap);
    this.mapWorker();
    data.filter(document.querySelector("#myRange").value)
  },
  mapWorker() {
    let _this = this;

    this.mymap.keyboard.disable();

    data.data.results.bindings.forEach(function (el) {
      let tempCordi = el.wkt.value;
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
      el.wkt.value = tempCordi;
      if (!data.dataParsed[el.start.value]) {
        data.dataParsed[el.start.value] = [];
      }
      data.dataParsed[el.start.value].push(el);
    });

    Object.keys(data.dataParsed).forEach(function(key) {
      var value = data.dataParsed[key];
      if (!_this.layers[key]) {
        _this.layers[key] = [];
      }

      Object.keys(value).forEach(function(index) {
        let cordi = value[index].wkt.value
        let tempObject = {
          "type": "LineString",
          "coordinates": cordi
        };
        _this.layers[key].push(tempObject)
      });

    });

    Object.keys(this.layers).forEach(function(key) {
      let style = {
          "color": "#ff7800",
          "weight": 3,
          "opacity": 0
        };

        _this.geoLayers[key] = L.geoJSON(_this.layers[key] , {
          style: style,
          onEachFeature: function onEachFeature(feature, layer) {
            layer.on('click', function (e) {
              console.log(e);
            });
          }
        }).addTo(_this.mymap);
    });
    this.render();
  },
  render() {
    const _this = this;

    const date = document.querySelector("#myRange").value;

    if ((parseInt(date) - parseInt(this.prevRender)) !== 1){
      Object.keys(this.geoLayers).forEach(function(key) {
        if (_this.geoLayers[key]) {
          if (key < date) {
            _this.geoLayers[key].setStyle({
              "opacity": 0.3,
              "color": "#2474A6",
            });
          } else if (key > date) {
            _this.geoLayers[key].setStyle({
              "opacity": 0
            });
          }
        }
      });
    } else if(this.geoLayers[this.prevRender]){
      this.geoLayers[this.prevRender].setStyle({
        "opacity": 0.3,
        "color": "#2474A6",
      });
    }


    if (this.geoLayers[date]) {
      this.geoLayers[date].setStyle({
        "opacity": 0.65,
        "color": "#E00B27"
      });
    }
    this.prevRender = document.querySelector("#myRange").value;
  }
};

module.exports = map;
//export const map;

},{"./data.js":2}]},{},[1]);
