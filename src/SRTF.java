import java.util.*;

public class SRTF {
    public static List<GanttEntry> schedule(List<Process> processes) {
        List<GanttEntry> gantt = new ArrayList<>();

        int currentTime = 0;
        int completed_processes = 0;
        int size = processes.size();
        boolean[] inQueue = new boolean[size];

        Process previousProcess = null;
        int blockStartTime = 0;

        // Priority rule
        Comparator<Process> srtfRule = (p1, p2) -> {
            if (p1.getRemainingTime() == p2.getRemainingTime())
                return Integer.compare(p1.getArrivalTime(), p2.getArrivalTime());
            else
                return Integer.compare(p1.getRemainingTime(), p2.getRemainingTime());
        };
        Queue<Process> readyQueue = new PriorityQueue<>(srtfRule);

        while (completed_processes < size) {

            // Add newly arrived processes
            for (int i = 0; i < size; i++) {
                Process process = processes.get(i);
                if (!inQueue[i] && process.getArrivalTime() <= currentTime && !process.isCompleted()) {
                    readyQueue.add(process);
                    inQueue[i] = true;
                }
            }

            Process currentProcess = readyQueue.poll();

            // Idle CPU
            if (currentProcess == null) {
                gantt.add(new GanttEntry(-1, currentTime, currentTime + 1));
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
            if (previousProcess == null || previousProcess.getPID() != currentProcess.getPID()) {
                if (previousProcess != null) {
                    //flush previous block using currentTime BEFORE it increments
                    gantt.add(new GanttEntry(previousProcess.getPID(), blockStartTime, currentTime));
                }
                //save new block start BEFORE currentTime increments
                blockStartTime = currentTime;
            }

            // EXECUTE PROCESS FOR 1 TIME UNIT
            currentProcess.setRemainingTime(currentProcess.getRemainingTime() - 1);
            currentTime++;

            if (currentProcess.getRemainingTime() == 0) {
                completed_processes++;
                currentProcess.setCompleted(true);

                currentProcess.setCompletionTime(currentTime); // COMPLETION TIME
                currentProcess.setTurnaroundTime(currentTime - currentProcess.getArrivalTime());  // TURNAROUND TIME
                currentProcess.setWaitingTime(
                    currentProcess.getTurnaroundTime() - currentProcess.getBurstTime()
                ); // WAITING TIME

                // final execution block
                gantt.add(new GanttEntry(currentProcess.getPID(), blockStartTime, currentTime));
                previousProcess = null;

            } else {
                readyQueue.add(currentProcess);
                previousProcess = currentProcess;
            }
        }

        return gantt;
    }
}