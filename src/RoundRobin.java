import java.util.*;

public class RoundRobin {
    public static List<GanttEntry> schedule(List<Process> processes, int quantum) {
        // Gantt chart: each entry is [processIndex, startTime, endTime]
        List<GanttEntry> gantt = new ArrayList<>();

        // We sort processes by arrival time first
        processes.sort(Comparator.comparingInt(p -> p.getArrivalTime()));

        Queue<Integer> readyQueue = new LinkedList<>(); // stores process indexes
        int currentTime = 0;
        int completed = 0;
        int n = processes.size();
        boolean[] inQueue = new boolean[n]; // to avoid adding same process twice

        // Add first process if it arrives at time 0
        for (int i = 0; i < n; i++) {
            if (processes.get(i).getArrivalTime() == 0) {
                readyQueue.add(i);
                inQueue[i] = true;
            }
        }

        // If no process at time 0, jump to first arrival
        if (readyQueue.isEmpty()) {
            currentTime = processes.get(0).getArrivalTime();
            readyQueue.add(0);
            inQueue[0] = true;
        }

        while (completed < n) {
            // If queue is empty, jump time to next arrival
            if (readyQueue.isEmpty()) {
                for (int i = 0; i < n; i++) {
                    if (!inQueue[i] && processes.get(i).getRemainingTime() > 0) {
                        currentTime = processes.get(i).getArrivalTime();
                        readyQueue.add(i);
                        inQueue[i] = true;
                        break;
                    }
                }
            }

            int frontIndex = readyQueue.poll(); // take process from front of queue
            Process currentProcess = processes.get(frontIndex);

            // Record response time (first time getting CPU)
            if (!currentProcess.isStarted()) {
                currentProcess.setResponseTime(currentTime - currentProcess.getArrivalTime()); // RT = firstCPUTime - AT
                currentProcess.setStarted(true);
            }

            // How long will this process run?
            int runTime = Math.min(quantum, currentProcess.getRemainingTime());
            int startTime = currentTime;
            int endTime = currentTime + runTime;

            // Add to Gantt chart
            gantt.add(new GanttEntry(
                    currentProcess.getPID(),
                    startTime,
                    endTime
            ));

            // Update time and remaining burst
            currentTime = endTime;
            currentProcess.setRemainingTime(currentProcess.getRemainingTime() - runTime);

            // Add newly arrived processes to queue (arrived during this slice)
            for (int i = 0; i < n; i++) {
                if (!inQueue[i] &&
                        processes.get(i).getArrivalTime() <= currentTime &&
                        processes.get(i).getRemainingTime() > 0) {
                    readyQueue.add(i);
                    inQueue[i] = true;
                }
            }

            // If process still has remaining time → goes back to end of queue
            if (currentProcess.getRemainingTime() > 0) {
                readyQueue.add(frontIndex);
            } else {
                // Process is done!
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