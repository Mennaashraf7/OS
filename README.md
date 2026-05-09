# CPU Scheduler Analysis — Round Robin vs SRTF
 
> 
> A web-based simulator and analyser that compares Round Robin (RR) and Shortest Remaining Time First (SRTF) CPU scheduling algorithms, built as a team project for an Operating Systems course.
 
---
 
## Overview
 
This project implements and compares two CPU scheduling algorithms:
 
| Algorithm | Strategy | Key Trait |
|---|---|---|
| **Round Robin (RR)** | Time-slicing with a user-defined quantum | Fairness-oriented |
| **SRTF** | Always runs the process with least remaining time | Efficiency-oriented |
 
The simulator accepts dynamic process input, runs both algorithms simultaneously, renders side-by-side Gantt charts, calculates all scheduling metrics, and produces a dynamic academic analysis and conclusion — all in the browser with no backend server required.
 
---
 
## Features
 
- **Dynamic process input** — enter any number of processes at runtime with unique PID validation
- **Time quantum input** with full validation — rejects invalid values and guides the user
- **Dual Gantt chart rendering** — one for RR, one for SRTF, rendered proportionally
- **Ready Queue visualisation** for Round Robin showing execution order
- **Per-process metrics table** — WT, TAT, RT for every process
- **Average metrics** with formula breakdown (Σ WT / n shown explicitly)
- **Dynamic analysis section** — tie-aware, updates on every run based on actual results
- **Dynamic conclusion section** — fairness, efficiency, and quantum effect assessed per run
- **5 predefined test scenarios** covering mixed workloads, quantum sensitivity, short-job-heavy, interactive fairness, and input validation
- **Input validation** with descriptive error messages for all fields
---
 
## Project Structure
 
```
OS/
├── src/                        # Java source files (design/planning phase)
│   ├── Process.java            # Process model with all scheduling fields
│   ├── RoundRobin.java         # RR scheduling logic
│   ├── SRTF.java               # SRTF scheduling logic
│   ├── GanttEntry.java         # Gantt chart entry model
│   ├── SchedulerMetrics.java   # Average WT, TAT, RT calculator
│   ├── ValidateInput.java      # Input validation logic
│   └── Main.java               # Entry point for Java testing
│
└── web/                        # Live browser application
    ├── index.html              # Full UI structure
    ├── style.css               # Styling and layout
    ├── Process.js              # JS port of Process model
    ├── RoundRobin.js           # JS port of RR algorithm
    ├── SRTF.js                 # JS port of SRTF algorithm
    ├── GanttEntry.js           # JS port of GanttEntry model
    ├── SchedulerMetrics.js     # JS port of metrics calculator
    ├── ValidateInput.js        # JS port of input validation
    └── ui.js                   # UI bridge, rendering, and analysis logic
```
 
---
 
## How to Run
 
No installation or server required.
 
1. Clone the repository:
```bash
git clone https://github.com/Mennaashraf7/OS.git
```
 
2. Open the web application:
```
OS/web/index.html
```
Open this file directly in any modern browser (Chrome, Firefox, Edge).
 
That is it. The entire application runs client-side.
 
---
 
## How to Use
 
**Manual input:**
1. Click **Run Simulation**
2. Enter the number of processes
3. For each process enter a unique PID, arrival time, and burst time
4. Enter a time quantum for Round Robin
5. Both Gantt charts and all metrics render instantly
**Predefined scenarios:**
 
| Scenario | Description | Purpose |
|---|---|---|
| A | Mixed workload — varied burst and arrival times | General comparison |
| B | Quantum sensitivity — small quantum on long jobs | Shows quantum effect |
| C | Short-job-heavy — many processes with burst = 1 | SRTF advantage visible |
| D | Equal burst times — all processes same length | RR fairness advantage |
| E | Validation case — guided invalid input entry | Demonstrates validation |
 
---
 
## Algorithms
 
### Round Robin (RR)
- Each process gets a fixed CPU slice of size `q` (the time quantum)
- After `q` units, the process is preempted and moved to the back of the ready queue
- Guarantees every process waits at most `(n-1) × q` before its next turn
- Best for interactive systems where response time matters
### SRTF (Shortest Remaining Time First)
- At every clock tick, the process with the least remaining burst time runs
- If a newly arrived process has less remaining time than the current process, it immediately preempts it
- Provably optimal for minimising average waiting time
- Best for batch systems where throughput matters
---
 
## Metrics Calculated
 
| Metric | Formula |
|---|---|
| Completion Time (CT) | Time when process finishes |
| Turnaround Time (TAT) | CT − Arrival Time |
| Waiting Time (WT) | TAT − Burst Time |
| Response Time (RT) | First CPU time − Arrival Time |
| Avg WT | Σ WT / n |
| Avg TAT | Σ TAT / n |
| Avg RT | Σ RT / n |
 
---
 
## Team
 
 
|  | Task |
|---|---|
| Mennatallah Ashraf & Menna Ahmed| Round Robin algorithm (Java + JS) |
| Ammar Yasser & Wessal Gamal| SRTF algorithm (Java + JS) |
| Youssef Noshy & Maher Ahmed | UI, rendering, analysis, and integration |
 
 
---
 
## Implementation Notes
 
- The Java source files served as the design and logic planning phase. The JavaScript files in `web/` are direct ports of the Java classes and constitute the actual running implementation.
- `SchedulerMetrics` is shared between both algorithms — it accepts any completed process list and computes averages from the populated metric fields.
- The analysis and conclusion sections are fully dynamic — they compare actual computed values on every run and correctly report ties when both algorithms produce equal results.
- A `PriorityQueue` (min-heap by remaining time) is used for SRTF. A `LinkedList`-based FIFO queue is used for Round Robin, storing process indexes to support re-queuing without object duplication.
