import java.util.Scanner;

public class SixSeven {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner(System.in)) {
            System.out.print("Enter size: ");
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
        }
    }
}