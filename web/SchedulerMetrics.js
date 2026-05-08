class SchedulerMetrics {

    constructor(processes) {
        this.averageWaitingTime = 0;
        this.averageTurnaroundTime = 0;
        this.averageResponseTime = 0;
        
        this.calculate(processes);
    }

    calculate(processes) {
        let totalWaitingTime      = 0;
        let totalTurnaroundTime   = 0;
        let totalResponseTime     = 0;
        let n = processes.length;

        for (let p of processes) {
            totalWaitingTime    += p.getWaitingTime();
            totalTurnaroundTime += p.getTurnaroundTime();
            totalResponseTime   += p.getResponseTime();
        }

        this.averageWaitingTime    = totalWaitingTime    / n;
        this.averageTurnaroundTime = totalTurnaroundTime / n;
        this.averageResponseTime   = totalResponseTime   / n;
    }

    getAverageWaitingTime() {
        return this.averageWaitingTime;
    }

    getAverageTurnaroundTime() {
        return this.averageTurnaroundTime;
    }

    getAverageResponseTime() {
        return this.averageResponseTime;
    }
}