import java.util.*;
import java.io.*;
public class SRTF {
    public static List<int[]> schedule(List<Process> processes) {
        List<int[]> gantt = new ArrayList<>();
        int currentTime = 0;
        int completed_processes = 0;
        int size = processes.size();
        Process previousProcess = null;
        boolean[] inQueue = new boolean[size]; 

        Comparator<Process> strfRule = (p1, p2) -> {
            if (p1.getRemainingTime() == p2.getRemainingTime())
                return Integer.compare(p1.getArrivalTime(), p2.getArrivalTime());
            else
                return Integer.compare(p1.getRemainingTime(), p2.getRemainingTime());
        };

        Queue<Process> readyQueue = new PriorityQueue<>(strfRule);

        while (completed_processes < size) {
            for (int i = 0; i < size; i++) {
                Process process = processes.get(i);
                if (!inQueue[i] && process.getArrivalTime() <= currentTime && !process.isCompleted()) {
                    readyQueue.add(process);
                    inQueue[i] = true; 
                }
            }

            Process currentProcess = readyQueue.poll();

            if (currentProcess == null) {

            // EDITED: Add idle period to Gantt chart

            if (gantt.isEmpty()
                || gantt.get(gantt.size() - 1)[0] != -2) {

                gantt.add(new int[]{-2, currentTime});
            }

            // END OF EDIT

            currentTime++;

            continue;
        }

            // Response Time
            if (!currentProcess.isStarted()) {
                currentProcess.setResponseTime(currentTime - currentProcess.getArrivalTime());
                currentProcess.setStarted(true);
            }

            // Gantt Chart + Context Switching
            if (previousProcess == null || previousProcess.getPID() != currentProcess.getPID()) {
                gantt.add(new int[]{currentProcess.getPID(), currentTime});
            }

            currentProcess.setRemainingTime(currentProcess.getRemainingTime() - 1);
            currentTime++;

            // Completion Time, Turnaround Time, Waiting Time
            if (currentProcess.getRemainingTime() == 0) {
                completed_processes++;
                currentProcess.setCompleted(true);
                currentProcess.setCompletionTime(currentTime);
                currentProcess.setTurnaroundTime(currentTime - currentProcess.getArrivalTime());
                currentProcess.setWaitingTime(
                    currentProcess.getTurnaroundTime() - currentProcess.getBurstTime()
                );
            } else {
                readyQueue.add(currentProcess); 
            }

            previousProcess = currentProcess;
        }

        gantt.add(new int[]{-1, currentTime});
        return gantt;
    }
}