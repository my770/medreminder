if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const paracetamolButton = document.getElementById("paracetamolButton");
  const ibuprofenButton = document.getElementById("ibuprofenButton");
  const paracetamolInput = document.getElementById("paracetamolInput");
  const ibuprofenInput = document.getElementById("ibuprofenInput");
  const medicationForm = document.getElementById("medicationForm");
  const timeline = document.getElementById("timeline");

  // Show input fields when buttons are clicked
  paracetamolButton.addEventListener("click", () => {
    paracetamolInput.style.display = "block";
    medicationForm.style.display = "block";
  });

  ibuprofenButton.addEventListener("click", () => {
    ibuprofenInput.style.display = "block";
    medicationForm.style.display = "block";
  });

  // Handle form submission
  medicationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const paracetamolLastDose = document.getElementById(
      "paracetamolLastDose"
    ).value;
    const ibuprofenLastDose =
      document.getElementById("ibuprofenLastDose").value;

    if (!paracetamolLastDose && !ibuprofenLastDose) {
      alert("Please provide at least one medication dose time.");
      return;
    }

    const paracetamolStart = paracetamolLastDose
      ? new Date(paracetamolLastDose)
      : null;
    const ibuprofenStart = ibuprofenLastDose
      ? new Date(ibuprofenLastDose)
      : null;

    generateTimeline(paracetamolStart, ibuprofenStart);

    // Show the timeline in the News tab
    timeline.style.display = "block";
    openPage("meds", document.querySelector("[onclick*='meds']"), "grey");
  });

  function generateTimeline(paracetamolStart, ibuprofenStart) {
    timeline.innerHTML = ""; // Clear previous entries

    const THREE_DAYS = 3 * 24; // Total hours for 3 days
    const paracetamolInterval = 6; // 6-hourly
    const ibuprofenInterval = 8; // 8-hourly

    // Helper function to round a time to the nearest hour
    function roundToNearestHour(date) {
      const rounded = new Date(date);
      rounded.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
      if (date.getMinutes() >= 30) {
        rounded.setHours(rounded.getHours() + 1); // Round up if 30 minutes or more
      }
      return rounded;
    }

    // Create an array to store all dose times for both drugs
    const doseTimes = [];

    // Generate Paracetamol doses
    if (paracetamolStart) {
      doseTimes.push({
        time: paracetamolStart,
        medication: "Paracetamol",
        side: "left",
      }); // Add first dose as is
      for (let hour = 6; hour <= THREE_DAYS; hour += paracetamolInterval) {
        const doseTime = new Date(
          paracetamolStart.getTime() + hour * 60 * 60 * 1000
        );
        doseTimes.push({
          time: roundToNearestHour(doseTime),
          medication: "Paracetamol",
          side: "left",
        });
      }
    }

    // Generate Ibuprofen doses
    if (ibuprofenStart) {
      doseTimes.push({
        time: ibuprofenStart,
        medication: "Ibuprofen",
        side: "right",
      }); // Add first dose as is
      for (let hour = 8; hour <= THREE_DAYS; hour += ibuprofenInterval) {
        const doseTime = new Date(
          ibuprofenStart.getTime() + hour * 60 * 60 * 1000
        );
        doseTimes.push({
          time: roundToNearestHour(doseTime),
          medication: "Ibuprofen",
          side: "right",
        });
      }
    }

    // Sort all doses by time to maintain a consistent timeline
    doseTimes.sort((a, b) => a.time - b.time);

    // Add each dose to the timeline
    for (const dose of doseTimes) {
      addTimelineEntry(dose.time, dose.medication, dose.side);
    }
  }

  function addTimelineEntry(time, medication, side) {
    const container = document.createElement("div");
    container.className = `container ${side}`;

    const now = new Date(); // Get the current time
    const isPassed = now > time; // Check if the dose time has passed

    const content = document.createElement("div");
    content.className = "content";
    if (isPassed) {
      content.classList.add("passed"); // Add 'passed' class if time has elapsed
    }

    // Include date, time, and medication name
    content.innerHTML = `
        <h2>${time.toLocaleString()}</h2>
        <h2>${medication}</h2>
    `;

    // Append the content to the container
    container.appendChild(content);

    // Append the container to the timeline
    timeline.appendChild(container);
  }
});

// Function to handle tab navigation
function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

document.getElementById("defaultOpen").click();
