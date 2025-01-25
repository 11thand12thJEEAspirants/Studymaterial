document.addEventListener("DOMContentLoaded", function () {
    const sections = ["Physics", "Chemistry", "Mathematics"];
    const questionsPerSection = 30;

    const timerDisplay = document.getElementById("timer");
    const tabs = document.querySelectorAll("#tabs button");
    const questions = document.querySelectorAll(".question");
    const calendar = document.getElementById("calendar");
    const submitButton = document.getElementById("submit-button");
    const prevButton = document.getElementById("prev-question");
    const nextButton = document.getElementById("next-question");

    let currentSection = 0;
    let currentQuestion = 0;
    let timeRemaining = 3 * 60 * 60; // 3 hours in seconds

    const questionStates = Array.from({ length: sections.length }, () =>
        Array(questionsPerSection).fill("unanswered")
    );

    function updateTimer() {
        const hours = String(Math.floor(timeRemaining / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((timeRemaining % 3600) / 60)).padStart(2, "0");
        const seconds = String(timeRemaining % 60).padStart(2, "0");
        timerDisplay.textContent = `Time Remaining: ${hours}:${minutes}:${seconds}`;
        timeRemaining--;
        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            alert("Time's up! Exam will be submitted automatically.");
            submitExam();
        }
    }
    const timerInterval = setInterval(updateTimer, 1000);

    function showQuestion() {
        questions.forEach((q, index) => {
            q.classList.toggle(
                "active",
                index === currentQuestion && parseInt(q.dataset.section) === currentSection
            );
        });
        updateCalendar();
    }

    function showSection(index) {
        tabs.forEach((tab, i) => {
            tab.classList.toggle("active", i === index);
        });
        currentSection = index;
        currentQuestion = 0;
        showQuestion();
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            showSection(index);
        });
    });
    
    function updateCalendar() {
        calendar.innerHTML = "";
        for (let i = 0; i < questionsPerSection; i++) {
            const btn = document.createElement("button");
            btn.textContent = i + 1;
            btn.className = questionStates[currentSection][i];
            btn.addEventListener("click", () => {
                currentQuestion = i;
                showQuestion();
            });
            calendar.appendChild(btn);
        }
    }

    document.querySelectorAll("input[type=radio]").forEach((input) => {
        input.addEventListener("change", (event) => {
            const questionIndex = parseInt(event.target.name.match(/\d+/)[0], 10) - 1;
            if (!isNaN(questionIndex) && questionIndex < questionsPerSection) {
                questionStates[currentSection][questionIndex] = "answered";
                updateCalendar();
            }
        });
    });

    submitButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to submit the exam?")) {
            submitExam();
        }
    });

    function submitExam() {
        clearInterval(timerInterval);
        alert("Exam Submitted Successfully!");
    }

    prevButton.addEventListener("click", () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentQuestion < questionsPerSection - 1) {
            currentQuestion++;
            showQuestion();
        }
    });
    
    showSection(0);
});
