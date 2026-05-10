
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

ValidateInput.setUniquePID = function(existingData) {
    while (true) {
        let pid = prompt("Please enter a unique PID (e.g., P1, 101):");
        if (pid === null) throw "EXIT_PROCESS";
        
        pid = pid.trim();
        if (pid === "") pid = "P" + (existingData.length + 1);

        let isDuplicate = existingData.some(item => String(item.id) === String(pid));

        if (!isDuplicate) return pid;

        alert(`Error: The PID "${pid}" is already taken. Please enter a unique ID.`);
    }
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

 
function startManualInput() {
    try {
        const n = ValidateInput.setValidNumberOfProcesses();
        const data = [];
        for (let i = 0; i < n; i++) {
            const pid = ValidateInput.setUniquePID(data);
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


function runScenario(type) {
    let d = [], q = 2;
    switch (type) {
      case "A":
  d = [
    {id:"P1", a:0, b:8},
    {id:"P2", a:1, b:4},
    {id:"P3", a:2, b:9},
    {id:"P4", a:3, b:5}
  ];
  q = 3;
  break;

case "B":
  d = [
    {id:"P1", a:0, b:10},
    {id:"P2", a:0, b:6},
    {id:"P3", a:0, b:2},
    {id:"P4", a:0, b:4}
  ];
  q = 2;
  break;

case "C":
  d = [
    {id:"P1", a:0, b:2},
    {id:"P2", a:1, b:1},
    {id:"P3", a:2, b:3},
    {id:"P4", a:3, b:1},
    {id:"P5", a:4, b:2}
  ];
  q = 2;
  break;

case "D":
  d = [
    {id:"P1", a:0, b:6},
    {id:"P2", a:0, b:6},
    {id:"P3", a:0, b:6},
    {id:"P4", a:0, b:6}
  ];
  q = 2;
  break;

case "E":
  alert("SCENARIO E: Validation Case\n\nPlease enter a valid input.");
  startManualInput();
  return;
            alert("SCENARIO E: Validation Case\n\nPlease enter a valid input.");
            startManualInput(); // Proceed to input process
            return;
    }
    execute(d, q);
}


function execute(data, quantum) {
    const pRR = data.map(d => new Process(d.id, d.a, d.b));
    const pSRTF = data.map(d => new Process(d.id, d.a, d.b));

    const gRR = RoundRobin.schedule(pRR, quantum);
    const gSRTF = SRTF.schedule(pSRTF);

    const mRR = new SchedulerMetrics(pRR);
    const mSRTF = new SchedulerMetrics(pSRTF);

    renderResult('rr', gRR, mRR, pRR,quantum);
    renderResult('srtf', gSRTF, mSRTF, pSRTF);

    const rrWT    = mRR.getAverageWaitingTime();
    const srtfWT  = mSRTF.getAverageWaitingTime();
    const rrRT    = mRR.getAverageResponseTime();
    const srtfRT  = mSRTF.getAverageResponseTime();
    const rrTAT   = mRR.getAverageTurnaroundTime();
    const srtfTAT = mSRTF.getAverageTurnaroundTime();


    let wBest;
    if (srtfWT < rrWT)       wBest = `SRTF (${srtfWT.toFixed(2)}ms) yielded lower average waiting time than Round Robin (${rrWT.toFixed(2)}ms).`;
    else if (rrWT < srtfWT)  wBest = `Round Robin (${rrWT.toFixed(2)}ms) yielded lower average waiting time than SRTF (${srtfWT.toFixed(2)}ms).`;
    else                     wBest = `Both algorithms tied on average waiting time (${rrWT.toFixed(2)}ms).`;

   
    let rBest;
    if (rrRT < srtfRT)       rBest = `Round Robin (${rrRT.toFixed(2)}ms) yielded lower average response time than SRTF (${srtfRT.toFixed(2)}ms).`;
    else if (srtfRT < rrRT)  rBest = `SRTF (${srtfRT.toFixed(2)}ms) yielded lower average response time than Round Robin (${rrRT.toFixed(2)}ms).`;
    else                     rBest = `Both algorithms tied on average response time (${rrRT.toFixed(2)}ms).`;

  
    let rec;
    if (srtfWT < rrWT && rrRT < srtfRT)
        rec = `Use SRTF for efficiency (lower WT: ${srtfWT.toFixed(2)}ms) or Round Robin for responsiveness (lower RT: ${rrRT.toFixed(2)}ms) — depends on workload priority.`;
    else if (srtfWT < rrWT)
        rec = `SRTF is recommended — it achieved lower waiting time (${srtfWT.toFixed(2)}ms vs ${rrWT.toFixed(2)}ms) and lower response time (${srtfRT.toFixed(2)}ms vs ${rrRT.toFixed(2)}ms) for this workload.`;
    else if (rrRT < srtfRT)
        rec = `Round Robin is recommended — it achieved better response time (${rrRT.toFixed(2)}ms vs ${srtfRT.toFixed(2)}ms), making it more suitable for interactive workloads.`;
    else
        rec = `Both algorithms performed equally on this workload (WT: ${rrWT.toFixed(2)}ms, RT: ${rrRT.toFixed(2)}ms). Either is suitable.`;

    // Quantum observation — based on actual RR TAT vs SRTF TAT
    let qObs;
    if (quantum <= 2)
        qObs = `Quantum of ${quantum} is very small — high context switching overhead, but RR response time was ${rrRT.toFixed(2)}ms. Smaller quanta improve fairness at the cost of efficiency.`;
    else if (rrTAT <= srtfTAT + 1)
        qObs = `Quantum of ${quantum} produced RR turnaround (${rrTAT.toFixed(2)}ms) close to SRTF (${srtfTAT.toFixed(2)}ms), suggesting the quantum was well-sized for this workload.`;
    else
        qObs = `Quantum of ${quantum} caused RR turnaround (${rrTAT.toFixed(2)}ms) to exceed SRTF (${srtfTAT.toFixed(2)}ms) by ${(rrTAT - srtfTAT).toFixed(2)}ms. A smaller quantum may improve responsiveness.`;

    document.getElementById('ans-wt').innerText  = wBest;
    document.getElementById('ans-rt').innerText  = rBest;
    document.getElementById('ans-q').innerText   = qObs;
    document.getElementById('ans-rec').innerText = rec;

    const tatWinner = srtfTAT < rrTAT ? `SRTF (${srtfTAT.toFixed(2)}ms)` : rrTAT < srtfTAT ? `Round Robin (${rrTAT.toFixed(2)}ms)` : `Both tied (${rrTAT.toFixed(2)}ms)`;

    document.getElementById('concl-metrics').innerText = `Metric Comparison — WT: SRTF ${srtfWT.toFixed(2)}ms vs RR ${rrWT.toFixed(2)}ms | TAT: SRTF ${srtfTAT.toFixed(2)}ms vs RR ${rrTAT.toFixed(2)}ms | RT: SRTF ${srtfRT.toFixed(2)}ms vs RR ${rrRT.toFixed(2)}ms. Best overall TAT: ${tatWinner}.`;

    document.getElementById('concl-fair').innerText = rrRT < srtfRT
        ? `Fairness: Round Robin appeared fairer — it gave all processes CPU access sooner, achieving an average response time of ${rrRT.toFixed(2)}ms vs SRTF's ${srtfRT.toFixed(2)}ms. Time-slicing prevented any single process from blocking others.`
        : `Fairness: Round Robin provided equal time slices to all processes. However, on this workload SRTF matched or outperformed it on response time (${srtfRT.toFixed(2)}ms vs ${rrRT.toFixed(2)}ms), suggesting the jobs were short enough that SRTF's preemption acted fairly as well.`;

    document.getElementById('concl-eff').innerText = srtfWT < rrWT
        ? `Efficiency: SRTF appeared more efficient — it minimised average waiting time (${srtfWT.toFixed(2)}ms vs RR's ${rrWT.toFixed(2)}ms) by always running the shortest remaining job, reducing total time processes spent idle in the queue.`
        : `Efficiency: On this workload both algorithms achieved similar waiting times (SRTF: ${srtfWT.toFixed(2)}ms, RR: ${rrWT.toFixed(2)}ms). This typically occurs when burst times are equal or processes arrive sequentially with no overlap.`;

    document.getElementById('concl-q-effect').innerText = `Quantum Effect: A quantum of ${quantum} gave RR an average response time of ${rrRT.toFixed(2)}ms and turnaround of ${rrTAT.toFixed(2)}ms. ${quantum <= 2 ? "Small quanta maximise fairness but increase context switching overhead." : quantum >= 10 ? "Large quanta reduce switching overhead but hurt fairness — RR approaches FCFS behaviour." : "This quantum balanced fairness and overhead reasonably for this workload."}`;
}


function renderResult(id, gantt, metrics, procs, quantum = null) {
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


        if (id === 'rr' && quantum !== null) {
             const label = document.getElementById('rr-gantt-label');
             if (label) label.innerHTML = `GANTT CHART TIMELINE <span style="
                 background: var(--slate-dim);
                 color: white;
                 font-size: 0.65rem;
                 font-weight: 700;
                 padding: 2px 8px;
                 border-radius: 999px;
                 margin-left: 8px;
                 letter-spacing: 0.05em;
             ">q = ${quantum}</span>`;
         }


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


function getDarkColor(pid) {
    const palette = ['#1e293b', '#334155', '#475569', '#0f172a', '#1e1b4b', '#312e81'];
    const n = parseInt(pid.toString().replace(/\D/g, '')) || 0;
    return palette[n % palette.length];
}