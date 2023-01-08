/*
  This sketch converts any image into an
  RGB 565 in BGR order for using it with 
  the P2GUI framework I created for the
  Propeller 2 and an ILI9341 display.
*/

PImage original;
PImage img;


// Dimensions of the desired 565 image
// Choose one of the two
int imgWidth;
int imgHeight=100;

String filePath = "C:\\Users\\jrullan\\Documents\\Propeller2\\propeller2_gui\\";
String fileName;
String fileExtension = ".p2";

void setup(){
  //Preview size
  size(240,320);
  colorMode(RGB,255);
  File file = new File(filePath);
  selectInput("Select a file to process:", "fileSelected",file);  
}

void draw(){
  if(img != null) image(img,0,0);
  delay(2000);
  if(original != null) image(original,0,0);
  delay(2000);
}

void fileSelected(File selection) {
  if (selection == null) {
    println("Window was closed or the user hit cancel.");
  } else {  
    img = loadImage(selection.getAbsolutePath());
    original = img;
    
    if (imgHeight != 0){
      imgWidth = int(float(img.width)/float(img.height) * imgHeight);
    }else if(imgWidth != 0){
      imgHeight = int(float(img.height)/float(img.width) * imgWidth);
    }
    
    img.resize(imgWidth,imgHeight);
    img.loadPixels();
    String selectedFilePath = selection.getAbsolutePath();
    int pos = -1;
    for(int i=0; i<selectedFilePath.length(); i++){
      if(selectedFilePath.charAt(i) == '\\') pos = i;
    }
    fileName = selectedFilePath.substring(pos+1);
    println("User selected " + selection.getAbsolutePath());
    convertImageTo565(createFileName(filePath,fileName));
  }
}

void convertImageTo565(String saveAsFileName){
  int size = imgWidth*imgHeight;
  byte[] bytes= new byte[size*2]; // 2 bytes per color int
  int j=0;
  for(int i=0; i<size; i++){
    color c = img.pixels[i];
    byte r = (byte)red(c);
    byte g = (byte)green(c);
    byte b = (byte)blue(c);
        
    // Reduce to 5-6-5
    int red = (int(r) >> 3);
    int green = (int(g)>>2);
    int blue = (int(b) >> 3);
    
    // Arrange in a 16 bit value B-G-R
    bytes[j++] = byte((green&7)<<5 | red);  //byte 0
    bytes[j++] = byte((blue<<3)|(green>>3));//byte 1
 
  }
  saveBytes(saveAsFileName,bytes);  
  println("File saved as ");
  println(saveAsFileName);
  println("Image size: ",imgWidth, imgHeight);
}


String createFileName(String filePath,String fileName){
  String result = "";
  for(int i=0; i<filePath.length();i++){
    if(filePath.charAt(i)=='\\'){
      result += '/';
    }else{
      result += (filePath.charAt(i));
    }
  }
  int extPos = -1;
  for(int i=0; i<fileName.length();i++){
    if(fileName.charAt(i)=='.') extPos = i;
  }
  fileName = fileName.substring(0,extPos) + fileExtension;
  return result+fileName;
}
