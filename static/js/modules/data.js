import map from "./map.js";

const data = {
  data: null,
  dataParsed: {},
  dataFiltert: null,
  filter(date) {
    let newStreats = this.data.results.bindings.filter(function (el) {
      return el.start.value === date
    });
    this.dataFiltert = newStreats;

    const list = document.querySelector("#straten");

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    newStreats.forEach(function (el) {
      let entry = document.createElement('li');
      let link = document.createElement('a');
      link.href = el.street.value;
      link.target = "_blank";
      link.appendChild(document.createTextNode(el.naam.value));
      entry.appendChild(link)
      list.appendChild(entry);
    });
  }
}

export default data;
