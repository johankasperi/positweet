#include <Wire.h>
#include "Adafruit_TCS34725.h"
#include <Ethernet.h>
#include <SPI.h>

// Pick analog outputs, for the UNO these three work well
// use ~560  ohm resistor between Red & Blue, ~1K for green (its brighter)
#define redpin 3
#define greenpin 5
#define bluepin 6

// Vars for post request
byte mac[] = {  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress server(127,0,0,1);
EthernetClient client;
String postData;

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

void setup() {
  Serial.begin(9600);
  
// start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    for(;;)
      ;
  }
  // give the Ethernet shield a second to initialize:
  delay(1000);

  // Color sensor start:
  if (tcs.begin()) {
    Serial.println("Found sensor");
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    while (1); // halt!
  }
}


void loop() {
  uint16_t clear, red, green, blue;

  delay(60);  // takes 50ms to read 
  
  tcs.getRawData(&red, &green, &blue, &clear);

  // Figure out some basic hex code for visualization
  uint32_t sum = clear;
  float r, g, b;
  r = red; r /= sum;
  g = green; g /= sum;
  b = blue; b /= sum;
  r *= 256; g *= 256; b *= 256;
  
  String clearString = String((int)clear);  
  String redString = String((int)r);
  String greenString = String((int)g); 
  String blueString = String((int)b);  
  if (client.connect(server, 2222)) { 
      Serial.println("connecting...");
      // send the HTTP PUT request:
      client.println("GET /api/tweet/find?clear="+clearString+"&red="+redString+"&green="+greenString+"&blue="+blueString+" HTTP/1.1");
      client.println("Host: 127.0.0.1:2222");
      client.println("User-Agent: arduino-ethernet");
      client.println("Connection: close");
      client.println();
  }
  else {
    // if you couldn't make a connection:
    Serial.println("disconnecting.");
    client.stop();
  }
}
