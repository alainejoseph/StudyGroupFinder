const clamd = require("clamdjs");
const net = require("net");

// connect to local clamd daemon socket
const scanner = clamd.createScanner(
  "/var/run/clamav/clamd.ctl",
  3310,
  "127.0.0.1"
);

const scanFile = async (filePath) => {
  try {
    const result = await scanner.scanFile(filePath);

    if (result.includes("FOUND")) {
      return "FOUND";
    }

    return "OK";
  } catch (err) {
    console.error("ClamAV Error:", err);
    throw new Error("Virus scan failed");
  }
};

module.exports = scanFile;
