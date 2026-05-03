import java.util.*;

public class SchedulerMetrics {

    private double averageWaitingTime;
    private double averageTurnaroundTime;
    private double averageResponseTime;

    public SchedulerMetrics(List<Process> processes) {
        calculate(processes);
    }

    private void calculate(List<Process> processes) {
        double totalWaitingTime      = 0;
        double totalTurnaroundTime   = 0;
        double totalResponseTime     = 0;
        int n = processes.size();

        for (Process p : processes) {
            totalWaitingTime    += p.getWaitingTime();
            totalTurnaroundTime += p.getTurnaroundTime();
            totalResponseTime   += p.getResponseTime();
        }

        this.averageWaitingTime    = totalWaitingTime    / n;
        this.averageTurnaroundTime = totalTurnaroundTime / n;
        this.averageResponseTime   = totalResponseTime   / n;
    }

    public double getAverageWaitingTime() {
        return averageWaitingTime;
    }

    public double getAverageTurnaroundTime() {
        return averageTurnaroundTime;
    }

    public double getAverageResponseTime() {
        return averageResponseTime;
    }
}