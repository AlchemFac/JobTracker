console.log("script.js is connected");

const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const jobDescriptionInput = document.getElementById("jobDescriptionInput");
const analyzeJobButton = document.getElementById("analyzeJobButton");
const aiAnalysisResult = document.getElementById("aiAnalysisResult");

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

filterStatus.addEventListener("change", function() {
  renderJobs();
  });

function renderJobs() {
  jobList.innerHTML = "";
  
  const selectedStatus = filterStatus.value;
  const searchTerm = searchInput.value.toLowerCase();

  const filteredJobs = jobs.filter(function(job) {

    const matchesStatus =
    selectedStatus === "All" ||
    job.status === selectedStatus;

    const matchesSearch =
    job.company.toLowerCase().includes(searchTerm) ||
    job.role.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesSearch;
    });

  searchInput.addEventListener("input", function() {
  renderJobs();
  });

  analyzeJobButton.addEventListener("click", async function() {
  const jobDescription = jobDescriptionInput.value;

  if (!jobDescription.trim()) {
    aiAnalysisResult.innerText = "Paste a job description first.";
    return;
  }

  aiAnalysisResult.innerText = "Analyzing...";

  try {
    const response = await fetch("/analyze-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jobDescription: jobDescription
      })
    });

    const data = await response.json();

    if (!response.ok) {
      aiAnalysisResult.innerText = data.error || "Something went wrong.";
      return;
    }

    aiAnalysisResult.innerText = data.analysis;

  } catch (error) {
    console.error(error);
    aiAnalysisResult.innerText = "Could not connect to the server.";
  }
});

  filteredJobs.forEach(function(job) {
    const jobCard = document.createElement("div");

    jobCard.className = `job-card ${job.status.toLowerCase()}`;

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