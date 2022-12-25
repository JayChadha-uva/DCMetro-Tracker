// Fetch trains at each station function
async function getIncidents(inputUrl) {
    let url = inputUrl;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// render the trains accordingly in cards using bootstrap
async function renderIncidents(inputUrl) {
    let incidents = await getIncidents(inputUrl);
    let html = '';

    incidents.Incidents.forEach(incident => {
        let affectedLines = incident.LinesAffected.split(/;[\s]?/).filter(function(fn) { return fn !== ''; });
        
        let affectedHtml = ''
        for (const x of affectedLines) { 
            affectedHtml = affectedHtml+`<div class="${x}-circle"><p>${x}</p></div>`
        }
        let dateStr = new Date(incident.DateUpdated).toString().split(" GMT")[0]

        let htmlSegment = `<div class=" card my-2">
        <div class="card-body">
            <div class="container">
                <div class="row">
                  <div class="col-auto d-flex flex-column">
                    ${affectedHtml}
                  </div>
                  <div class="col">
                    <h5 class="card-title ">${incident.IncidentType}</h5>
                    <p class="card-text">${incident.Description}</p>
                    <p class="card-text"><small class="text-muted">Last Updated: ${dateStr}</small></p>  
                </div>
                </div>
            </div>
        </div>
    </div>`;
        html += htmlSegment;
    });

    let container = document.querySelector('.incidentData');
    container.innerHTML = html;
}

let incidentUrl = `https://api.wmata.com/Incidents.svc/json/Incidents?&api_key=a052505d81424fbda940445715069fa3`
renderIncidents(incidentUrl);  