import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class Parse {
    public static String[][] csvToArray(String file, String[][] csvArray) throws IOException {
		try{
        BufferedReader infile = new BufferedReader (new FileReader(file));
        String line;
        System.out.println("Beginning to read the file now:");
        line=infile.readLine();
        int lineNum = 0;
        int arrayPos = 0;
        while (line!=null){
            if (line.contains("DTSTART") && line.contains("TZID")){
                csvArray[arrayPos][0] = line;
                line = line.replace("DTSTART;TZID=Canada/Eastern:", "");
                line = line.substring(line.indexOf("T") + 1,line.length());
                System.out.println(line);
            }
            if (line.contains("DURATION")) {
                csvArray[arrayPos][1] = line;
                System.out.println(line);
                arrayPos++;
            }
          line=infile.readLine();
          lineNum++;
			}
			System.out.println("Closing file.");
			infile.close();
		}catch (FileNotFoundException e){
			System.out.println("Incorrect filename or location. Please verify path and filename. ");
		}
    return csvArray;
  }
}
