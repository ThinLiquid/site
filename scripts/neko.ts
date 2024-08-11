const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const cliProgress = require("cli-progress");
const colors = require("ansi-colors");
require("dotenv").config();

const API_BASE_URL = "https://nekoweb.org/api";
const API_KEY = process.env.NEKOWEB_API_KEY;
const TOKEN = process.env.NEKOWEB_TOKEN;
const FILE_PATH = "./site.zip";
const MAX_CHUNK_SIZE = 100 * 1024 * 1024; // 100MB max chunk size
const MIN_CHUNK_SIZE = 10 * 1024 * 1024; // 10MB min chunk size
const MIN_CHUNKS = 10;

async function uploadLargeFile() {
  try {
    console.log(colors.cyan("(i) Starting upload process..."));

    // Step 1: Create upload for a big file
    const createResponse = await axios.get(`${API_BASE_URL}/files/big/create`, {
      headers: { Authorization: API_KEY },
    });
    const uploadId = createResponse.data.id;
    console.log(colors.green(`(-) Upload ID: ${uploadId}`));

    // Step 2: Read and upload file chunks
    const fileSize = fs.statSync(FILE_PATH).size;
    let numberOfChunks = Math.ceil(fileSize / MAX_CHUNK_SIZE);
    let chunkSize = Math.ceil(fileSize / numberOfChunks);

    // Ensure chunk size is not smaller than the minimum chunk size
    if (chunkSize < MIN_CHUNK_SIZE) {
      chunkSize = MIN_CHUNK_SIZE;
      numberOfChunks = Math.ceil(fileSize / chunkSize);
    }

    if (numberOfChunks < MIN_CHUNKS) {
      numberOfChunks = MIN_CHUNKS;
      chunkSize = Math.ceil(fileSize / numberOfChunks);
    }

    let uploadedBytes = 0;

    console.log();
    const progressBar = new cliProgress.SingleBar({
      format: `${FILE_PATH} |${colors.cyan("{bar}")}| {percentage}% || {value}/{total} Bytes`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    });

    progressBar.start(fileSize, 0);

    const fileStream = fs.createReadStream(FILE_PATH, {
      highWaterMark: chunkSize,
    });
    let chunkIndex = 0;

    for await (const chunk of fileStream) {
      const formData = new FormData();
      formData.append("id", uploadId);
      formData.append("file", chunk, { filename: `chunk_${chunkIndex}` });

      await axios.post(`${API_BASE_URL}/files/big/append`, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: API_KEY,
        },
      });

      uploadedBytes += chunk.length;
      progressBar.update(uploadedBytes);
      chunkIndex++;
    }

    progressBar.stop();

    console.log(colors.green("(✓) File chunks uploaded successfully."));

    // Step 3: Delete the contents of /site
    console.log(colors.cyan("\n(i) Deleting contents of /site..."));
    await axios.post(
      `${API_BASE_URL}/files/delete`,
      {
        pathname: "/site",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: API_KEY,
        },
      },
    );
    console.log(colors.green("(✓) /site contents deleted successfully."));

    // Step 4: Import the zip file
    console.log(colors.cyan(`\n(i) Extracting ${colors.cyan(FILE_PATH)}...`));
    await axios.post(`${API_BASE_URL}/files/import/${uploadId}`, null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: API_KEY,
      },
    });
    console.log(
      colors.green(`(✓) Successfully extracted ${colors.cyan(FILE_PATH)}.`),
    );

    console.log(
      colors.bgCyan.black("\n(✓) Upload process completed successfully!"),
    );
    fs.rmSync(FILE_PATH);

    // Step 5: Update index.html
    console.log(colors.cyan("\n(i) Updating index.html..."));
    await axios.post(
      `${API_BASE_URL}/files/edit`,
      {
        pathname: "/index.html",
        content: `<!DOCUTYPE html><html><head><title>thinliquid's catppuccin heaven</title></head><!-- ${Date.now()} --><body><script>window.location.replace('https://thinliquid.dev')</script></body></html>`,
      },
      {
        headers: {
          "User-Agent": "thinliquid's build script (please don't ban me)",
          "Content-Type": "multipart/form-data",
          Referer: `https://nekoweb.org/?${encodeURIComponent("thinliquid's build script (please don't ban me)")}`,
          Cookie: `token=${TOKEN}`,
        },
      },
    );
    console.log(colors.green("(✓) index.html updated successfully."));
  } catch (error) {
    console.error(colors.red("Error uploading file:"), (error as Error).message);
  }
}

uploadLargeFile();
