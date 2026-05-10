class RoundRobin {
    static schedule(processes, quantum) {
        // Gantt chart: each entry is [processIndex, startTime, endTime]
        let gantt = [];

        // We sort processes by arrival time first
        processes.sort((p1, p2) => p1.getArrivalTime() - p2.getArrivalTime());

        let readyQueue = []; // stores process indexes
        let currentTime = 0;
        let completed = 0;
        let n = processes.length;
        let inQueue = new Array(n).fill(false); // to avoid adding same process twice

        // Add first process if it arrives at time 0
        for (let i = 0; i < n; i++) {
            if (processes[i].getArrivalTime() === 0) {
                readyQueue.push(i);
                inQueue[i] = true;
            }
        }

        // If no process at time 0, jump to first arrival
        if (readyQueue.length === 0) {
            currentTime = processes[0].getArrivalTime();
            readyQueue.push(0);
            inQueue[0] = true;
        }

        while (completed < n) {
            // If queue is empty, jump time to next arrival
            if (readyQueue.length === 0) {
                for (let i = 0; i < n; i++) {
                    if (!inQueue[i] && processes[i].getRemainingTime() > 0) {
                        currentTime = processes[i].getArrivalTime();
                        readyQueue.push(i);
                        inQueue[i] = true;
                        break;
                    }
                }
            }

            let frontIndex = readyQueue.shift(); // take process from front of queue
            let currentProcess = processes[frontIndex];

            // Record response time (first time getting CPU)
            if (!currentProcess.isStarted()) {
                currentProcess.setResponseTime(currentTime - currentProcess.getArrivalTime()); // RT = firstCPUTime - AT
                currentProcess.setStarted(true);
            }

            // How long will this process run?
            let runTime = Math.min(quantum, currentProcess.getRemainingTime());
            let startTime = currentTime;
            let endTime = currentTime + runTime;

            // Add to Gantt chart
            gantt.push(new GanttEntry(
                    currentProcess.getPID(),
                    startTime,
                    endTime
            ));

            currentTime = endTime;
            currentProcess.setRemainingTime(currentProcess.getRemainingTime() - runTime);

            // Add newly arrived processes to queue (arrived during this slice)
            for (let i = 0; i < n; i++) {
                if (!inQueue[i] &&
                        processes[i].getArrivalTime() <= currentTime &&
                        processes[i].getRemainingTime() > 0) {
                    readyQueue.push(i);
                    inQueue[i] = true;
                }
            }

            // If process still has remaining time goes back to end of queue
            if (currentProcess.getRemainingTime() > 0) {
                readyQueue.push(frontIndex);
            } else {
            
                currentProcess.setCompletionTime(currentTime);
                currentProcess.setTurnaroundTime(currentProcess.getCompletionTime() - currentProcess.getArrivalTime());
                currentProcess.setWaitingTime(currentProcess.getTurnaroundTime() - currentProcess.getBurstTime());
                currentProcess.setCompleted(true);
                completed++;
            }
        }
        return gantt;
    }
}