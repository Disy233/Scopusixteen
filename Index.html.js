<script>

/* =====================================================
   SCOPUSIXTEEN — SUBMIT MANUSCRIPT JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       AUTO-FILL AUTHOR DETAILS
    ================================================= */

    const savedUser = localStorage.getItem("scopusixteenUser");

    if (savedUser) {

        try {

            const user = JSON.parse(savedUser);

            if (user.firstName && user.lastName) {
                document.getElementById("authorName").value =
                    user.firstName + " " + user.lastName;
            }

            if (user.email) {
                document.getElementById("authorEmail").value =
                    user.email;
            }

            if (user.institution) {
                document.getElementById("institution").value =
                    user.institution;
            }

            if (user.country) {
                document.getElementById("country").value =
                    user.country;
            }

        } catch (error) {

            console.log("Unable to load author information.");

        }
    }


    /* =================================================
       FILE SETTINGS
    ================================================= */

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    const allowedExtensions = [
        "pdf",
        "doc",
        "docx"
    ];


    /* =================================================
       FILE VALIDATION
    ================================================= */

    function validateFile(file, requiredFile = false) {

        if (!file) {

            if (requiredFile) {

                alert("Please select your manuscript file.");

            }

            return false;
        }


        const fileName =
            file.name.toLowerCase();

        const extension =
            fileName.split(".").pop();


        /* Check extension */

        if (!allowedExtensions.includes(extension)) {

            alert(
                "Invalid file type.\n\n" +
                "Please upload a PDF, DOC or DOCX file."
            );

            return false;
        }


        /* Check size */

        if (file.size > MAX_FILE_SIZE) {

            alert(
                "File is too large.\n\n" +
                "The maximum allowed size is 10 MB."
            );

            return false;
        }


        return true;

    }


    /* =================================================
       MAIN MANUSCRIPT FILE
    ================================================= */

    const manuscriptFileInput =
        document.getElementById("manuscriptFile");

    const manuscriptFileName =
        document.getElementById("manuscriptFileName");


    manuscriptFileInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {

                manuscriptFileName.textContent = "";

                return;
            }


            if (!validateFile(file, true)) {

                this.value = "";

                manuscriptFileName.textContent = "";

                return;
            }


            manuscriptFileName.textContent =
                "✓ Selected: " + file.name;

        }
    );


    /* =================================================
       COVER LETTER
    ================================================= */

    const coverLetterInput =
        document.getElementById("coverLetter");

    const coverLetterName =
        document.getElementById("coverLetterName");


    coverLetterInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {

                coverLetterName.textContent = "";

                return;
            }


            if (!validateFile(file, false)) {

                this.value = "";

                coverLetterName.textContent = "";

                return;
            }


            coverLetterName.textContent =
                "✓ Selected: " + file.name;

        }
    );


    /* =================================================
       FORM SUBMISSION
    ================================================= */

    const manuscriptForm =
        document.getElementById("manuscriptForm");


    manuscriptForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================================
               CHECK MANUSCRIPT FILE
            ========================================= */

            const manuscriptFile =
                manuscriptFileInput.files[0];


            if (!validateFile(manuscriptFile, true)) {

                return;

            }


            /* =========================================
               CHECK COVER LETTER IF PROVIDED
            ========================================= */

            const coverLetterFile =
                coverLetterInput.files[0];


            if (
                coverLetterFile &&
                !validateFile(coverLetterFile, false)
            ) {

                return;

            }


            /* =========================================
               GET FORM DATA
            ========================================= */

            const title =
                document
                .getElementById("articleTitle")
                .value
                .trim();


            const journal =
                document
                .getElementById("journal")
                .value;


            const articleType =
                document
                .getElementById("articleType")
                .value;


            const abstract =
                document
                .getElementById("abstract")
                .value
                .trim();


            const keywords =
                document
                .getElementById("keywords")
                .value
                .trim();


            const authorName =
                document
                .getElementById("authorName")
                .value
                .trim();


            const authorEmail =
                document
                .getElementById("authorEmail")
                .value
                .trim();


            const institution =
                document
                .getElementById("institution")
                .value
                .trim();


            const country =
                document
                .getElementById("country")
                .value;


            /* =========================================
               COLLECT CO-AUTHORS
            ========================================= */

            const coAuthors = [];

            document
            .querySelectorAll("#coAuthors .author-box")
            .forEach(function (box) {

                const name =
                    box.querySelector(
                        'input[name^="coAuthorName"]'
                    );

                const email =
                    box.querySelector(
                        'input[name^="coAuthorEmail"]'
                    );

                const institution =
                    box.querySelector(
                        'input[name^="coAuthorInstitution"]'
                    );


                coAuthors.push({

                    name:
                        name ? name.value.trim() : "",

                    email:
                        email ? email.value.trim() : "",

                    institution:
                        institution ?
                        institution.value.trim() :
                        ""

                });

            });


            /* =========================================
               GENERATE MANUSCRIPT ID
            ========================================= */

            const year =
                new Date().getFullYear();


            const randomNumber =
                Math.floor(
                    10000 +
                    Math.random() * 90000
                );


            const manuscriptID =
                "SCP-" +
                year +
                "-" +
                randomNumber;


            /* =========================================
               SUBMISSION DATE
            ========================================= */

            const submissionDate =
                new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            /* =========================================
               CREATE SUBMISSION RECORD
            ========================================= */

            const submission = {

                id: manuscriptID,

                title: title,

                journal: journal,

                articleType: articleType,

                abstract: abstract,

                keywords: keywords,

                authorName: authorName,

                authorEmail: authorEmail,

                institution: institution,

                country: country,

                coAuthors: coAuthors,

                manuscriptFile:
                    manuscriptFile.name,

                coverLetter:
                    coverLetterFile
                    ? coverLetterFile.name
                    : "",

                status: "Submitted",

                date: submissionDate

            };


            /* =========================================
               GET EXISTING SUBMISSIONS
            ========================================= */

            let submissions = [];

            try {

                submissions =
                    JSON.parse(
                        localStorage.getItem(
                            "scopusixteenManuscripts"
                        )
                    ) || [];

            } catch (error) {

                submissions = [];

            }


            /* =========================================
               SAVE SUBMISSION
            ========================================= */

            submissions.push(submission);


            localStorage.setItem(
                "scopusixteenManuscripts",
                JSON.stringify(submissions)
            );


            /* =========================================
               ALSO SAVE TO OLD STORAGE KEY
               FOR AUTHOR PORTAL COMPATIBILITY
            ========================================= */

            localStorage.setItem(
                "scopusixteenSubmissions",
                JSON.stringify(submissions)
            );


            /* =========================================
               SHOW SUCCESS MESSAGE
            ========================================= */

            document
            .getElementById("manuscriptId")
            .textContent =
                "Manuscript ID: " +
                manuscriptID;


            manuscriptForm.style.display =
                "none";


            document
            .getElementById("successMessage")
            .style.display =
                "block";


            /* Scroll to success */

            document
            .getElementById("successMessage")
            .scrollIntoView({
                behavior: "smooth"
            });

        }
    );

});


/* =====================================================
   ADD CO-AUTHOR
===================================================== */

let authorCount = 0;


function addAuthor() {

    authorCount++;


    const container =
        document.getElementById("coAuthors");


    const author =
        document.createElement("div");


    author.className =
        "author-box";


    author.innerHTML = `

        <h3>
            Co-Author ${authorCount}
        </h3>

        <div class="form-row">

            <div class="form-group">

                <label>
                    Full Name *
                </label>

                <input
                    type="text"
                    name="coAuthorName${authorCount}"
                    placeholder="Full name"
                    required
                >

            </div>


            <div class="form-group">

                <label>
                    Email *
                </label>

                <input
                    type="email"
                    name="coAuthorEmail${authorCount}"
                    placeholder="author@example.com"
                    required
                >

            </div>

        </div>


        <div class="form-group">

            <label>
                Institution *
            </label>

            <input
                type="text"
                name="coAuthorInstitution${authorCount}"
                placeholder="University or organization"
                required
            >

        </div>

        <button
            type="button"
            onclick="this.parentElement.remove()"
            style="
                background:#fff0f0;
                color:#b42318;
                border:1px solid #f0b5b5;
                padding:8px 12px;
                border-radius:5px;
                cursor:pointer;
                font-weight:bold;
            "
        >
            Remove Co-Author
        </button>

    `;


    container.appendChild(author);

}

</script><script>

/* =========================
   AUTO-FILL AUTHOR DETAILS
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const savedUser =
        localStorage.getItem("scopusixteenUser");

    if (savedUser) {

        try {

            const user = JSON.parse(savedUser);

            if (user.firstName && user.lastName) {
                const nameField =
                    document.getElementById("authorName");

                if (nameField) {
                    nameField.value =
                        user.firstName + " " + user.lastName;
                }
            }

            if (user.email) {
                const emailField =
                    document.getElementById("authorEmail");

                if (emailField) {
                    emailField.value = user.email;
                }
            }

            if (user.institution) {
                const institutionField =
                    document.getElementById("institution");

                if (institutionField) {
                    institutionField.value =
                        user.institution;
                }
            }

            if (user.country) {
                const countryField =
                    document.getElementById("country");

                if (countryField) {
                    countryField.value =
                        user.country;
                }
            }

        } catch (error) {

            console.log(
                "Unable to load author information."
            );

        }

    }

    loadSubmissions();

});


/* =========================
   ADD CO-AUTHOR
========================= */

let authorCount = 0;

function addAuthor() {

    authorCount++;

    const container =
        document.getElementById("coAuthors");

    if (!container) {
        return;
    }

    const author =
        document.createElement("div");

    author.className = "author-box";

    author.innerHTML = `

        <h3>
            Co-Author ${authorCount}
        </h3>

        <div class="form-row">

            <div class="form-group">

                <label>
                    Full Name *
                </label>

                <input
                    type="text"
                    name="coAuthorName${authorCount}"
                    placeholder="Full name"
                    required
                >

            </div>

            <div class="form-group">

                <label>
                    Email *
                </label>

                <input
                    type="email"
                    name="coAuthorEmail${authorCount}"
                    placeholder="author@example.com"
                    required
                >

            </div>

        </div>

        <div class="form-group">

            <label>
                Institution *
            </label>

            <input
                type="text"
                name="coAuthorInstitution${authorCount}"
                placeholder="University or organization"
                required
            >

        </div>

        <button
            type="button"
            class="add-author"
            onclick="this.parentElement.remove()">

            Remove Co-Author

        </button>

    `;

    container.appendChild(author);

}


/* =========================
   FILE UPLOAD
========================= */

function setupFileUpload() {

    const manuscriptInput =
        document.getElementById("manuscriptFile");

    const coverInput =
        document.getElementById("coverLetter");


    /* Main manuscript */

    if (manuscriptInput) {

        manuscriptInput.addEventListener(
            "change",
            function () {

                if (!this.files || !this.files.length) {
                    return;
                }

                const file = this.files[0];

                const fileName =
                    file.name.toLowerCase();


                /* Check extension */

                const validFile =
                    fileName.endsWith(".pdf") ||
                    fileName.endsWith(".doc") ||
                    fileName.endsWith(".docx");


                if (!validFile) {

                    alert(
                        "Please select a PDF, DOC or DOCX file."
                    );

                    this.value = "";

                    return;
                }


                /* Maximum 10 MB */

                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    alert(
                        "Your manuscript is larger than 10 MB."
                    );

                    this.value = "";

                    return;
                }


                /* Display selected filename */

                const box =
                    this.closest(".upload-box");

                if (box) {

                    const text =
                        box.querySelector("p");

                    if (text) {

                        text.textContent =
                            "✓ " + file.name;

                    }

                }

            }
        );

    }


    /* Cover letter */

    if (coverInput) {

        coverInput.addEventListener(
            "change",
            function () {

                if (!this.files || !this.files.length) {
                    return;
                }

                const file = this.files[0];

                const fileName =
                    file.name.toLowerCase();


                const validFile =
                    fileName.endsWith(".pdf") ||
                    fileName.endsWith(".doc") ||
                    fileName.endsWith(".docx");


                if (!validFile) {

                    alert(
                        "Please select a PDF, DOC or DOCX file."
                    );

                    this.value = "";

                    return;
                }


                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    alert(
                        "Your cover letter is larger than 10 MB."
                    );

                    this.value = "";

                    return;
                }


                const box =
                    this.closest(".upload-box");

                if (box) {

                    const text =
                        box.querySelector("p");

                    if (text) {

                        text.textContent =
                            "✓ " + file.name;

                    }

                }

            }
        );

    }

}


/* =========================
   SUBMIT MANUSCRIPT
========================= */

const manuscriptForm =
    document.getElementById("manuscriptForm");


if (manuscriptForm) {

    manuscriptForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Get manuscript */

            const manuscriptInput =
                document.getElementById(
                    "manuscriptFile"
                );

            const manuscript =
                manuscriptInput.files[0];


            /* Check manuscript */

            if (!manuscript) {

                alert(
                    "Please upload your manuscript."
                );

                manuscriptInput.focus();

                return;
            }


            /* Check extension */

            const fileName =
                manuscript.name.toLowerCase();

            const validFile =
                fileName.endsWith(".pdf") ||
                fileName.endsWith(".doc") ||
                fileName.endsWith(".docx");


            if (!validFile) {

                alert(
                    "Only PDF, DOC and DOCX files are accepted."
                );

                return;
            }


            /* Check size */

            if (
                manuscript.size >
                10 * 1024 * 1024
            ) {

                alert(
                    "Your manuscript is larger than 10 MB."
                );

                return;
            }


            /* =========================
               GET FORM DATA
            ========================= */

            const title =
                document
                .getElementById("articleTitle")
                .value
                .trim();

            const journal =
                document
                .getElementById("journal")
                .value;

            const articleType =
                document
                .getElementById("articleType")
                .value;

            const abstract =
                document
                .getElementById("abstract")
                .value
                .trim();

            const keywords =
                document
                .getElementById("keywords")
                .value
                .trim();

            const authorName =
                document
                .getElementById("authorName")
                .value
                .trim();

            const authorEmail =
                document
                .getElementById("authorEmail")
                .value
                .trim();

            const institution =
                document
                .getElementById("institution")
                .value
                .trim();

            const country =
                document
                .getElementById("country")
                .value;


            /* =========================
               GENERATE MANUSCRIPT ID
            ========================= */

            const year =
                new Date().getFullYear();

            const randomNumber =
                Math.floor(
                    10000 +
                    Math.random() * 90000
                );

            const manuscriptID =
                "SCP-" +
                year +
                "-" +
                randomNumber;


            /* =========================
               COVER LETTER
            ========================= */

            const coverInput =
                document.getElementById(
                    "coverLetter"
                );

            let coverLetterName = "";

            if (
                coverInput &&
                coverInput.files.length > 0
            ) {

                coverLetterName =
                    coverInput.files[0].name;

            }


            /* =========================
               COLLECT CO-AUTHORS
            ========================= */

            const coAuthors = [];

            document
            .querySelectorAll("#coAuthors .author-box")
            .forEach(function (box) {

                const name =
                    box.querySelector(
                        'input[name^="coAuthorName"]'
                    );

                const email =
                    box.querySelector(
                        'input[name^="coAuthorEmail"]'
                    );

                const institution =
                    box.querySelector(
                        'input[name^="coAuthorInstitution"]'
                    );


                coAuthors.push({

                    name:
                        name ? name.value.trim() : "",

                    email:
                        email ? email.value.trim() : "",

                    institution:
                        institution
                        ? institution.value.trim()
                        : ""

                });

            });


            /* =========================
               CREATE SUBMISSION
            ========================= */

            const submission = {

                id:
                    manuscriptID,

                title:
                    title,

                journal:
                    journal,

                articleType:
                    articleType,

                abstract:
                    abstract,

                keywords:
                    keywords,

                authorName:
                    authorName,

                authorEmail:
                    authorEmail,

                institution:
                    institution,

                country:
                    country,

                coAuthors:
                    coAuthors,

                manuscriptFile:
                    manuscript.name,

                coverLetter:
                    coverLetterName,

                status:
                    "Submitted",

                date:
                    new Date().toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )

            };


            /* =========================
               SAVE SUBMISSION
            ========================= */

            let submissions = [];

            try {

                submissions =
                    JSON.parse(
                        localStorage.getItem(
                            "scopusixteenSubmissions"
                        )
                    ) || [];

            } catch (error) {

                submissions = [];

            }


            submissions.push(submission);


            localStorage.setItem(
                "scopusixteenSubmissions",
                JSON.stringify(submissions)
            );


            /* =========================
               SHOW SUCCESS
            ========================= */

            const form =
                document.getElementById(
                    "manuscriptForm"
                );

            const success =
                document.getElementById(
                    "successMessage"
                );

            const idBox =
                document.getElementById(
                    "manuscriptId"
                );


            if (idBox) {

                idBox.textContent =
                    "Manuscript ID: " +
                    manuscriptID;

            }


            if (form) {

                form.style.display =
                    "none";

            }


            if (success) {

                success.style.display =
                    "block";

                success.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =========================
   LOAD SUBMISSIONS
========================= */

function loadSubmissions() {

    const table =
        document.getElementById(
            "submissionTableBody"
        );


    if (!table) {
        return;
    }


    let submissions = [];

    try {

        submissions =
            JSON.parse(
                localStorage.getItem(
                    "scopusixteenSubmissions"
                )
            ) || [];

    } catch (error) {

        submissions = [];

    }


    table.innerHTML = "";


    if (submissions.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                    ">

                    No manuscripts submitted yet.

                </td>

            </tr>

        `;

        return;
    }


    submissions.forEach(
        function (submission) {

            const row =
                document.createElement("tr");


            let statusClass =
                "status-submitted";


            if (
                submission.status ===
                "Under Review"
            ) {

                statusClass =
                    "status-review";

            }


            if (
                submission.status ===
                "Revision Required"
            ) {

                statusClass =
                    "status-revision";

            }


            if (
                submission.status ===
                "Accepted"
            ) {

                statusClass =
                    "status-accepted";

            }


            if (
                submission.status ===
                "Rejected"
            ) {

                statusClass =
                    "status-rejected";

            }


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            submission.title
                        )}
                    </strong>

                    <div class="manuscript-id">

                        ${escapeHTML(
                            submission.id
                        )}

                    </div>

                </td>

                <td>

                    ${escapeHTML(
                        submission.journal
                    )}

                </td>

                <td>

                    <span
                        class="status ${statusClass}">

                        ${escapeHTML(
                            submission.status
                        )}

                    </span>

                </td>

                <td>

                    ${escapeHTML(
                        submission.date
                    )}

                </td>

                <td>

                    <button
                        type="button"
                        class="action-btn"
                        onclick="viewManuscript('${submission.id}')">

                        View Details

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );


    updateStatistics(submissions);

}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStatistics(submissions) {

    const total =
        submissions.length;


    const underReview =
        submissions.filter(
            function (item) {

                return item.status ===
                    "Under Review";

            }
        ).length;


    const accepted =
        submissions.filter(
            function (item) {

                return item.status ===
                    "Accepted";

            }
        ).length;


    const rejected =
        submissions.filter(
            function (item) {

                return item.status ===
                    "Rejected";

            }
        ).length;


    const numbers =
        document.querySelectorAll(
            ".stat-number"
        );


    if (numbers.length >= 4) {

        numbers[0].textContent =
            total;

        numbers[1].textContent =
            underReview;

        numbers[2].textContent =
            accepted;

        numbers[3].textContent =
            rejected;

    }

}


/* =========================
   VIEW MANUSCRIPT
========================= */

function viewManuscript(id) {

    let submissions = [];

    try {

        submissions =
            JSON.parse(
                localStorage.getItem(
                    "scopusixteenSubmissions"
                )
            ) || [];

    } catch (error) {

        submissions = [];

    }


    const submission =
        submissions.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!submission) {

        alert(
            "Manuscript could not be found."
        );

        return;
    }


    alert(

        "Manuscript ID: " +
        submission.id +

        "\n\nTitle: " +
        submission.title +

        "\n\nJournal: " +
        submission.journal +

        "\n\nArticle Type: " +
        submission.articleType +

        "\n\nAuthor: " +
        submission.authorName +

        "\n\nEmail: " +
        submission.authorEmail +

        "\n\<script>

/* =========================
   ADD CO-AUTHOR
========================= */

let authorCount = 0;

function addAuthor() {

    authorCount++;

    const container =
        document.getElementById("coAuthors");

    const author =
        document.createElement("div");

    author.className = "author-box";

    author.innerHTML = `

        <h3>
            Co-Author ${authorCount}
        </h3>

        <div class="form-row">

            <div class="form-group">

                <label>
                    Full Name
                </label>

                <input
                    type="text"
                    name="coAuthorName${authorCount}"
                    placeholder="Full name"
                    required
                >

            </div>

            <div class="form-group">

                <label>
                    Email
                </label>

                <input
                    type="email"
                    name="coAuthorEmail${authorCount}"
                    placeholder="author@example.com"
                    required
                >

            </div>

        </div>

        <div class="form-group">

            <label>
                Institution
            </label>

            <input
                type="text"
                name="coAuthorInstitution${authorCount}"
                placeholder="University or organization"
                required
            >

        </div>

    `;

    container.appendChild(author);

}


/* =========================
   SUBMIT MANUSCRIPT
========================= */

document
.getElementById("manuscriptForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const manuscriptFile =
        document.getElementById("manuscriptFile").files[0];

    /* Check manuscript */

    if (!manuscriptFile) {

        alert("Please upload your manuscript.");

        return;

    }

    /* Check file size */

    if (manuscriptFile.size > 10 * 1024 * 1024) {

        alert("Your manuscript is larger than 10 MB.");

        return;

    }


    /* Generate Manuscript ID */

    const year =
        new Date().getFullYear();

    const randomNumber =
        Math.floor(
            10000 + Math.random() * 90000
        );

    const manuscriptID =
        "SCP-" +
        year +
        "-" +
        randomNumber;


    /* Collect manuscript information */

    const submission = {

        id: manuscriptID,

        title:
            document.getElementById("articleTitle").value,

        journal:
            document.getElementById("journal").value,

        articleType:
            document.getElementById("articleType").value,

        abstract:
            document.getElementById("abstract").value,

        keywords:
            document.getElementById("keywords").value,

        authorName:
            document.getElementById("authorName").value,

        authorEmail:
            document.getElementById("authorEmail").value,

        institution:
            document.getElementById("institution").value,

        country:
            document.getElementById("country").value,

        fileName:
            manuscriptFile.name,

        status:
            "Submitted",

        date:
            new Date().toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            )

    };


    /* =========================
       SAVE SUBMISSION
    ========================= */

    let submissions =
        JSON.parse(
            localStorage.getItem("scopusixteenSubmissions")
        ) || [];


    submissions.push(submission);


    localStorage.setItem(
        "scopusixteenSubmissions",
        JSON.stringify(submissions)
    );


    /* =========================
       SHOW SUCCESS MESSAGE
    ========================= */

    document
        .getElementById("manuscriptForm")
        .style.display = "none";


    document
        .getElementById("successMessage")
        .style.display = "block";


    document
        .getElementById("manuscriptId")
        .textContent =
        "Manuscript ID: " + manuscriptID;


    /* Scroll to success message */

    document
        .getElementById("successMessage")
        .scrollIntoView({
            behavior: "smooth"
        });

});


</script>

<script>

/* =========================
   SECTION NAVIGATION
========================= */

function showSection(sectionId, element) {

    document.querySelectorAll(".portal-section").forEach(function(section) {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";

    document.querySelectorAll(".sidebar a").forEach(function(link) {
        link.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

}


/* =========================
   SHOW SECTION BY ID
========================= */

function showSectionById(sectionId) {

    document.querySelectorAll(".portal-section").forEach(function(section) {
        section.style.display = "none";
    });

    document.getElementById(sectionId).style.display = "block";

}


/* =========================
   LOAD SUBMISSIONS
========================= */

function loadSubmissions() {

    const submissions =
        JSON.parse(
            localStorage.getItem("scopusixteenSubmissions")
        ) || [];

    const table =
        document.getElementById("submissionTableBody");

    if (!table) {
        return;
    }

    table.innerHTML = "";


    if (submissions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:30px;">
                    No manuscripts submitted yet.
                </td>
            </tr>
        `;

        return;
    }


    submissions.forEach(function(submission) {

        const row =
            document.createElement("tr");


        let statusClass = "status-submitted";

        if (submission.status === "Under Review") {
            statusClass = "status-review";
        }

        if (submission.status === "Revision Required") {
            statusClass = "status-revision";
        }

        if (submission.status === "Accepted") {
            statusClass = "status-accepted";
        }

        if (submission.status === "Rejected") {
            statusClass = "status-rejected";
        }


        row.innerHTML = `

            <td>

                <strong>
                    ${escapeHTML(submission.title)}
                </strong>

                <div class="manuscript-id">
                    ${escapeHTML(submission.id)}
                </div>

            </td>

            <td>
                ${escapeHTML(submission.journal)}
            </td>

            <td>

                <span class="status ${statusClass}">
                    ${escapeHTML(submission.status)}
                </span>

            </td>

            <td>
                ${escapeHTML(submission.date)}
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="viewManuscript('${submission.id}')">

                    View Details

                </button>

            </td>

        `;

        table.appendChild(row);

    });


    updateStatistics(submissions);

}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStatistics(submissions) {

    const total =
        submissions.length;

    const underReview =
        submissions.filter(function(item) {
            return item.status === "Under Review";
        }).length;

    const revision =
        submissions.filter(function(item) {
            return item.status === "Revision Required";
        }).length;

    const accepted =
        submissions.filter(function(item) {
            return item.status === "Accepted";
        }).length;


    const numbers =
        document.querySelectorAll(".stat-number");


    if (numbers.length >= 4) {

        numbers[0].textContent = total;

        numbers[1].textContent = underReview;

        numbers[2].textContent = revision;

        numbers[3].textContent = accepted;

    }

}


/* =========================
   VIEW MANUSCRIPT
========================= */

function viewManuscript(id) {

    const submissions =
        JSON.parse(
            localStorage.getItem("scopusixteenSubmissions")
        ) || [];


    const submission =
        submissions.find(function(item) {
            return item.id === id;
        });


    if (!submission) {

        alert("Manuscript could not be found.");

        return;

    }


    alert(
        "Manuscript ID: " + submission.id +
        "\n\n" +
        "Title: " + submission.title +
        "\n\n" +
        "Journal: " + submission.journal +
        "\n\n" +
        "Article Type: " + submission.articleType +
        "\n\n" +
        "Author: " + submission.authorName +
        "\n\n" +
        "Status: " + submission.status +
        "\n\n" +
        "Submitted: " + submission.date
    );

}


/* =========================
   HTML SECURITY
========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("authorRegistered");

    localStorage.removeItem("authorEmail");

    window.location.href =
        "login.html";

}


/* =========================
   LOAD WHEN PAGE OPENS
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadSubmissions();

    }
);

</script>

/* =========================
   ORCID CONNECTION
========================= */

function connectORCID() {

    alert(
        "ORCID connection will be activated when Scopusixteen authentication is connected."
    );

}


/* =========================
   GOOGLE CONNECTION
========================= */

function connectGoogle() {

    alert(
        "Google connection will be activated when Google authentication is connected."
    );

}

<script>

/* =========================
   EMAIL REGISTRATION
========================= */

document.getElementById("registerForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const institution = document.getElementById("institution").value.trim();
    const country = document.getElementById("country").value;
    const orcid = document.getElementById("orcid").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    /* Check password length */

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    /* Check passwords */

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    /* Save demo account */

    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        institution: institution,
        country: country,
        orcid: orcid
    };

    localStorage.setItem(
        "scopusixteenUser",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "scopusixteenLoggedIn",
        "true"
    );

    alert(
        "Account created successfully! Welcome to Scopusixteen Publishing."
    );

    /* Open Author Portal */

    window.location.href = "author-portal.html";

});


/* =========================
   ORCID REGISTRATION
========================= */

function registerWithORCID() {

    alert(
        "ORCID registration will be connected when the Scopusixteen authentication system is added."
    );

}


/* =========================
   GOOGLE REGISTRATION
========================= */

function registerWithGoogle() {

    alert(
        "Google registration will be connected when Google OAuth authentication is added."
    );

}

</script>

document.getElementById("manuscriptForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const manuscript =
        document.getElementById("manuscriptFile").files[0];

    if (!manuscript) {
        alert("Please upload your manuscript.");
        return;
    }

    // Maximum 10 MB
    if (manuscript.size > 10 * 1024 * 1024) {
        alert("Your manuscript is larger than 10 MB.");
        return;
    }

    // Generate manuscript ID
    const year = new Date().getFullYear();

    const randomNumber = Math.floor(
        10000 + Math.random() * 90000
    );

    const manuscriptID =
        "SCP-" + year + "-" + randomNumber;

    // Get form information
    const title =
        document.getElementById("articleTitle").value.trim();

    const journal =
        document.getElementById("journal").value;

    const authorName =
        document.getElementById("authorName").value.trim();

    const authorEmail =
        document.getElementById("authorEmail").value.trim();

    // Create submission
    const submission = {

        id: manuscriptID,

        title: title,

        journal: journal,

        author: authorName,

        email: authorEmail,

        date: new Date().toLocaleDateString(),

        status: "Under Review"

    };

    // Get previous submissions
    let submissions =
        JSON.parse(
            localStorage.getItem(
                "scopusixteenManuscripts"
            )
        ) || [];

    // Add new submission
    submissions.push(submission);

    // Save submissions
    localStorage.setItem(
        "scopusixteenManuscripts",
        JSON.stringify(submissions)
    );

    // Show manuscript ID
    document.getElementById(
        "manuscriptId"
    ).textContent =
        "Manuscript ID: " + manuscriptID;

    // Hide form
    document.getElementById(
        "manuscriptForm"
    ).style.display = "none";

    // Show success message
    document.getElementById(
        "successMessage"
    ).style.display = "block";

});

<script>

let authorCount = 0;

/* =========================
   ADD CO-AUTHOR
========================= */

function addAuthor() {

    authorCount++;

    const container =
        document.getElementById("coAuthors");

    const author =
        document.createElement("div");

    author.className = "author-box";

    author.innerHTML = `

        <h3>Co-Author ${authorCount}</h3>

        <div class="form-row">

            <div class="form-group">

                <label>Full Name</label>

                <input
                    type="text"
                    name="coAuthorName${authorCount}"
                    placeholder="Full name"
                    required
                >

            </div>

            <div class="form-group">

                <label>Email</label>

                <input
                    type="email"
                    name="coAuthorEmail${authorCount}"
                    placeholder="author@example.com"
                    required
                >

            </div>

        </div>

        <div class="form-group">

            <label>Institution</label>

            <input
                type="text"
                name="coAuthorInstitution${authorCount}"
                placeholder="University or organization"
                required
            >

        </div>

    `;

    container.appendChild(author);
}


/* =========================
   SUBMIT MANUSCRIPT
========================= */

document
.getElementById("manuscriptForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const manuscript =
        document
        .getElementById("manuscriptFile")
        .files[0];

    /* Check manuscript */

    if (!manuscript) {

        alert("Please upload your manuscript.");

        return;
    }

    /* Check file size */

    if (manuscript.size > 10 * 1024 * 1024) {

        alert("Your manuscript is larger than 10 MB.");

        return;
    }


    /* =========================
       GET FORM INFORMATION
    ========================= */

    const title =
        document
        .getElementById("articleTitle")
        .value
        .trim();

    const journal =
        document
        .getElementById("journal")
        .value;

    const articleType =
        document
        .getElementById("articleType")
        .value;

    const author =
        document
        .getElementById("authorName")
        .value
        .trim();

    const email =
        document
        .getElementById("authorEmail")
        .value
        .trim();

    const institution =
        document
        .getElementById("institution")
        .value
        .trim();

    const country =
        document
        .getElementById("country")
        .value;

    const abstract =
        document
        .getElementById("abstract")
        .value
        .trim();

    const keywords =
        document
        .getElementById("keywords")
        .value
        .trim();


    /* =========================
       GENERATE MANUSCRIPT ID
    ========================= */

    const year =
        new Date().getFullYear();

    const randomNumber =
        Math.floor(
            10000 +
            Math.random() * 90000
        );

    const manuscriptID =
        "SCP-" +
        year +
        "-" +
        randomNumber;


    /* =========================
       DATE
    ========================= */

    const submissionDate =
        new Date().toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    /* =========================
       CREATE RECORD
    ========================= */

    const submission = {

        id: manuscriptID,

        title: title,

        journal: journal,

        articleType: articleType,

        abstract: abstract,

        keywords: keywords,

        author: author,

        email: email,

        institution: institution,

        country: country,

        date: submissionDate,

        status: "Submitted",

        manuscriptFile: manuscript.name,

        coverLetter:
            document
            .getElementById("coverLetter")
            .files[0]
            ?
            document
            .getElementById("coverLetter")
            .files[0].name
            :
            ""

    };


    /* =========================
       GET EXISTING SUBMISSIONS
    ========================= */

    let manuscripts =
        JSON.parse(
            localStorage.getItem(
                "scopusixteenManuscripts"
            )
        ) || [];


    /* Add new submission */

    manuscripts.push(submission);


    /* Save */

    localStorage.setItem(
        "scopusixteenManuscripts",
        JSON.stringify(manuscripts)
    );


    /* =========================
       SHOW SUCCESS
    ========================= */

    document
    .getElementById("manuscriptId")
    .textContent =
        "Manuscript ID: " +
        manuscriptID;


    document
    .getElementById("manuscriptForm")
    .style.display =
        "none";


    document
    .getElementById("successMessage")
    .style.display =
        "block";


    /* Scroll to success */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

</script>

/* =========================
   FILE SELECTION
========================= */

const manuscriptFileInput =
    document.getElementById("manuscriptFile");

const fileName =
    document.getElementById("fileName");

manuscriptFileInput.addEventListener(
    "change",
    function() {

        const file = this.files[0];

        if (!file) {

            fileName.textContent = "";

            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const allowedExtensions = [
            ".pdf",
            ".doc",
            ".docx"
        ];

        const extension =
            file.name
            .substring(file.name.lastIndexOf("."))
            .toLowerCase();

        if (
            !allowedTypes.includes(file.type) &&
            !allowedExtensions.includes(extension)
        ) {

            alert(
                "Please select a PDF, DOC, or DOCX file."
            );

            this.value = "";

            fileName.textContent = "";

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "The manuscript must not be larger than 10 MB."
            );

            this.value = "";

            fileName.textContent = "";

            return;
        }

        fileName.textContent =
            "✓ Selected: " + file.name;

    }
);


/* =========================
   COVER LETTER
========================= */

const coverLetterInput =
    document.getElementById("coverLetter");

const coverLetterName =
    document.getElementById("coverLetterName");

coverLetterInput.addEventListener(
    "change",
    function() {

        const file = this.files[0];

        if (!file) {

            coverLetterName.textContent = "";

            return;
        }

        const extension =
            file.name
            .substring(file.name.lastIndexOf("."))
            .toLowerCase();

        const allowedExtensions = [
            ".pdf",
            ".doc",
            ".docx"
        ];

        if (!allowedExtensions.includes(extension)) {

            alert(
                "Please select a PDF, DOC, or DOCX file."
            );

            this.value = "";

            coverLetterName.textContent = "";

            return;
        }

        coverLetterName.textContent =
            "✓ Selected: " + file.name;

    }
);

<script>

/* =========================
   AUTO-FILL AUTHOR DETAILS
========================= */

const savedUser =
    localStorage.getItem("scopusixteenUser");

if (savedUser) {

    try {

        const user = JSON.parse(savedUser);

        if (user.firstName && user.lastName) {
            document.getElementById("authorName").value =
                user.firstName + " " + user.lastName;
        }

        if (user.email) {
            document.getElementById("authorEmail").value =
                user.email;
        }

        if (user.institution) {
            document.getElementById("institution").value =
                user.institution;
        }

        if (user.country) {
            document.getElementById("country").value =
                user.country;
        }

    } catch (error) {

        console.log("Unable to load author information.");

    }

}


/* =========================
   ADD CO-AUTHOR
========================= */

let authorCount = 0;

function addAuthor() {

    authorCount++;

    const container =
        document.getElementById("coAuthors");

    const author =
        document.createElement("div");

    author.className = "author-box";

    author.innerHTML = `

        <h3>
            Co-Author ${authorCount}
        </h3>

        <div class="form-row">

            <div class="form-group">

                <label>
                    Full Name *
                </label>

                <input
                    type="text"
                    name="coAuthorName${authorCount}"
                    placeholder="Full name"
                    required
                >

            </div>

            <div class="form-group">

                <label>
                    Email *
                </label>

                <input
                    type="email"
                    name="coAuthorEmail${authorCount}"
                    placeholder="author@example.com"
                    required
                >

            </div>

        </div>

        <div class="form-group">

            <label>
                Institution *
            </label>

            <input
                type="text"
                name="coAuthorInstitution${authorCount}"
                placeholder="University or organization"
                required
            >

        </div>

        <button
            type="button"
            class="add-author"
            onclick="this.parentElement.remove()">

            Remove Co-Author

        </button>
    `;

    container.appendChild(author);

}


/* =========================
   FILE UPLOAD DISPLAY
========================= */

const manuscriptFile =
    document.getElementById("manuscriptFile");

const coverLetter =
    document.getElementById("coverLetter");


manuscriptFile.addEventListener("change", function () {

    if (this.files.length > 0) {

        const file = this.files[0];

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const fileName =
            file.name.toLowerCase();

        const validExtension =
            fileName.endsWith(".pdf") ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx");


        if (!validExtension) {

            alert(
                "Please select a PDF, DOC or DOCX file."
            );

            this.value = "";

            return;
        }


        /* Maximum 10 MB */

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "Your manuscript is larger than 10 MB."
            );

            this.value = "";

            return;
        }


        /* Show selected file */

        this.parentElement.querySelector("p").textContent =
            "✓ " + file.name;

    }

});


coverLetter.addEventListener("change", function () {

    if (this.files.length > 0) {

        const file = this.files[0];

        const fileName =
            file.name.toLowerCase();

        const validExtension =
            fileName.endsWith(".pdf") ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx");


        if (!validExtension) {

            alert(
                "Please select a PDF, DOC or DOCX file."
            );

            this.value = "";

            return;
        }


        /* Maximum 10 MB */

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "Your cover letter is larger than 10 MB."
            );

            this.value = "";

            return;
        }


        this.parentElement.querySelector("p").textContent =
            "✓ " + file.name;

    }

});


/* =========================
   SUBMIT MANUSCRIPT
========================= */

document
.getElementById("manuscriptForm")
.addEventListener("submit", function(event) {

    event.preventDefault();


    /* Get manuscript file */

    const manuscript =
        document.getElementById("manuscriptFile")
        .files[0];


    /* Check manuscript */

    if (!manuscript) {

        alert(
            "Please upload your manuscript."
        );

        document
        .getElementById("manuscriptFile")
        .focus();

        return;
    }


    /* Check file extension */

    const manuscriptName =
        manuscript.name.toLowerCase();

    const validManuscript =
        manuscriptName.endsWith(".pdf") ||
        manuscriptName.endsWith(".doc") ||
        manuscriptName.endsWith(".docx");


    if (!validManuscript) {

        alert(
            "Only PDF, DOC and DOCX files are accepted."
        );

        return;
    }


    /* Check file size */

    if (manuscript.size > 10 * 1024 * 1024) {

        alert(
            "Your manuscript is larger than 10 MB."
        );

        return;
    }


    /* =========================
       GENERATE MANUSCRIPT ID
    ========================= */

    const year =
        new Date().getFullYear();

    const randomNumber =
        Math.floor(
            10000 +
            Math.random() * 90000
        );

    const manuscriptID =
        "SCP-" +
        year +
        "-" +
        randomNumber;


    /* =========================
       SAVE SUBMISSION
    ========================= */

    const submission = {

        id: manuscriptID,

        title:
            document.getElementById("articleTitle").value,

        journal:
            document.getElementById("journal").value,

        articleType:
            document.getElementById("articleType").value,

        abstract:
            document.getElementById("abstract").value,

        keywords:
            document.getElementById("keywords").value,

        author:
            document.getElementById("authorName").value,

        email:
            document.getElementById("authorEmail").value,

        institution:
            document.getElementById("institution").value,

        country:
            document.getElementById("country").value,

        manuscriptFile:
            manuscript.name,

        coverLetter:
            coverLetter.files.length > 0
                ? coverLetter.files[0].name
                : "",

        status:
            "Submitted",

        date:
            new Date().toLocaleDateString(),

        submittedAt:
            new Date().toISOString()

    };


    /* Get previous submissions */

    let submissions =
        JSON.parse(
            localStorage.getItem(
                "scopusixteenSubmissions"
            )
        ) || [];


    /* Add new submission */

    submissions.push(submission);


    /* Save */

    localStorage.setItem(
        "scopusixteenSubmissions",
        JSON.stringify(submissions)
    );


    /* =========================
       SHOW SUCCESS MESSAGE
    ========================= */

    document
    .getElementById("manuscriptId")
    .textContent =
        "Manuscript ID: " +
        manuscriptID;


    document
    .getElementById("manuscriptForm")
    .style.display =
        "none";


    document
    .getElementById("successMessage")
    .style.display =
        "block";


    /* Scroll to success message */

    document
    .getElementById("successMessage")
    .scrollIntoView({
        behavior: "smooth"
    });

});

</script>

</body>
</html>
    
    <script>

/* =========================
   AUTO-FILL AUTHOR DETAILS
========================= */

const savedUser =
    localStorage.getItem("scopusixteenUser");

if (savedUser) {

    try {

        const user = JSON.parse(savedUser);

        if (user.firstName && user.lastName) {
            document.getElementById("authorName").value =
                user.firstName + " " + user.lastName;
        }

        if (user.email) {
            document.getElementById("authorEmail").value =
                user.email;
        }

        if (user.institution) {
            document.getElementById("institution").value =
                user.institution;
        }

        if (user.country) {
            document.getElementById("country").value =
                user.country;
        }

    } catch (error) {

        console.log(
            "Unable to load author information."
        );

    }

}


/* =========================
   ADD CO-AUTHOR
========================= */

let authorCount = 0;

function addAuthor() {

    authorCount++;

    const container =
        document.getElementById("coAuthors");

    const author =
        document.createElement("div");

    author.className = "author-box";

    author.innerHTML = `

        <h3>
            Co-Author ${authorCount}
        </h3>

        <div class="form-row">

            <div class="form-group">

                <label>
                    Full Name *
                </label>

                <input
                    type="text"
                    name="coAuthorName${authorCount}"
                    placeholder="Full name"
                    required
                >

            </div>

            <div class="form-group">

                <label>
                    Email *
                </label>

                <input
                    type="email"
                    name="coAuthorEmail${authorCount}"
                    placeholder="author@example.com"
                    required
                >

            </div>

        </div>

        <div class="form-group">

            <label>
                Institution *
            </label>

            <input
                type="text"
                name="coAuthorInstitution${authorCount}"
                placeholder="University or organization"
                required
            >

        </div>

    `;

    container.appendChild(author);

}


/* =========================
   FILE VALIDATION
========================= */

const MAX_FILE_SIZE =
    10 * 1024 * 1024;

const allowedExtensions = [
    "pdf",
    "doc",
    "docx"
];


function validateFile(file) {

    if (!file) {
        return false;
    }

    const extension =
        file.name
        .toLowerCase()
        .split(".")
        .pop();

    if (!allowedExtensions.includes(extension)) {

        alert(
            "Invalid file type.\n\n" +
            "Please upload a PDF, DOC or DOCX file."
        );

        return false;

    }

    if (file.size > MAX_FILE_SIZE) {

        alert(
            "File is too large.\n\n" +
            "Maximum allowed size is 10 MB."
        );

        return false;

    }

    return true;

}


/* =========================
   SHOW FILE NAME
========================= */

document
.getElementById("manuscriptFile")
.addEventListener("change", function() {

    const file = this.files[0];

    const display =
        document.getElementById(
            "manuscriptFileName"
        );

    if (!file) {

        display.textContent = "";

        return;

    }

    if (!validateFile(file)) {

        this.value = "";

        display.textContent = "";

        return;

    }

    display.textContent =
        "Selected: " + file.name;

});


/* =========================
   COVER LETTER
========================= */

document
.getElementById("coverLetter")
.addEventListener("change", function() {

    const file = this.files[0];

    const display =
        document.getElementById(
            "coverLetterName"
        );

    if (!file) {

        display.textContent = "";

        return;

    }

    if (!validateFile(file)) {

        this.value = "";

        display.textContent = "";

        return;

    }

    display.textContent =
        "Selected: " + file.name;

});


/* =========================
   SUBMIT MANUSCRIPT
========================= */

document
.getElementById("manuscriptForm")
.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* =========================
           CHECK MAIN FILE
        ========================= */

        const manuscriptFile =
            document
            .getElementById("manuscriptFile")
            .files[0];


        if (!manuscriptFile) {

            alert(
                "Please upload your manuscript."
            );

            return;

        }


        if (!validateFile(manuscriptFile)) {

            return;

        }


        /* =========================
           CHECK DECLARATIONS
        ========================= */

        const originalWork =
            document.getElementById(
                "originalWork"
            ).checked;


        const authorApproval =
            document.getElementById(
                "authorApproval"
            ).checked;


        const informationCorrect =
            document.getElementById(
                "informationCorrect"
            ).checked;


        if (
            !originalWork ||
            !authorApproval ||
            !informationCorrect
        ) {

            alert(
                "Please accept all declarations before continuing."
            );

            return;

        }


        /* =========================
           GET FORM DATA
        ========================= */

        const title =
            document
            .getElementById("articleTitle")
            .value
            .trim();


        const journal =
            document
            .getElementById("journal")
            .value;


        const articleType =
            document
            .getElementById("articleType")
            .value;


        const abstract =
            document
            .getElementById("abstract")
            .value
            .trim();


        const keywords =
            document
            .getElementById("keywords")
            .value
            .trim();


        const authorName =
            document
            .getElementById("authorName")
            .value
            .trim();


        const authorEmail =
            document
            .getElementById("authorEmail")
            .value
            .trim();


        const institution =
            document
            .getElementById("institution")
            .value
            .trim();


        const country =
            document
            .getElementById("country")
            .value;


        /* =========================
           GET COVER LETTER
        ========================= */

        const coverLetterFile =
            document
            .getElementById("coverLetter")
            .files[0];


        /* =========================
           GENERATE MANUSCRIPT ID
        ========================= */

        const year =
            new Date().getFullYear();


        const randomNumber =
            Math.floor(
                10000 +
                Math.random() * 90000
            );


        const manuscriptID =
            "SCP-" +
            year +
            "-" +
            randomNumber;


        /* =========================
           COLLECT CO-AUTHORS
        ========================= */

        const coAuthors = [];


        for (
            let i = 1;
            i <= authorCount;
            i++
        ) {

            const name =
                document.querySelector(
                    `[name="coAuthorName${i}"]`
                );


            const email =
                document.querySelector(
                    `[name="coAuthorEmail${i}"]`
                );


            const institutionField =
                document.querySelector(
                    `[name="coAuthorInstitution${i}"]`
                );


            if (name) {

                coAuthors.push({

                    name:
                        name.value.trim(),

                    email:
                        email
                        ? email.value.trim()
                        : "",

                    institution:
                        institutionField
                        ? institutionField.value.trim()
                        : ""

                });

            }

        }


        /* =========================
           CREATE PENDING SUBMISSION
        ========================= */

        const pendingSubmission = {

            id: manuscriptID,

            title: title,

            journal: journal,

            articleType: articleType,

            abstract: abstract,

            keywords: keywords,

            authorName: authorName,

            authorEmail: authorEmail,

            institution: institution,

            country: country,

            coAuthors: coAuthors,

            manuscriptFile:
                manuscriptFile.name,

            manuscriptFileSize:
                manuscriptFile.size,

            coverLetter:
                coverLetterFile
                ? coverLetterFile.name
                : "",

            paymentStatus:
                "Pending",

            submissionStatus:
                "Payment Pending",

            createdAt:
                new Date().toISOString()

        };


        /* =========================
           SAVE PENDING SUBMISSION
        ========================= */

        localStorage.setItem(
            "scopusixteenPendingSubmission",
            JSON.stringify(
                pendingSubmission
            )
        );


        /* =========================
           GO TO PAYMENT PAGE
        ========================= */

        window.location.href =
            "payment.html";

    }
);

</script>