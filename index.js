

let dropdown = document.getElementById('locality-dropdown');
dropdown.length = 0;

const url = 'https://api.wmata.com/Rail.svc/json/jStations?&api_key=a052505d81424fbda940445715069fa3';

fetch(url)  
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.warn('Looks like there was a problem. Status Code: ' + 
          response.status);  
        return;  
      }

      // Examine the text in the response  
      response.json().then(function(data) {  
        let option;
    
    	for (let i = 0; i < data.Stations.length; i++) {
          option = document.createElement('option');
      	  option.text = data.Stations[i].Name;
      	  option.value = data.Stations[i].Code;
      	  dropdown.add(option);
    	}
        
        var tmpAry = new Array();
    for (var i=0;i<dropdown.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = dropdown.options[i].text;
        tmpAry[i][1] = dropdown.options[i].value;
    }
    tmpAry.sort();
    while (dropdown.options.length > 0) {
        dropdown.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        dropdown.options[i] = op;
    }



      });  
    }  
  )  
  .catch(function(err) {  
    console.error('Fetch Error -', err);  
  });



  // sort
  function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}

sortSelect(document.getElementById('locality-dropdown'))


  // ************************************************

  const trainsUrl = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All?&api_key=a052505d81424fbda940445715069fa3"
  async function getTrains() {
      let url = trainsUrl;
      try {
          let res = await fetch(url);
          return await res.json();
      } catch (error) {
          console.log(error);
      }
  }
  
  async function renderTrains() {
      let trains = await getTrains();
      let html = '';
    
  
      trains.Trains.forEach(train => {
          let htmlSegment = `<div class="user">
                              <h2>${train.Line} ${train.DestinationName}</h2>
                              <p>${train.LocationName} - ${train.Min}</p>
                          </div>`;
  
          html += htmlSegment;
      });
  
      let container = document.querySelector('.container');
      container.innerHTML = html;
  }
  
  renderTrains();
  
  