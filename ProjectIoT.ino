#include <DHT.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

/* ================= BLYNK ================= */
#define BLYNK_TEMPLATE_ID "TMPL6I-3yxOoy"
#define BLYNK_TEMPLATE_NAME "IgnisGuardian"
#define BLYNK_AUTH_TOKEN "CRAc0AMtsMpAPB45NJsU5ftLy7lqNh72"

#include <BlynkSimpleEsp32.h>
BlynkTimer blynkTimer;

/* ======= WIFI MANAGER (CAPTIVE PORTAL) ======= */
#include <WiFiManager.h>
#include <Preferences.h>
Preferences prefs;

/* =============== PIN MAP =============== */
#define LED1 16
#define LED2 17
#define BUZZER 26
#define MQ2 34
#define MQ135 35
#define FLAME 32
#define DHT_PIN 4

/* =============== MQTT ================== */
#define HOST "9c7a573fca0d46e8a92a62aaddf10152.s1.eu.hivemq.cloud"
#define PORT 8883
#define USERNAME "iot_project"
#define PASSWORD "Hcmus23clc09"

#define SSID "OPPO A5 2020"
#define PASS_WIFI "hcmussss"

const char *TOPIC_TELE = "IgnisGuardian/telemetry";
const char *TOPIC_CMD = "IgnisGuardian/cmd";

/* =============== OBJECTS =============== */
DHT dht(DHT_PIN, DHT11);
WiFiClientSecure net;
PubSubClient mqtt(net);

/* =============== NGƯỠNG =============== */
int MQ2_WARN = 1400;
int MQ2_ALARM = 2000;

int MQ135_WARN = 1400;
int MQ135_ALARM = 2000;

int FLAME_WARN = 3700;
int FLAME_ALARM = 3500;

/* =========== SLIDING AVERAGE =========== */
struct pattern
{
    float buf[5];
    int idx = 0;
    int count = 0;
    float sum = 0;
    pattern()
    {
        for (int i = 0; i < 5; i++)
            buf[i] = 0;
    }
};

pattern MQ2_lated, MQ135_lated, Flame_lated, Temperature_lated, Humidity_lated;

/* =============== STATE =============== */
int stateGas = 0;
int stateFlame = 0;
int buzMode = 0;

bool silence = false;
unsigned long silenceUntil = 0;

unsigned long prev = 0;

unsigned long gasWarnStart = 0;
unsigned long gasAlarmStart = 0;
unsigned long fireWarnStart = 0;
unsigned long fireAlarmStart = 0;

/* ======= Token có thể nhập từ Captive Portal ======= */
char blynkToken[64] = BLYNK_AUTH_TOKEN;

/* ======= (THÊM) Biến chống spam thông báo cháy ======= */
int lastFireState = 0;
unsigned long lastFireNotify = 0;
int lastGasState = 0;
unsigned long lastGasNotify = 0;


/* =============== HELPERS =============== */
void setLED(bool state)
{
    digitalWrite(LED1, state ? HIGH : LOW);
    digitalWrite(LED2, state ? HIGH : LOW);
}

float avgOf(pattern *p, float value)
{
    const int N = 5;

    if (p->count < N)
    {
        p->buf[p->idx] = value;
        p->sum += value;
        p->idx = (p->idx + 1) % N;
        p->count++;
        return p->sum / p->count; // warm-up
    }
    else
    {
        p->sum -= p->buf[p->idx];
        p->buf[p->idx] = value;
        p->sum += value;
        p->idx = (p->idx + 1) % N;
        return p->sum / N;
    }
}

/* =============== BUZZER =============== */
void buzzerAndLed(int mode)
{
    // mode: 0=OFF, 1=WARN, 2=ALARM
    static unsigned long last = 0;
    static bool on = false;

    unsigned long now = millis();
    unsigned long onMs, offMs;

    if (mode == 0)
    {
        digitalWrite(BUZZER, LOW);
        setLED(false);
        on = false;
        return;
    }

    if (mode == 1)
    { // WARN
        onMs = 200;
        offMs = 800;
    }
    else
    { // ALARM
        onMs = 150;
        offMs = 150; // hoặc onMs=1000; offMs=0 để ON liên tục
    }

    if (!on)
    {
        if (now - last >= offMs)
        {
            digitalWrite(BUZZER, HIGH);
            setLED(true);
            on = true;
            last = now;
        }
    }
    else
    {
        if (now - last >= onMs)
        {
            digitalWrite(BUZZER, LOW);
            setLED(false);
            on = false;
            last = now;
        }
    }
}

/* =============== MQTT CALLBACK =============== */
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    String msg;
    msg.reserve(length);
    for (unsigned int i = 0; i < length; i++)
        msg += (char)payload[i];

    Serial.print("RX topic: ");
    Serial.println(topic);
    Serial.print("RX payload: ");
    Serial.println(msg);

    // Lệnh: {"silence":true,"ms":30000}
    if (msg.indexOf("\"silence\":true") >= 0)
    {
        int ms = 30000; // mặc định 30s

        int p = msg.indexOf("\"ms\":");
        if (p >= 0)
        {
            // lấy số sau "ms":
            String tail = msg.substring(p + 5);
            ms = tail.toInt();
            if (ms <= 0)
                ms = 30000;
        }

        silence = true;
        silenceUntil = millis() + (unsigned long)ms;

        Serial.print("Silence ON for ms=");
        Serial.println(ms);
    }

    // Lệnh: {"silence":false} để bật lại ngay
    if (msg.indexOf("\"silence\":false") >= 0)
    {
        silence = false;
        Serial.println("Silence OFF");
    }
}

/* =============== WIFI & MQTT =============== */
void wifiConnect()
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(SSID, PASS_WIFI);
    Serial.print("WiFi connecting");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(300);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");
}

void mqttConnect()
{
    int tries = 0;
    while (!mqtt.connected() && tries < 5)
    {
        tries++;
        String clientId = "esp32-" + WiFi.macAddress();

        Serial.print("MQTT connecting...");

        if (mqtt.connect(clientId.c_str(), USERNAME, PASSWORD))
        {
            Serial.println("connected");
            mqtt.subscribe(TOPIC_CMD);
        }
        else
        {
            Serial.print("failed, state=");
            Serial.println(mqtt.state());
            delay(1500);
        }
    }
}

void syncNTP()
{
    configTime(7 * 3600, 0, "pool.ntp.org", "time.nist.gov"); // GMT+7

    Serial.print("Sync NTP");
    time_t now = time(nullptr);
    int tries = 0;
    while (now < 1700000000 && tries < 60)
    { // đợi tối đa ~12s
        delay(200);
        Serial.print(".");
        now = time(nullptr);
        tries++;
    }
    Serial.println();
    if (now >= 1700000000)
        Serial.println("NTP OK");
    else
        Serial.println("NTP FAIL (will still send without real time)");
}

/* =============== BLYNK HELPERS =============== */
String stateToText(int s)
{
    if (s == 0)
        return "SAFE";
    if (s == 1)
        return "WARN";
    return "ALARM";
}

/*
  Map đúng theo Datastream bạn đã tạo:
  V0: NỒNG ĐỘ KHÍ GAS (Double)  -> mq2 (giá trị)
  V1: NỒNG ĐỘ KHÓI (Double)     -> mq135 (giá trị)
  V2: NHIỆT ĐỘ (Double)         -> t
  V3: ĐỘ ẨM (Double)            -> h
  V4: CHÁY (Integer 0-2)        -> fireS
*/
void pushToBlynk(float t, float h, float mq2, float mq135, int gasS, int fireS)
{
    Blynk.virtualWrite(V0, mq2);
    Blynk.virtualWrite(V1, mq135);
    Blynk.virtualWrite(V2, t);
    Blynk.virtualWrite(V3, h);
    Blynk.virtualWrite(V4, fireS);

    // đổi màu theo trạng thái (không ghi đè datastream)
    Blynk.setProperty(V0, "color", gasS == 2 ? "#D3435C" : gasS == 1 ? "#ED9D00"
                                                                     : "#23C48E");
    Blynk.setProperty(V1, "color", fireS == 2 ? "#D3435C" : fireS == 1 ? "#ED9D00"
                                                                       : "#23C48E");
}

/* Nút SILENCE trên Blynk: V5 (Integer 0/1) */
BLYNK_WRITE(V5)
{
    int v = param.asInt();
    if (v == 1)
    {
        silence = true;
        silenceUntil = millis() + 30000UL; // 30s
        Blynk.virtualWrite(V5, 0);         // nhả nút về 0
    }
}

/* ======= WiFiManager Captive Portal (giống hình bạn gửi) ======= */
void startCaptivePortal()
{
    // đọc token đã lưu (nếu có)
    prefs.begin("cfg", true);
    String saved = prefs.getString("blynk", "");
    prefs.end();
    if (saved.length() > 0)
    {
        strncpy(blynkToken, saved.c_str(), sizeof(blynkToken));
        blynkToken[sizeof(blynkToken) - 1] = '\0';
    }

    WiFiManager wm;
    wm.setCaptivePortalEnable(true);
    wm.setConfigPortalTimeout(180); // 3 phút

    WiFiManagerParameter p_token("token", "Auth token", blynkToken, 63);
    wm.addParameter(&p_token);

    wm.resetSettings(); // xóa WiFi đã lưu -> ép hiện portal

    // Nếu ESP32 chưa có WiFi đã lưu -> sẽ hiện portal để chọn SSID/Password + Auth token
    bool ok = wm.autoConnect("IgnisGuardian-Setup", "12345678");
    if (!ok)
    {
        ESP.restart();
        delay(1000);
    }

    // Lưu token người dùng nhập
    strncpy(blynkToken, p_token.getValue(), sizeof(blynkToken));
    blynkToken[sizeof(blynkToken) - 1] = '\0';

    prefs.begin("cfg", false);
    prefs.putString("blynk", String(blynkToken));
    prefs.end();
}

/* =============== SETUP =============== */
void setup()
{
    Serial.begin(9600);

    pinMode(LED1, OUTPUT);
    pinMode(LED2, OUTPUT);
    pinMode(BUZZER, OUTPUT);

    dht.begin();

    // Captive Portal nhập WiFi giống hình bạn muốn
    startCaptivePortal();

    // Blynk connect theo token (có thể nhập từ portal)
    Blynk.config(blynkToken);
    Blynk.connect(2000);

    wifiConnect();
    net.setInsecure();
    mqtt.setServer(HOST, PORT);
    mqtt.setCallback(mqttCallback);
    mqttConnect();
    syncNTP();

    // Giữ nguyên ý bạn: vẫn mở AP song song để điện thoại thấy WiFi ESP32
    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP("IgnisGuardian", "12345678");

    Serial.print("ESP32 AP IP: ");
    Serial.println(WiFi.softAPIP());
}

/* =============== LOOP =============== */
void loop()
{
    if (!mqtt.connected())
        mqttConnect();
    mqtt.loop();

    if (!Blynk.connected())
        Blynk.connect(2000);
    Blynk.run();

    unsigned long cur = millis();
    if (silence && cur > silenceUntil)
        silence = false;

    if (cur - prev >= 1000)
    {
        prev = cur;

        float h = dht.readHumidity();
        float t = dht.readTemperature();
        int mq2Value = analogRead(MQ2);
        int mq135Value = analogRead(MQ135);
        int flameValue = analogRead(FLAME);

        float avgHumidity = avgOf(&Humidity_lated, h);
        float avgTemperature = avgOf(&Temperature_lated, t);
        float avgMQ2 = avgOf(&MQ2_lated, mq2Value);
        float avgMQ135 = avgOf(&MQ135_lated, mq135Value);
        float avgFlame = avgOf(&Flame_lated, flameValue);

        // ======================
        // GAS (MQ2) - vượt 5s mới báo
        // ======================
        bool gasWarnCond = (avgMQ2 >= MQ2_WARN && avgMQ2 < MQ2_ALARM);
        bool gasAlarmCond = (avgMQ2 >= MQ2_ALARM);

        if (gasAlarmCond)
        {
            if (gasAlarmStart == 0)
                gasAlarmStart = cur;
        }
        else
        {
            gasAlarmStart = 0; // hết vượt -> reset
        }

        if (gasWarnCond)
        {
            if (gasWarnStart == 0)
                gasWarnStart = cur;
        }
        else
        {
            gasWarnStart = 0; // hết vượt -> reset
        }

        if (gasAlarmStart && (cur - gasAlarmStart >= 5000))
            stateGas = 2;
        else if (gasWarnStart && (cur - gasWarnStart >= 5000))
            stateGas = 1;
        else
            stateGas = 0;

        // ======================
        // FIRE (MQ135 + FLAME) - vượt 5s mới báo
        // ======================
        bool mq135WarnCond = (avgMQ135 >= MQ135_WARN && avgMQ135 < MQ135_ALARM);
        bool mq135AlarmCond = (avgMQ135 >= MQ135_ALARM);

        bool flameWarnCond = (avgFlame <= FLAME_WARN && avgFlame > FLAME_ALARM);
        bool flameAlarmCond = (avgFlame <= FLAME_ALARM);

        bool fireWarnCond = (mq135WarnCond || flameWarnCond);
        bool fireAlarmCond = (mq135AlarmCond || flameAlarmCond); // hoặc bạn có thể yêu cầu cả 2 cùng đúng

        if (fireAlarmCond)
        {
            if (fireAlarmStart == 0)
                fireAlarmStart = cur;
        }
        else
        {
            fireAlarmStart = 0;
        }

        if (fireWarnCond)
        {
            if (fireWarnStart == 0)
                fireWarnStart = cur;
        }
        else
        {
            fireWarnStart = 0;
        }

        if (fireAlarmStart && (cur - fireAlarmStart >= 5000))
            stateFlame = 2;
        else if (fireWarnStart && (cur - fireWarnStart >= 5000))
            stateFlame = 1;
        else
            stateFlame = 0;

        char payload[300];
        snprintf(payload, sizeof(payload),
                 "{\"device\":\"esp32_01\",\"mq2\":%.0f,\"mq135\":%.0f,\"flame\":%.0f,"
                 "\"t\":%.1f,\"h\":%.1f,\"gas_state\":%d,\"fire_state\":%d}",
                 avgMQ2, avgMQ135, avgFlame, avgTemperature, avgHumidity, stateGas, stateFlame);

        mqtt.publish(TOPIC_TELE, payload);
        Serial.println(payload);

        /* ======= (THÊM) GỬI EVENT THÔNG BÁO KHI CHÁY =======
           - Gửi 1 lần khi vừa chuyển sang stateFlame = 2
           - (Tuỳ chọn) nhắc lại mỗi 2 phút nếu vẫn cháy
           Event code trong Blynk Console: "fire_alarm"
        */
        if (stateFlame == 2 && lastFireState != 2)
        {
            Blynk.logEvent("fire_alarm", "FIRE ALARM!");
            lastFireNotify = millis();
        }
        if (stateFlame == 2 && (millis() - lastFireNotify > 120000UL))
        { // 2 phút
            Blynk.logEvent("fire_alarm", "FIRE ALARM (repeat)!");
            lastFireNotify = millis();
        }
        lastFireState = stateFlame;

        if (stateFlame == 2 && lastFireState != 2)
        {
            Blynk.logEvent("fire_alarm", "FIRE ALARM!");
            lastFireNotify = millis();
        }
        if (stateFlame == 2 && (millis() - lastFireNotify > 120000UL))
        {
            Blynk.logEvent("fire_alarm", "FIRE ALARM (repeat)!");
            lastFireNotify = millis();
        }
        lastFireState = stateFlame;
        /* ======= (THÊM) GỬI EVENT THÔNG BÁO KHI GAS =======
           - Gửi 1 lần khi vừa chuyển sang stateGas = 2
           - (Tuỳ chọn) nhắc lại mỗi 2 phút nếu vẫn gas alarm
           Event code trong Blynk Console: "gas_alarm"
        */
        if (stateGas == 2 && lastGasState != 2)
        {
            Blynk.logEvent("gas_alarm", "GAS ALARM!");
            lastGasNotify = millis();
        }
        if (stateGas == 2 && (millis() - lastGasNotify > 120000UL))
        { // 2 phút
            Blynk.logEvent("gas_alarm", "GAS ALARM (repeat)!");
            lastGasNotify = millis();
        }
        lastGasState = stateGas;

        // gửi đúng dữ liệu lên Blynk
        pushToBlynk(avgTemperature, avgHumidity, avgMQ2, avgMQ135, stateGas, stateFlame);

        Serial.print("MQ2=");
        Serial.print(avgMQ2);
        Serial.print(" MQ135=");
        Serial.print(avgMQ135);
        Serial.print(" FL=");
        Serial.print(avgFlame);
        Serial.print(" T=");
        Serial.print(avgTemperature);
        Serial.print(" H=");
        Serial.print(avgHumidity);
        Serial.print(" | GAS=");
        Serial.print(stateGas);
        Serial.print(" FIRE=");
        Serial.println(stateFlame);

        // ưu tiên cháy hơn gas
        if (stateFlame == 2)
            buzMode = 2;
        else if (stateFlame == 1)
            buzMode = 1;
        else if (stateGas == 2)
            buzMode = 2;
        else if (stateGas == 1)
            buzMode = 1;
        else
            buzMode = 0;
    }
    if (silence)
    {
        digitalWrite(BUZZER, LOW);
        setLED(false);
    }
    else
        buzzerAndLed(buzMode);
}
