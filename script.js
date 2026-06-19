console.log("script.js is connected");

const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const jobDescriptionInput = document.getElementById("jobDescriptionInput");
const analyzeJobButton = document.getElementById("analyzeJobButton");
const aiAnalysisResult = document.getElementById("aiAnalysisResult");
const clearAnalysisButton = document.getElementById("clearAnalysisButton");
const submitButton = document.getElementById("submitButton");
const saveAnalysisButton = document.getElementById("saveAnalysisButton");
const totalJobs = document.getElementById("totalJobs");
const appliedJobs = document.getElementById("appliedJobs");
const interviewJobs = document.getElementById("interviewJobs");
const rejectedJobs = document.getElementById("rejectedJobs");
const offerJobs = document.getElementById("offerJobs");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editingJobId = null;
let latestAnalysis = "";

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

if (editingJobId === null) {
  jobs.push(job);
} else {
  jobs = jobs.map(function(existingJob) {
    if (existingJob.id === editingJobId) {
      return {
        ...existingJob,
        ...job,
        id: editingJobId
      };
    }

    return existingJob;
  });

  editingJobId = null;
  submitButton.innerText = "Add Job";
}

saveJobs();
renderJobs();
form.reset();
});

filterStatus.addEventListener("change", function() {
  renderJobs();
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

    latestAnalysis = data.analysis;
    aiAnalysisResult.innerText = data.analysis;

  } catch (error) {
    console.error(error);
    aiAnalysisResult.innerText = "Could not connect to the server.";
  }
});

saveAnalysisButton.addEventListener("click", function() {
  if (!latestAnalysis) {
    aiAnalysisResult.innerText = "Analyze a job description before saving.";
    return;
  }

  if (editingJobId === null) {
    aiAnalysisResult.innerText = "Click Edit on a job first, then save the analysis.";
    return;
  }

  jobs = jobs.map(function(job) {
    if (job.id === editingJobId) {
      return {
        ...job,
        analysis: latestAnalysis
      };
    }
    return job;
  });

  saveJobs();
  renderJobs();

  aiAnalysisResult.innerText = "Analysis saved to job.";
});

clearAnalysisButton.addEventListener("click", function() {
  jobDescriptionInput.value = "";
  aiAnalysisResult.innerText = "";
});

function updateStats() {
  totalJobs.innerText = jobs.length;

  appliedJobs.innerText = jobs.filter(function(job) {
    return job.status === "Applied";
  }).length;

  interviewJobs.innerText = jobs.filter(function(job) {
    return job.status === "Interview";
  }).length;

  rejectedJobs.innerText = jobs.filter(function(job) {
    return job.status === "Rejected";
  }).length;

  offerJobs.innerText = jobs.filter(function(job) {
    return job.status === "Offer";
  }).length;

}

function renderJobs() {
  updateStats();
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

  filteredJobs.forEach(function(job) {
    const jobCard = document.createElement("div");

    jobCard.className = `job-card ${job.status.toLowerCase()}`;

    jobCard.innerHTML = `
      <h3>${job.company}</h3>
      <p><strong>Role:</strong> ${job.role}</p>
      <p><strong>Date Applied:</strong> ${job.dateApplied}</p>
      <p><strong>Status:</strong> ${job.status}</p>
      <p><strong>Notes:</strong> ${job.notes}</p>

      ${job.analysis ? `
        <p><strong>Saved Analysis:</strong></p>
        <pre>${job.analysis}</pre>
      ` : ""}

      <button onclick="deleteJob(${job.id})">
        Delete
      </button>

      <button onclick="editJob(${job.id})">
      Edit
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

function editJob(id) {
  const jobToEdit = jobs.find(function(job) {
    return job.id === id;
  });

  if (!jobToEdit) {
    return;
  }

  document.getElementById("company").value = jobToEdit.company;
  document.getElementById("role").value = jobToEdit.role;
  document.getElementById("dateApplied").value = jobToEdit.dateApplied;
  document.getElementById("status").value = jobToEdit.status;
  document.getElementById("notes").value = jobToEdit.notes;

  editingJobId = id;
  submitButton.innerText = "Update Job";

  form.scrollIntoView({
  behavior: "smooth"
  });
}

renderJobs();