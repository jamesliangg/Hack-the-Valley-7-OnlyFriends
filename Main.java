import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        System.out.println("Hello");
        String file = "test.ics";
        String[][] testArray = new String[80][80];
        Parse.csvToArray(file, testArray);
    }
}