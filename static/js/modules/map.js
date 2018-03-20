import data from "./data.js";

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

export default map;
