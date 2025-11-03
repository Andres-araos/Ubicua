#include <WiFi.h>
#include <WebServer.h>
#include <LiquidCrystal_I2C.h>


const char* ssid = "";         
const char* password = ""; 

WebServer server(80);

LiquidCrystal_I2C lcd(0x27, 16, 2);

void handleTexto() {
  if (server.hasArg("plain")) {
    String cuerpo = server.arg("plain");
    Serial.println("Recibido del navegador: " + cuerpo);

    int inicio = cuerpo.indexOf(":\"") + 2;
    int fin = cuerpo.lastIndexOf("\"");
    String texto = cuerpo.substring(inicio, fin);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("");
    lcd.setCursor(0, 1);
    lcd.print(texto.substring(0, 16));

    server.send(200, "text/plain", "Texto recibido");
  } else {
    server.send(400, "text/plain", "Sin datos");
  }
}

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.print("Conectando WiFi...");

  WiFi.begin(ssid, password);
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 30) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n WiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    lcd.print("IP:");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
  } else {
    lcd.print("Error WiFi");
    Serial.println(" Error de conexión WiFi");
  }

  server.on("/", []() {
    server.send_P(200, "text/html", htmlPage);
  });

  server.on("/texto", HTTP_POST, handleTexto);

  server.begin();
  Serial.println("Servidor iniciado.");
}

void loop() {
  server.handleClient();
}