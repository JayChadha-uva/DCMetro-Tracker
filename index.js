// Get URL Search params
const urlTOT = new URL(window.location);
let params1 = new URLSearchParams(urlTOT.search);

// initialize the dropdown "select"
let dropdown = document.getElementById('locality-dropdown');
dropdown.length = 0;

// API call to fetch all stations
const url = 'https://api.wmata.com/Rail.svc/json/jStations?&api_key=a052505d81424fbda940445715069fa3';
fetch(url)  
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.warn('Error. Status Code: ' + 
          response.status);  
        return;  
      }

      // Access json data
      response.json().then(function(data) {  
        let option;

        stationDict = {}

        for (let i = 0; i < data.Stations.length; i++) {
            if (data.Stations[i].Name in stationDict){
                stationDict[data.Stations[i].Name] = stationDict[data.Stations[i].Name] + ","+data.Stations[i].Code
            }
            else{
                stationDict[data.Stations[i].Name] = data.Stations[i].Code
            }
        }

        // fill in options to stations dropdown
    	for (var key in stationDict) {
          option = document.createElement('option');
      	  option.text = key;
      	  option.value = stationDict[key];
      	  dropdown.add(option);
    	}
        
        // sort station drop down alphabetically
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

        // Update dropdown to be what is in the search params
        let stationCode = params1.get("station")
        document.getElementById('locality-dropdown').value=stationCode

      });  
    }  
  )  
  .catch(function(err) {  
    console.error('Fetch Error -', err);  
  });

 
// Fetch trains at each station function
  async function getTrains(inputUrl) {
    let url = inputUrl;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// render the trains accordingly in cards using bootstrap
async function renderTrains(inputUrl) {
    let trains = await getTrains(inputUrl);
    let html = '';

    trains.Trains.forEach(train => {
        let htmlSegment = `<div class="card my-2">
        <div class="card-body row">
            <div class="col-2 col-sm-2 d-flex justify-content-center align-items-center">
                <div class="${train.Line}-circle ">${train.Line}</div>
              </div>
          <div class="col-10 col-sm-10">
              <h5 class="card-title">${train.DestinationName} - ${train.Min}`+( train.Min == "BRD" ? '' : (train.Min == "ARR"? "": " mins"))+`</h5>
              <p class="card-text"><small class="text-muted">Cars: `+((train.Car == null) ? "-": train.Car) +`</small></p>
          </div>
        </div>
  </div>`;
        html += htmlSegment;
    });

    let container = document.querySelector('.trainData');
    container.innerHTML = html;
}

// Get search params and go to that station if station code in url
let params = new URLSearchParams(urlTOT.search);

// only fetch stationcode valid in the params
if(params.has('station')){
    let stationCode = params.get("station")
    let trainsUrl = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}?&api_key=a052505d81424fbda940445715069fa3`
    renderTrains(trainsUrl);  
}

urlTOT.searchParams.get('station');

// fetch trains when new options selected
document.addEventListener('input', function (event) {	
	if (event.target.id !== 'locality-dropdown') return;

    let trainsUrl = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${event.target.value}?&api_key=a052505d81424fbda940445715069fa3`
    renderTrains(trainsUrl);
    urlTOT.searchParams.set('station', event.target.value);
    window.history.pushState(null, '', urlTOT.toString());

}, false);

document.querySelector('.click').addEventListener('click', (e) => {
    // Do whatever you want
    let params2 = new URLSearchParams(urlTOT.search);
    let stationCode = params2.get("station")
    let trainsUrl = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}?&api_key=a052505d81424fbda940445715069fa3`
    renderTrains(trainsUrl);
  });
  