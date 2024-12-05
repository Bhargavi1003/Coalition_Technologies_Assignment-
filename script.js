const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const authHeader = 'Basic Y29hbGl0aW9uOnNraWxscy10ZXN0';  

function fetchPatientData() {
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const patient = data[0];
    document.getElementById("blood-pressure").textContent = `${patient.diagnosis_history[0].blood_pressure.systolic.value}/${patient.diagnosis_history[0].blood_pressure.diastolic.value} mmHg`;
    document.getElementById("temperature").textContent = `${patient.diagnosis_history[0].temperature.value} °F`;
    document.getElementById("heart-bpm").textContent = `${patient.diagnosis_history[0].heart_rate.value} bpm`;

    const dates = patient.diagnosis_history.map(entry => `${entry.month} ${entry.year}`);
    const respiratoryRates = patient.diagnosis_history.map(entry => entry.respiratory_rate.value);

    renderLineGraph(dates, respiratoryRates);
  })
  .catch(error => {
    console.log("Error fetching patient data:", error);
    document.getElementById("blood-pressure").textContent = "Error loading data";
    document.getElementById("temperature").textContent = "Error loading data";
    document.getElementById("heart-bpm").textContent = "Error loading data";
  });
}

function renderLineGraph(labels, data) {

  const ctx = document.getElementById('lineChart').getContext('2d');

  new Chart(ctx, {
    type: 'line', 
    data: {
      labels: labels, 
      datasets: [{
        label: 'Respiratory Rate',
        data: data, 
        borderColor: '#FF5733', 
        fill: false,
        tension: 0.1 
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month & Year'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Respiratory Rate'
          }
        }
      }
    }
  });
}

fetchPatientData();
