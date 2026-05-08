class Process {
    constructor(PID, arrivalTime, burstTime) {
        this.PID = PID;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.completionTime = 0;
        this.responseTime = -1;
        this.completed = false;
        this.isStarted = false;
    }

    getPID() {
        return this.PID;
    }

    getArrivalTime() {
        return this.arrivalTime;
    }

    getBurstTime() {
        return this.burstTime;
    }

    getRemainingTime() {
        return this.remainingTime;
    }

    getWaitingTime() {
        return this.waitingTime;
    }

    getTurnaroundTime() {
        return this.turnaroundTime;
    }

    getCompletionTime() {
        return this.completionTime;
    }

    getResponseTime() {
        return this.responseTime;
    }

    isCompleted() {
        return this.completed;
    }

    isStarted() {
        return this.isStarted;
    }

    setRemainingTime(remainingTime) {
        this.remainingTime = remainingTime;
    }

    setWaitingTime(waitingTime) {
        this.waitingTime = waitingTime;
    }

    setTurnaroundTime(turnaroundTime) {
        this.turnaroundTime = turnaroundTime;
    }

    setCompletionTime(completionTime) {
        this.completionTime = completionTime;
    }

    setResponseTime(responseTime) {
        this.responseTime = responseTime;
    }

    setCompleted(completed) {
        this.completed = completed;
    }

    setStarted(started) {
        this.isStarted = started;
    }
}