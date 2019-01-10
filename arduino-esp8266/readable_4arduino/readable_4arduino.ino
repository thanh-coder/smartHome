#include <ArduinoJson.h>
#include "dht.h"
#include <SoftwareSerial.h>
#include <SerialCommand.h>  
// speaker define
int speaker = 9;
//motor define
int motorWind = 8;
//MQ2 gas define
int mq2Sensor = 6;
//PIR define
int pirSensor = 7;
//dht initialization
dht DHT;
#define DHT11_PIN A0
int temp = 0, humi = 0, gas = 0, pir = 0, servo = 0;
const byte RX = 3;          // Chân 3 được dùng làm chân RX
const byte TX = 2;          // Chân 2 được dùng làm chân TX
SoftwareSerial mySerial = SoftwareSerial(RX, TX); 
SerialCommand sCmd(mySerial); // Khai báo biến sử dụng thư viện Serial Command
int red = 4; // led đỏ đối vô digital 4
void setup() {
  //Khởi tạo Serial ở baudrate 57600 để debug ở serial monitor
  Serial.begin(57600);
  //Khởi tạo Serial ở baudrate 57600 cho cổng Serial thứ hai, dùng cho việc kết nối với ESP8266
  mySerial.begin(57600);
  //pin mode speaker
  pinMode(speaker,OUTPUT);
  //pinMode 2 đèn LED là OUTPUT
  pinMode(red,OUTPUT);
  //pinMode motor
  pinMode(motorWind,OUTPUT);
  //pinMode Mq2
  pinMode(mq2Sensor,INPUT);
  //pir pin mode
  pinMode(pirSensor,INPUT);
  sCmd.addCommand("LED",   led); //Khi có lệnh LED thì sẽ thực thi hàm led  
  sCmd.addCommand("MOTOR",   motor); //Khi có lệnh LED thì sẽ thực thi hàm led  
}
unsigned long chuky1 = 0;
void loop() {
  //2s check 1 lan
  if (millis() - chuky1 > 2000) {
  chuky1 = millis();
  DHT.read11(DHT11_PIN);
  humi = DHT.humidity;
  temp = DHT.temperature;
  gas = digitalRead(mq2Sensor);
  pir = digitalRead(pirSensor);
  if(pir){
  digitalWrite(speaker,pir);
  }
  
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    //đọc giá trị cảm biến rồi in ra root
    root["humidity"] = humi;
    root["temperature"] = temp;
	//in ra cổng software serial để ESP8266 nhận DHT
    mySerial.print("DHT");   //gửi tên lệnh
    mySerial.print('\r');           // gửi \r
    root.printTo(mySerial);        //gửi chuỗi JSON
    mySerial.print('\r');
//for gas sensor
    JsonObject& rootGas = jsonBuffer.createObject();
	rootGas["gas"] = gas;
    mySerial.print("GAS");   //gửi tên lệnh
    mySerial.print('\r');           // gửi \r
    rootGas.printTo(mySerial);        //gửi chuỗi JSON
    mySerial.print('\r');
//for PIR
    JsonObject& rootPir = jsonBuffer.createObject();
	rootPir["pir"] = pir;
    mySerial.print("PIR");   //gửi tên lệnh
    mySerial.print('\r');           // gửi \r
    rootPir.printTo(mySerial);        //gửi chuỗi JSON
    mySerial.print('\r');
    
  }
  sCmd.readSerial();
	//bắt các chuỗi đang được gửi đến qua serial
  }
 
void led() {
  char *json = sCmd.next(); //gán biến con trỏ vào địa chỉ của chuỗi đang đến thông qua giao thức serial
  Serial.println(json);
  StaticJsonBuffer<200> jsonBuffer; //tạo Buffer json có khả năng chứa tối đa 200 ký tự
  JsonObject& root = jsonBuffer.parseObjectg (json);//đặt một biến root mang kiểu json
 
  int redStatus = root["led"][0];//json -> tham số root --> phần tử thứ 0.
  StaticJsonBuffer<200> jsonBuffer2;
  JsonObject& root2 = jsonBuffer2.createObject(); //tao root2 json gom ten, led status
  root2["redS"] = redStatus;  
  //in ra cổng software serial để ESP8266 gửi lên trên webserver
  mySerial.print("LED_STATUS");   //gửi tên lệnh
  mySerial.print('\r');           // gửi \r
  root2.printTo(mySerial); //gửi root 2 json len esp thong qua mySerial--serialsoftware
  mySerial.print('\r');           // gửi \r
  //xuất ra chân led
  digitalWrite(red, redStatus);
}

void motor(){
  Serial.println("MOTOR");
  char *json = sCmd.next(); //Chỉ cần một dòng này để đọc tham số nhận đươc
  Serial.println(json);
  StaticJsonBuffer<200> jsonBuffer; //tạo Buffer json có khả năng chứa tối đa 200 ký tự
  JsonObject& root = jsonBuffer.parseObject(json);//đặt một biến root mang kiểu json
  int motorStatus = root["fan"];//json -> tham số root --> phần tử thứ 0! 
  StaticJsonBuffer<200> jsonBuffer2;
  JsonObject& root2 = jsonBuffer2.createObject(); //tao root2 json gom ten, led status
  root2["motorStatus"] = motorStatus; 
  //Tạo một mảng trong JSON
  //in ra cổng software serial để ESP8266 nhận
  mySerial.print("MOTOR_STATUS");   //gửi tên lệnh
  mySerial.print('\r');           // gửi \r
  root2.printTo(mySerial); //gửi root 2 json len esp thong qua mySerial--serialsoftware
  mySerial.print('\r');           // gửi \r
 //xuất ra pin điều khiển
  digitalWrite(motorWind, motorStatus);
}