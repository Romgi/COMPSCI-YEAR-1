import java.util.Scanner;

public class SixSeven {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner(System.in)) {
            System.out.print("Enter size of 67 grid: ");
            int size = sc.nextInt();
            for (int i = 0; i < size; i++){
                for (int j = 0; j < size; j++){
                    if (i == j || i + j == size - 1){
                        System.out.print("67");
                    } else if (j%2 == 0){ {
                        System.out.print("    67    ");
                    }
                    } else {
                        System.out.print("  67  ");
                    }
                }
                System.out.println();
            }

            System.out.println("How many 67s do you want? ");
            int num67s = sc.nextInt();

            for (int i = 0; i < num67s; i++){
            System.out.println("        6666666677777777777777777777");
            System.out.println("       6::::::6 7::::::::::::::::::7");
            System.out.println("      6::::::6  7::::::::::::::::::7");
            System.out.println("     6::::::6   777777777777:::::::7");
            System.out.println("    6::::::6               7::::::7 ");
            System.out.println("   6::::::6               7::::::7  ");
            System.out.println("  6::::::6               7::::::7   ");
            System.out.println(" 6::::::::66666         7::::::7    ");
            System.out.println("6::::::::::::::66      7::::::7     ");
            System.out.println("6::::::66666:::::6    7::::::7      ");
            System.out.println("6:::::6     6:::::6  7::::::7       ");
            System.out.println("6:::::6     6:::::6 7::::::7        ");
            System.out.println("6::::::66666::::::67::::::7         ");
            System.out.println(" 66:::::::::::::667::::::7          ");
            System.out.println("   66:::::::::66 7::::::7           ");
            System.out.println("     666666666  77777777            ");
            System.out.println(" ");
            System.out.println(" ");
            }

        }
    }
}