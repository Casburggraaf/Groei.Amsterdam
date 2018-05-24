# ![logo](https://cdn.rawgit.com/Casburggraaf/241740757355fcfbe6c8a3455122376d/raw/157ccebf6807d75ec28f3563b9186311ad80267c/logo.svg?sanitize=true)
> A interactive growth map of the city Amsterdam, [Live Demo](https://groei.amsterdam)

[![Build Status](https://travis-ci.org/Casburggraaf/Groei.Amsterdam.svg?branch=master)](https://travis-ci.org/Casburggraaf/Groei.Amsterdam) [![dependencies Status](https://david-dm.org/CasBurggraaf/Groei.Amsterdam/status.svg)](https://david-dm.org/CasBurggraaf/Groei.Amsterdam) [![LiveDemo](https://img.shields.io/badge/Live%20Demo-online-brightgreen.svg)](https://groei.amsterdam) [![HitCount](http://hits.dwyl.io/CasBurggraaf/Groei.Amsterdam.svg)](http://hits.dwyl.io/CasBurggraaf/Groei.Amsterdam)
 [![license](https://img.shields.io/github/license/nhnent/tui.editor.svg)](https://github.com/nhnent/tui.editor/blob/master/LICENSE)

<p align="center"><a href="https://groei.amsterdam"><img src="https://user-images.githubusercontent.com/373753/38176972-063296cc-35f9-11e8-9906-f2d9c8ffe594.gif" /></a></p>


## 🌏 Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions

### 📙 Overview

Groei.Amstedam is a interactive map where you can see the development of the city through the years. This application is build in one week and has been improved for the course **Performance Matters**. This project is made in cooperation with [HvA](http://www.amsterdamuas.com), [AdamNet](http://www.adamnet.nl) and [OBA](https://www.oba.nl/oba/english.html).

## 🎨 Features
* An interactive map. Build with [LeafLet](http://leafletjs.com) & [MapBox](https://www.mapbox.com)
* The most up to date data of Amsterdam, fetch from [AdamLink](https://adamlink.nl)
* A Scrollbar to slide through the years
* Accessibility: can be used without mouse or touchscreen
* An autoplay function with an option to increase the play speed
* Server-side fetching and parsing of the api
* An offline ([ServiceWorker](https://serviceworke.rs/)) and Non-JavaScript ([EJS Templating](http://www.embeddedjs.com)) version

## 🚀 Installation
Clone the repository
```console
$ git clone https://github.com/Casburggraaf/Groei.Amsterdam
```
Install the packages
```console
$ npm install
```
Run the application
```console
$ npm start
```
Or run the application for development.
```console
$ npm run dev
```

## 🔎 Audit
<details>
<summary><ins>First Audit</ins>(Click to see report)</summary>

![audit base](https://user-images.githubusercontent.com/373753/38198996-36743728-368f-11e8-9578-fb6a26014631.png)
![Audit gif](https://user-images.githubusercontent.com/373753/38203545-da248c64-369f-11e8-94da-0e91e3003131.gif)

*[Complete report](http://htmlpreview.github.io/?https://github.com/Casburggraaf/Groei.Amsterdam/blob/master/audit/old/index.html)*
</details>


### The improvements I made for this app:
* Fetch Api and store the data server-side, in comparison to fetching the api client-side on every reload
* Parse data server-side
* CDN, [CloudFlare](http://cloudflare.com). With gives these improvements
  * Minification of the HTML, JS and CSS
  * Http2
  * Caching
  * Always online
  * G-zip
* Server-side Templating
* Browserify to bundle all JavaScript files
* Improvement on how to handle render map changes

To improve the render time of the map after a change I made a script to handle changes of only one year, this is used when the play button is pressed or when the user navigates by arrow keys. Normally on every change, every layer that contains a year is given an opacity 0. Than a script will filter all "old" streets and gives it a blue color. Then it will find the new layer and gives it the color red. The new script will first detect that the change is only one year after that it will only change the previous layer to blue and change the next layer to the color red.
```javascript
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
```

<details>
<summary><ins>Final Audit</ins>(Click to see report)</summary>

![Audit final](https://user-images.githubusercontent.com/373753/38206680-9a76fab4-36ab-11e8-95ea-2bee6a2ea4c5.png) ![gif](https://user-images.githubusercontent.com/373753/38206620-689e0eec-36ab-11e8-9379-ea889393a5e3.gif)
*[Complete report](http://htmlpreview.github.io/?https://github.com/Casburggraaf/Groei.Amsterdam/blob/master/audit/final/index.html)*
</details>

### Conclusion
By these improvements the first paint is much quicker. First interaction is also improved and the site uses less cpu. Groei.amsterdam was build in one week client side. Right now it is server-side rendering, which improves the performance. Furthermore, the application is working without javascript. If there will be a JavaScript error client side, the application is still working. Finally, the accessibility mark has also improved. It is possible to use the application with keyboard only.

### TODO
These improvement can be done to improve the app even further
* Server-side rendering of the map [leaflet-headless](https://github.com/jieter/leaflet-headless)
* Make own modules of code in server.js
* Store global selectors as variables in server.js
* Additional features for non-javascript users

## 📜 License
This software is licensed under the [MIT](https://github.com/nhnent/tui.editor/blob/master/LICENSE) © [Cas Burggraaf](https://github.com/CasBurggraaf)

[![Build Status](https://travis-ci.org/Casburggraaf/Groei.Amsterdam.svg?branch=master)](https://travis-ci.org/Casburggraaf/Groei.Amsterdam) [![dependencies Status](https://david-dm.org/CasBurggraaf/Groei.Amsterdam/status.svg)](https://david-dm.org/CasBurggraaf/Groei.Amsterdam) [![LiveDemo](https://img.shields.io/badge/Live%20Demo-online-brightgreen.svg)](https://groei.amsterdam) [![HitCount](http://hits.dwyl.io/CasBurggraaf/Groei.Amsterdam.svg)](http://hits.dwyl.io/CasBurggraaf/Groei.Amsterdam)
 [![license](https://img.shields.io/github/license/nhnent/tui.editor.svg)](https://github.com/nhnent/tui.editor/blob/master/LICENSE)
