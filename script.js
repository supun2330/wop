// Credentials
const VALID_USERNAME = "SLNWOP";
const VALID_PASSWORD = "79992";
const UPLOAD_PASSWORD = "#s23#S/S";

// State (In-memory storage)
let uploadedFiles = [];

// DOM Elements
const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const userDisplay = document.getElementById("user-display");

const uploadAuthModal = document.getElementById("upload-auth-modal");
const uploadPasswordInput = document.getElementById("upload-password");
const uploadAuthError = document.getElementById("upload-auth-error");

const uploadFileModal = document.getElementById("upload-file-modal");
const fileInput = document.getElementById("file-input");
const uploadStatus = document.getElementById("upload-status");

const downloadModal = document.getElementById("download-modal");
const pdfList = document.getElementById("pdf-list");
const wordList = document.getElementById("word-list");
const excelList = document.getElementById("excel-list");

// Core Login Logic
function attemptLogin() {
    const userVal = usernameInput.value.trim();
    const passVal = passwordInput.value;

    if (userVal === VALID_USERNAME && passVal === VALID_PASSWORD) {
        loginError.innerText = "";
        userDisplay.innerText = userVal;
        
        loginView.classList.add("hidden");
        dashboardView.classList.remove("hidden");
        
        usernameInput.value = "";
        passwordInput.value = "";
    } else {
        loginError.innerText = "Error: Invalid Username or Password!";
    }
}

function logout() {
    dashboardView.classList.add("hidden");
    loginView.classList.remove("hidden");
    closeModal('upload-auth-modal');
    closeModal('upload-file-modal');
    closeModal('download-modal');
}

// Modal Toggle Helpers
function closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
}

// Upload Authentication Handling
function showUploadAuthModal() {
    uploadAuthModal.classList.remove("hidden");
    uploadPasswordInput.value = "";
    uploadAuthError.innerText = "";
}

function verifyUploadAuth() {
    if (uploadPasswordInput.value === UPLOAD_PASSWORD) {
        uploadAuthError.innerText = "";
        closeModal("upload-auth-modal");
        showUploadFileModal();
    } else {
        uploadAuthError.innerText = "Error: Incorrect upload password!";
    }
}

// Document Upload Logic
function showUploadFileModal() {
    uploadFileModal.classList.remove("hidden");
    fileInput.value = "";
    uploadStatus.innerText = "";
    uploadStatus.classList.add("hidden");
}

function handleFileUpload() {
    if (fileInput.files.length === 0) {
        uploadStatus.innerText = "Please select a file to upload.";
        uploadStatus.style.color = "#ef4444";
        uploadStatus.style.background = "transparent";
        uploadStatus.classList.remove("hidden");
        return;
    }

    const file = fileInput.files[0];
    const fileName = file.name;
    const fileExt = fileName.split('.').pop().toLowerCase();
    
    let fileType = "Other";
    if (fileExt === "pdf") fileType = "PDF";
    else if (["doc", "docx"].includes(fileExt)) fileType = "Word";
    else if (["xls", "xlsx"].includes(fileExt)) fileType = "Excel";

    if (fileType === "Other") {
        uploadStatus.innerText = "Error: Only PDF, Word, or Excel files are allowed.";
        uploadStatus.style.color = "#ef4444";
        uploadStatus.style.background = "transparent";
        uploadStatus.classList.remove("hidden");
        return;
    }

    // Creating URL object to enable real downloading of uploaded object
    const fileUrl = URL.createObjectURL(file);

    uploadedFiles.push({
        name: fileName,
        type: fileType,
        url: fileUrl
    });

    uploadStatus.innerText = `Success: "${fileName}" uploaded successfully!`;
    uploadStatus.style.color = "#10b981";
    uploadStatus.style.background = "rgba(16, 185, 129, 0.1)";
    uploadStatus.classList.remove("hidden");
    fileInput.value = ""; 
}

// Document Download List Logic
function showDownloadModal() {
    downloadModal.classList.remove("hidden");
    renderFileLists();
}

function renderFileLists() {
    // Sort logic comparing alphabetically A to Z
    const pdfs = uploadedFiles.filter(f => f.type === "PDF").sort((a,b) => a.name.localeCompare(b.name));
    const words = uploadedFiles.filter(f => f.type === "Word").sort((a,b) => a.name.localeCompare(b.name));
    const excels = uploadedFiles.filter(f => f.type === "Excel").sort((a,b) => a.name.localeCompare(b.name));

    populateList(pdfList, pdfs);
    populateList(wordList, words);
    populateList(excelList, excels);
}

function populateList(ulElement, files) {
    ulElement.innerHTML = "";
    if (files.length === 0) {
        ulElement.innerHTML = `<div class="empty-state">No files uploaded yet in this category.</div>`;
        return;
    }

    files.forEach(file => {
        const li = document.createElement("li");
        
        const nameSpan = document.createElement("span");
        nameSpan.className = "file-name";
        nameSpan.innerText = file.name;
        nameSpan.title = file.name; // enables tooltip on hover if name is long

        const downloadBtn = document.createElement("a");
        downloadBtn.className = "download-link";
        downloadBtn.href = file.url;
        downloadBtn.download = file.name;
        downloadBtn.innerText = "Download";

        li.appendChild(nameSpan);
        li.appendChild(downloadBtn);
        ulElement.appendChild(li);
    });
}

// Enter Key Functionality
passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") attemptLogin();
});
uploadPasswordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") verifyUploadAuth();
});
