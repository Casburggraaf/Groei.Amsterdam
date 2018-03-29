const data = {
  data: null,
  dataParsed: {},
  dataFiltert: null,
  filter(date) {
    // let newStreats = this.data.results.bindings.filter(function (el) {
    //   return el.start.value === date
    // });
    // this.dataFiltert = newStreats;

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
// export default data;
