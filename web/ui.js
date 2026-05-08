/**
 * UI BRIDGE & ACADEMIC ANALYSIS
 */

// 1. MONKEY PATCH: Fix 'isStarted' naming collision in Process.js
const originalProcess = Process;
Process = function(PID, arrivalTime, burstTime) {
    const instance = new originalProcess(PID, arrivalTime, burstTime);
    instance._realStartedFlag = false; 
    delete instance.isStarted; 
    return instance;
};
Process.prototype = originalProcess.prototype;
Process.prototype.setStarted = function(val) { this._realStartedFlag = val; };
Process.prototype.isStarted = function() { return this._realStartedFlag; };

// 2. MONKEY PATCH: Fix "Cancel" Loop and Validate Input
ValidateInput.getInt = function(q, min, max) {
    while (true) {
        let s = prompt(q);
        if (s === null) throw "EXIT_PROCESS"; // Stop simulation if Cancel is clicked
        
        let p = parseInt(s, 10);
        
        // Check if input is a valid integer within the range
        if (!isNaN(p) && s.trim() !== "" && p >= min && p <= max) {
            return p;
        }
        
        // Course Requirement: Show validation behavior
        alert(`VALIDATION ERROR:\n"${s}" is not a valid input.\nPlease enter a number between ${min} and ${max}.`);
    }
};

ValidateInput.getManualPID = function(index) {
    let s = prompt(`Enter PID for Process ${index} (e.g. P1):`);
    if (s === null) throw "EXIT_PROCESS";
    return s.trim() === "" ? "P" + index : s;
};

// 3. Helper: PriorityQueue for SRTF logic
class PriorityQueue {
    constructor(c) { this.items = []; this.c = c; }
    add(v) { this.items.push(v); this.items.sort(this.c); }
    poll() { return this.items.shift() || null; }
}

// 4. Controller
document.addEventListener('DOMContentLoaded', () => {
    
    // Manual Simulation Button
    document.getElementById('run-btn').addEventListener('click', () => {
        startManualInput();
    });

    // Scenario Buttons
    document.querySelectorAll('.scen-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.scen;
            runScenario(type);
        });
    });

    document.getElementById('reset-btn').onclick = () => location.reload();
});

/**
 * Handles the manual entry flow
 */
function startManualInput() {
    try {
        const n = ValidateInput.setValidNumberOfProcesses();
        const data = [];
        for (let i = 0; i < n; i++) {
            const pid = ValidateInput.getManualPID(i + 1);
            const arrival = ValidateInput.setValidArrivalTime(pid);
            const burst = ValidateInput.setValidBurstTime(pid);
            data.push({ id: pid, a: arrival, b: burst });
        }
        const q = ValidateInput.setValidTimeQuantum();
        execute(data, q);
    } catch (e) { 
        if (e === "EXIT_PROCESS") console.log("User cancelled simulation."); 
    }
}

/**
 * Handles predefined scenarios
 */
function runScenario(type) {
    let d = [], q = 2;
    switch (type) {
        case "A": d = [{id:"P1", a:0, b:6}, {id:"P2", a:1, b:4}, {id:"P3", a:2, b:2}]; q = 3; break;
        case "B": d = [{id:"P1", a:0, b:10}, {id:"P2", a:1, b:2}]; q = 1; break;
        case "C": d = [{id:"P1", a:0, b:10}, {id:"P2", a:1, b:1}, {id:"P3", a:2, b:1}]; q = 4; break;
        case "D": d = [{id:"P1", a:0, b:5}, {id:"P2", a:0, b:5}, {id:"P3", a:0, b:5}]; q = 2; break;
        case "E": 
            // Scenario E Instruction: Guide user into the validation loop
            alert("SCENARIO E: Validation Case\n\nPlease enter a valid input.");
            startManualInput(); // Proceed to input process
            return;
    }
    execute(d, q);
}

/**
 * Core Execution and Logic Integration
 */
function execute(data, quantum) {
    const pRR = data.map(d => new Process(d.id, d.a, d.b));
    const pSRTF = data.map(d => new Process(d.id, d.a, d.b));

    const gRR = RoundRobin.schedule(pRR, quantum);
    const gSRTF = SRTF.schedule(pSRTF);

    const mRR = new SchedulerMetrics(pRR);
    const mSRTF = new SchedulerMetrics(pSRTF);

    renderResult('rr', gRR, mRR, pRR);
    renderResult('srtf', gSRTF, mSRTF, pSRTF);
    
    // Academic Analysis Updates
    const wBest = mSRTF.getAverageWaitingTime() < mRR.getAverageWaitingTime() ? "SRTF" : "Round Robin";
    const rBest = mRR.getAverageResponseTime() < mSRTF.getAverageResponseTime() ? "Round Robin" : "SRTF";
    
    document.getElementById('ans-wt').innerText = `${wBest} yielded lower average waiting time.`;
    document.getElementById('ans-rt').innerText = `${rBest} yielded lower average response time.`;
    document.getElementById('ans-q').innerText = `Quantum of ${quantum} resulted in an average RR response time of ${mRR.getAverageResponseTime().toFixed(2)}ms.`;
    document.getElementById('ans-rec').innerText = `Recommendation: Use ${wBest} for efficiency or RR for fairness.`;
    
    document.getElementById('concl-metrics').innerText = `Metric Comparison: SRTF (WT: ${mSRTF.getAverageWaitingTime().toFixed(2)}) vs RR (WT: ${mRR.getAverageWaitingTime().toFixed(2)}).`;
    document.getElementById('concl-quantum').innerText = `Quantum Observation: The choice of ${quantum} dictates the balance between context switching and process progress.`;
}

/**
 * Renders the results to the dashboard
 */
function renderResult(id, gantt, metrics, procs) {
    const buildF = (arr, getter) => `(${arr.map(p => p[getter]()).join('+')}) / ${arr.length}`;
    
    document.getElementById(`${id}-metrics`).innerHTML = `
        <div class="metric-card">
            <label>Avg Waiting Time</label>
            <div class="val">${metrics.getAverageWaitingTime().toFixed(2)}ms</div>
            <div class="formula">Σ WT / n = ${buildF(procs, 'getWaitingTime')}</div>
        </div>
        <div class="metric-card">
            <label>Avg Turnaround</label>
            <div class="val">${metrics.getAverageTurnaroundTime().toFixed(2)}ms</div>
            <div class="formula">Σ TAT / n = ${buildF(procs, 'getTurnaroundTime')}</div>
        </div>
        <div class="metric-card">
            <label>Avg Response</label>
            <div class="val">${metrics.getAverageResponseTime().toFixed(2)}ms</div>
            <div class="formula">Σ RT / n = ${buildF(procs, 'getResponseTime')}</div>
        </div>
    `;

    document.querySelector(`#${id}-table tbody`).innerHTML = procs.map(p => 
        `<tr><td>${p.getPID()}</td><td>${p.getArrivalTime()}</td><td>${p.getBurstTime()}</td>
        <td>${p.getWaitingTime()}</td><td>${p.getTurnaroundTime()}</td><td>${p.getResponseTime()}</td></tr>`
    ).join('');

    const track = document.getElementById(`${id}-gantt`);
    const ticks = document.getElementById(`${id}-ticks`);
    track.innerHTML = ''; ticks.innerHTML = '';

    gantt.forEach((entry, idx) => {
        if (entry.getPid() === -1) return;
        const dur = entry.getEndTime() - entry.getStartTime();
        
        const block = document.createElement('div');
        block.className = 'g-block';
        block.style.flex = dur;
        block.style.backgroundColor = getDarkColor(entry.getPid());
        block.innerText = entry.getPid();
        track.appendChild(block);

        const tick = document.createElement('div');
        tick.className = 'g-tick';
        tick.style.flex = dur;
        tick.innerHTML = `<span>${entry.getStartTime()}</span>`;
        ticks.appendChild(tick);

        if (idx === gantt.length - 1) {
            const end = document.createElement('span');
            end.className = 'final-tick';
            end.innerText = entry.getEndTime();
            tick.appendChild(end);
        }
    });

    if (id === 'rr') {
        document.getElementById('rr-queue').innerHTML = [...new Set(gantt.map(e => e.getPid()))]
            .filter(p => p !== -1)
            .map(p => `<span class="q-node" style="background:${getDarkColor(p)}">${p}</span>`)
            .join('<span class="q-arrow">→</span>');
    }
}

/**
 * Utility: Generates a consistent dark color for PIDs
 */
function getDarkColor(pid) {
    const palette = ['#1e293b', '#334155', '#475569', '#0f172a', '#1e1b4b', '#312e81'];
    const n = parseInt(pid.toString().replace(/\D/g, '')) || 0;
    return palette[n % palette.length];
}