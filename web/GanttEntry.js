class GanttEntry {
    pid;
    startTime;
    endTime;

    constructor(pid, startTime, endTime) {
        this.pid = pid;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    getPid() {
        return this.pid;
    }

    getStartTime() {
        return this.startTime;
    }

    getEndTime() {
        return this.endTime;
    }
}