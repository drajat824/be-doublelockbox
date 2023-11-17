const mqtt = require("mqtt");
const mqttTopic = "notification-topic";
const OneSignal = require("onesignal-node");

const express = require("express");
const { Router } = require("express");

export async function handler(event, context) {
  const app = express();
  const router = Router();

  // Middleware untuk menampilkan "Hello" ketika diakses
  app.get("/hello", (req, res) => {
    res.send("Server Berjalan!");
  });

  app.use("/api/", router);

  const rootCa = `
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
`;

  const options = {
    protocol: "mqtts",
    host: "395d0f154c95495889ba0205f5623f66.s1.eu.hivemq.cloud",
    port: 8883,
    ca: [rootCa],
    username: "notif",
    password: "Notif123@",
  };

  async function connectToMqtt() {
    return new Promise((resolve, reject) => {
      const mqttClient = mqtt.connect(options);

      // Ketika koneksi MQTT terhubung
      mqttClient.on("connect", () => {
        console.log("MQTT connected");

        // Subscribe ke topik MQTT
        mqttClient.subscribe(mqttTopic);

        // Resolusi Promise jika terhubung berhasil
        resolve("MQTT connected");
      });

      // Ketika menerima pesan di topik MQTT
      mqttClient.on("message", (topic, message, packet) => {
        // console.log(packet.payload.toString());

        const client = new OneSignal.Client(
          "49b0050a-99f4-4842-ba5b-db1b516fb6cb",
          "MzBlZGFkNTUtM2IyZS00ODA1LTg2N2MtZDZlNzVlNjc1MzAy"
        );

        const notification = {
          contents: {
            tr: "Yeni bildirim",
            en: "Peringatan! Brankas dalam keadaan mencurigakan!",
          },
          included_segments: ["double-lock-box"],
        };

        client
          .createNotification(notification)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      });

      // Tangani kesalahan koneksi
      mqttClient.on("error", (error) => {
        console.error("MQTT connection error:", error);
        // Tolak Promise jika terjadi kesalahan
        reject(error);
      });
    });
  }

  // Contoh penggunaan
  connectToMqtt()
    .then((response) => {
      console.log(response);
      // Lakukan tindakan tambahan setelah koneksi berhasil
    })
    .catch((error) => {
      console.error("Failed to connect to MQTT:", error);
      // Lakukan tindakan tambahan jika koneksi gagal
    });

  return serverless(app)(event, context);
}
