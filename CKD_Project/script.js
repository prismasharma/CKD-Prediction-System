// ----------------- PRELOADER -----------------
window.addEventListener("load", function(){
    document.getElementById("preloader").style.display = "none";
});

// ----------------- SELECTORS -----------------
const form = document.getElementById("ckdForm");
const predictBtn = document.querySelector(".predict-btn");
const resultBox = document.getElementById("resultBox");

// Risk bar element
let riskBar;
if (!document.querySelector('.risk-bar')) {
    riskBar = document.createElement('div');
    riskBar.classList.add('risk-bar');
    let fill = document.createElement('div');
    fill.classList.add('risk-fill');
    riskBar.appendChild(fill);
    document.querySelector('.result').appendChild(riskBar);
} else {
    riskBar = document.querySelector('.risk-bar');
}

// ----------------- PREDICT BUTTON -----------------
predictBtn.addEventListener("click", async function(){
    // 1️⃣ Collect all form inputs
    const inputs = form.querySelectorAll("input, select");
    let data = {};
    inputs.forEach(input => {
        const key = input.placeholder || input.options[0].text;
        data[key] = input.value;
    });

    // 2️⃣ Show loading state in result
    resultBox.innerHTML = `<p style="color:#0f4c81;">Predicting CKD...</p>`;
    riskBar.querySelector('.risk-fill').style.width = '0%';

    try {
        // 3️⃣ Send data to backend API
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // 4️⃣ Update result box
        resultBox.innerHTML = `<p style="font-weight:700; font-size:24px;">Prediction: ${result.prediction}</p>`;

        // 5️⃣ Animate risk bar based on prediction
        let riskPercentage = result.prediction === "CKD Positive" ? 90 : 10;
        const fill = riskBar.querySelector('.risk-fill');
        fill.style.width = '0%';
        setTimeout(() => fill.style.width = riskPercentage + '%', 100);

    } catch (error) {
        resultBox.innerHTML = `<p style="color:red;">Error connecting to backend</p>`;
    }
});






