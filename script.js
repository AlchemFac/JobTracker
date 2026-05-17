console.log("script.js is connected");

const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  console.log("Form submitted");

  const job = {
    id: Date.now(),
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    dateApplied: document.getElementById("dateApplied").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value
  };

  jobs.push(job);
  saveJobs();
  console.log(jobs);

  renderJobs();
  form.reset();
});

function renderJobs() {
  jobList.innerHTML = "";

  jobs.forEach(function(job) {
    const jobCard = document.createElement("div");

    jobCard.className = "job-card";

    jobCard.innerHTML = `
      <h3>${job.company}</h3>
      <p><strong>Role:</strong> ${job.role}</p>
      <p><strong>Date Applied:</strong> ${job.dateApplied}</p>
      <p><strong>Status:</strong> ${job.status}</p>
      <p><strong>Notes:</strong> ${job.notes}</p>

      <button onclick="deleteJob(${job.id})">
  Delete
</button>
    `;

    jobList.appendChild(jobCard);
  });
}

 function deleteJob(id) {
  jobs = jobs.filter(function(job) {
    return job.id !== id;
  });

  saveJobs();
  renderJobs();
}

renderJobs();