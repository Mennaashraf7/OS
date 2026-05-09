class ValidateInput {
    static getInt(question, min, max) {
        let value = 0;
        let flag = true;
        while (flag) {
            // prompt() displays the question and blocks for input (matches Scanner behavior in browsers)
            let inputStr = prompt(question);
            // Handle user closing/canceling the prompt dialog
            if (inputStr === null) {
                console.log("Error: Invalid input.\n please try again.");
                continue;
            }
            try {
                // Simulate Java's nextInt() parsing & InputMismatchException
                let parsed = parseInt(inputStr, 10);
                if (isNaN(parsed) || inputStr.trim() === "") {
                    throw new Error("InputMismatchException");
                }
                value = parsed;
                if (value >= min && value <= max) {
                    flag = false;
                } else {
                    console.log("Please enter a number between " + min + " and " + max);
                }
            } catch (e) {
                console.log("Error: Invalid input.\n please try again.");
            }
        }
        return value;
    }
// أضف هذه الدالة داخل كلاس ValidateInput
    static setUniquePID(existingData) {
        while (true) {
            let pid = prompt("Please enter a unique PID (e.g., P1, 101):");
            if (pid === null) throw "EXIT_PROCESS";
            
            pid = pid.trim();
            if (pid === "") pid = "P" + (existingData.length + 1);
            let isDuplicate = existingData.some(item => String(item.id) === String(pid));
            
            if (!isDuplicate) return pid;
            
            alert(`Error: The PID "${pid}" is already taken. Please enter a unique ID.`);
        }
    }
    // Arrival time
    static setValidArrivalTime(PID) {
        return this.getInt("Please enter the arrival time for process " + PID + ": ", 0, 10e9);
    }

    // Burst time
    static setValidBurstTime(PID) {
        return this.getInt("Please enter the burst time for process " + PID + ": ", 1, 10e9);
    }

    // Algorithm choice
    static setValidAlgorithmChoice() {
        return this.getInt("Please enter the algorithm choice: (0 for Round Robin, 1 for SRTF): ", 0, 1);
    }

    // Time Quantum — only for Round Robin
    static setValidTimeQuantum() {
        return this.getInt("Please enter the time quantum: ", 1, 100);  //the max number here may change later
    }

    //Number of processes
    static setValidNumberOfProcesses() {
        return this.getInt("Please enter the number of processes: ", 1, 100);
    }

    //Run again
    static runAgain() {
        console.log("Do you want to run another simulation? (1 = Yes | 0 = No): ");
        return this.getInt("", 0, 1) === 1;
    }
}