import java.util.*;
import java.io.*;
public class SRTF {
    public static List<int[]> schedule(List<Process> processes) {
        List<int[]> gantt = new ArrayList<>();
        int currentTime = 0;
        int completed_processes = 0;
        int size = processes.size();
        /*
         * if Wesal need to add any variables here to help here in mathematical calc
         * */
        boolean[] inQueue = new boolean[size];
        Comparator<Process> strfRule = (p1,p2) -> {
            if(p1.getRemainingTime() == p2.getRemainingTime())
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
               currentTime++;
               continue;
           }
           /*
           here wesal should do the calculations of the
           1-response time
           2- context switching
           and record them
           */
             currentProcess.setRemainingTime(currentProcess.getRemainingTime()-1);
             currentTime++;
             if (currentProcess.getRemainingTime() == 0){
            completed_processes++;
            currentProcess.setCompleted(true);
            /*
            Wesal should calculate
            1- completion time
            2- turnover time
            3- waiting time
             */
            }
             else{
                 readyQueue.add(currentProcess);
             }
        //here should put previous process to remember it for next iteration
        }
        /*
          Wesal should add all process to gannt chart here to return it to the SRTF class for main
          to calculate the algorithm to compare it with RR
         */
        return gantt;
        /*
            Wesal should revise the entire code that all functionality works good of me and here
            if the logic algo works right or there something should be edited before design UI
         */
    }
}
