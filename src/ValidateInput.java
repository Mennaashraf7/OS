import java.util.*;
public class ValidateInput {
    private static Scanner input = new Scanner(System.in);
    private static int getInt(String question,int min, int max){
        int value =0;
        boolean flag = true;
        while(flag){
            System.out.print(question);
            try {
                value = input.nextInt();
                if(value >= min && value <= max){
                    flag = false;
                }else {
                    System.out.println("Please enter a number between "+min+" and "+max);
                }
            }catch(InputMismatchException e){
                System.out.println("Error: Invalid input.\n please try again.");
                input.next();
            }
        }
        return value;
    }

    // Arrival time
    public static int setValidArrivalTime(int PID){
        return getInt("Please enter the arrival time for process "+PID+": ",0,Integer.MAX_VALUE);
    }

    // Burst time
    public static int setValidBurstTime(int PID){
        return getInt("Please enter the burst time for process "+PID+": ",1,Integer.MAX_VALUE);
    }

    // Algorithm choice
    public static int setValidAlgorithmChoice() {
        return getInt("Please enter the algorithm choice: (0 for Round Robin, 1 for SRTF): ", 0, 1);
    }

    // Time Quantum — only for Round Robin
    public static int setValidTimeQuantum() {
        return getInt("Please enter the time quantum: ", 1, 100);  //the max number here may change later
    }

    //Number of processes
    public static int setValidNumberOfProcesses() {
        return getInt("Please enter the number of processes: ", 1, 100);
    }

    //Run again
    public static boolean runAgain() {
        System.out.println("Do you want to run another simulation? (1 = Yes | 0 = No): ");
        return getInt("", 0, 1) == 1;
    }
      
}
