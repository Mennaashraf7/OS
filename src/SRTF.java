import java.util.*;

public class SRTF {

    public static List<GanttEntry> schedule(List<Process> processes) {

        List<GanttEntry> gantt = new ArrayList<>();

        int currentTime = 0;
        int completed_processes = 0;
        int size = processes.size();

        boolean[] inQueue = new boolean[size]; // CHANGED (was visited)

        Process previousProcess = null;

        Comparator<Process> srtfRule = (p1, p2) -> {
            if (p1.getRemainingTime() == p2.getRemainingTime())
                return Integer.compare(p1.getArrivalTime(), p2.getArrivalTime());
            else
                return Integer.compare(p1.getRemainingTime(), p2.getRemainingTime());
        };

        Queue<Process> readyQueue = new PriorityQueue<>(srtfRule);

        int blockStartTime = 0;

        while (completed_processes < size) {

            // SAME STRUCTURE AS BEFORE, JUST USING inQueue
            for (int i = 0; i < size; i++) {

                Process process = processes.get(i);

                if (!inQueue[i]
                        && process.getArrivalTime() <= currentTime
                        && !process.isCompleted()) {

                    readyQueue.add(process);
                    inQueue[i] = true; // CHANGED ONLY HERE
                }
            }

            Process currentProcess = readyQueue.poll();

            if (currentProcess == null) {

                gantt.add(new GanttEntry(-1, currentTime, currentTime + 1));
                currentTime++;
                continue;
            }

            // RESPONSE TIME
            if (!currentProcess.isStarted()) {
                currentProcess.setResponseTime(
                        currentTime - currentProcess.getArrivalTime()
                );
                currentProcess.setStarted(true);
            }

            // START NEW BLOCK IF CONTEXT SWITCH
            if (previousProcess == null ||
                    previousProcess.getPID() != currentProcess.getPID()) {

                blockStartTime = currentTime;
            }

            // EXECUTE 1 UNIT
            currentProcess.setRemainingTime(
                    currentProcess.getRemainingTime() - 1
            );
            currentTime++;

            // COMPLETION
            if (currentProcess.getRemainingTime() == 0) {

                completed_processes++;
                currentProcess.setCompleted(true);

                currentProcess.setCompletionTime(currentTime);
                currentProcess.setTurnaroundTime(
                        currentTime - currentProcess.getArrivalTime()
                );
                currentProcess.setWaitingTime(
                        currentProcess.getTurnaroundTime()
                                - currentProcess.getBurstTime()
                );

                gantt.add(new GanttEntry(
                        currentProcess.getPID(),
                        blockStartTime,
                        currentTime
                ));

                previousProcess = null;

            } else {

                readyQueue.add(currentProcess);

                if (previousProcess != null &&
                        previousProcess.getPID() != currentProcess.getPID()) {

                    gantt.add(new GanttEntry(
                            previousProcess.getPID(),
                            blockStartTime,
                            currentTime
                    ));
                }

                previousProcess = currentProcess;
            }
        }

        return gantt;
    }
}