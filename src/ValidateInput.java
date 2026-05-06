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
                System.out.println("Erorr: Invalid input.\n please try again.");
                input.next();
            }
        }
        return value;
    }
    public static int setValidArrivalTime(int PID){
        return getInt("Please enter the arrival time for process "+PID+": ",0,Integer.MAX_VALUE);
    }
    public static int setValidBurstTime(int PID){
        return getInt("Please enter the burst time for process "+PID+": ",1,Integer.MAX_VALUE);
    }
    public static int setValidAlgorithmChoice(int PID){
        return getInt("Please enter the algorithm choice"+PID,0,1);
    }
    /*
    * Wesal should here put validation method for time quantum,


    * validation method for number of process
      and (check it's max number of process with team)


    * last put run again this simulation after finishing
       like do you want to run it again if it is yes run another simulation again else exit program
      (if it's logic needed from the team)*/
}
