public class Process {
    private int PID;
    private int arrivalTime;
    private int burstTime;
    private int remainingTime;
    private int waitingTime;
    private int turnaroundTime;
    private int completionTime;
    private int responseTime;
    private boolean completed;
    private boolean isStarted;

    public Process(int PID, int arrivalTime, int burstTime) {
        this.PID = PID;
        this.arrivalTime = arrivalTime; 
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.responseTime = -1;
        this.isStarted = false;
        this.completed = false;
    }

    public int getPID() {
        return PID;
    }

    public int getArrivalTime() {
        return arrivalTime;
    }

    public int getBurstTime() {
        return burstTime;
    }

    public int getRemainingTime() {
        return remainingTime;
    }

    public int getWaitingTime() {
        return waitingTime;
    }

    public int getTurnaroundTime() {
        return turnaroundTime;
    }

    public int getCompletionTime() {
        return completionTime;
    }

    public int getResponseTime() {
        return responseTime;
    }

    public boolean isCompleted() {
        return completed;
    }

    public boolean isStarted() {
        return isStarted;
    }

    public void setRemainingTime(int remainingTime) {
        this.remainingTime = remainingTime;
    }

    public void setWaitingTime(int waitingTime) {
        this.waitingTime = waitingTime;
    }

    public void setTurnaroundTime(int turnaroundTime) {
        this.turnaroundTime = turnaroundTime;
    }

    public void setCompletionTime(int completionTime) {
        this.completionTime = completionTime;
    }

    public void setResponseTime(int responseTime) {
        this.responseTime = responseTime;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public void setStarted(boolean started) {
        this.isStarted = started;
    }
}