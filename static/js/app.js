import api from "./modules/api.js";
import data from "./modules/data.js";
import map from "./modules/map.js";

(function () {
  "use strict";
  // Init Aplication
  const app = {
    rootElement: document.body,
    data: null,
    dataFiltert: null,
    init() {
      this.slider()

      if(localStorage.getItem("allData")){
        data.data = JSON.parse(localStorage.getItem("allData"));
        map.init();
      } else {
        document.body.style.setProperty('--loader-status', 'block');
        api.request().then(function () {
          map.init();
        });
      }
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
      // let playerSpeed = 1000;
      // let interval = setInterval(function () {
      //   if (player === true) {
      //     if (document.querySelector("#myRange").value !== document.querySelector("#myRange").max) {
      //       document.querySelector("#myRange").value = parseInt(document.querySelector("#myRange").value)  + 1;
      //       data.filter(document.querySelector("#myRange").value)
      //       document.getElementById("demo").innerHTML = document.querySelector("#myRange").value;
      //       map.render();
      //     } else if (document.querySelector("#myRange").value === document.querySelector("#myRange").max) {
      //       document.querySelector("#myRange").value = document.querySelector("#myRange").min
      //     }
      //   }
      // }, playerSpeed);

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
