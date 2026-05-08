class SRTF {
    static schedule(processes) {
        let gantt = [];

        let currentTime = 0;
        let completed_processes = 0;
        let size = processes.length;
        let inQueue = new Array(size).fill(false);

        let previousProcess = null;
        let blockStartTime = 0;

        // Priority rule
        let srtfRule = (p1, p2) => {
            if (p1.getRemainingTime() === p2.getRemainingTime())
                return p1.getArrivalTime() - p2.getArrivalTime();
            else
                return p1.getRemainingTime() - p2.getRemainingTime();
        };
        let readyQueue = new PriorityQueue(srtfRule);

        while (completed_processes < size) {

            // Add newly arrived processes
            for (let i = 0; i < size; i++) {
                let process = processes[i];
                if (!inQueue[i] && process.getArrivalTime() <= currentTime && !process.isCompleted()) {
                    readyQueue.add(process);
                    inQueue[i] = true;
                }
            }

            let currentProcess = readyQueue.poll();

            // Idle CPU
            if (currentProcess === null) {
                gantt.push(new GanttEntry(-1, currentTime, currentTime + 1));
                currentTime++;
                continue;
            }

            // Response Time — first time process gets CPU
            if (!currentProcess.isStarted()) {
                currentProcess.setResponseTime(currentTime - currentProcess.getArrivalTime());
                currentProcess.setStarted(true);
            }

            // blockStartTime is saved BEFORE currentTime increments
            // flush previous block BEFORE starting new one
            if (previousProcess === null || previousProcess.getPID() !== currentProcess.getPID()) {
                if (previousProcess !== null) {
                    //flush previous block using currentTime BEFORE it increments
                    gantt.push(new GanttEntry(previousProcess.getPID(), blockStartTime, currentTime));
                }
                //save new block start BEFORE currentTime increments
                blockStartTime = currentTime;
            }

            // EXECUTE PROCESS FOR 1 TIME UNIT
            currentProcess.setRemainingTime(currentProcess.getRemainingTime() - 1);
            currentTime++;

            if (currentProcess.getRemainingTime() === 0) {
                completed_processes++;
                currentProcess.setCompleted(true);

                currentProcess.setCompletionTime(currentTime); // COMPLETION TIME
                currentProcess.setTurnaroundTime(currentTime - currentProcess.getArrivalTime());  // TURNAROUND TIME
                currentProcess.setWaitingTime(
                    currentProcess.getTurnaroundTime() - currentProcess.getBurstTime()
                ); // WAITING TIME

                // final execution block
                gantt.push(new GanttEntry(currentProcess.getPID(), blockStartTime, currentTime));
                previousProcess = null;

            } else {
                readyQueue.add(currentProcess);
                previousProcess = currentProcess;
            }
        }

        return gantt;
    }
}