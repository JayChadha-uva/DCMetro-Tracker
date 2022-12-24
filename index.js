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

 


  // ************************************************


  async function getTrains(inputUrl) {
    let url = inputUrl;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

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
              <p class="card-text"><small class="text-muted">Cars: `+(train.Car == "null"? "-": train.Car) +`</small></p>
          </div>
        </div>
  </div>`;

        html += htmlSegment;
    });

    let container = document.querySelector('.trainData');
    container.innerHTML = html;
}


document.addEventListener('input', function (event) {

	// Only run on our select menu
	if (event.target.id !== 'locality-dropdown') return;

	// The selected value
	console.log(event.target.value);

	// The selected option element
	console.log(event.target.options[event.target.selectedIndex]);

    let trainsUrl = `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${event.target.value}?&api_key=a052505d81424fbda940445715069fa3`
      renderTrains(trainsUrl);

}, false);
  