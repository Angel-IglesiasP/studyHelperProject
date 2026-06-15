// Talks to Azure Blob Storage: upload an incoming file, download it again later.
const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents';

if (!connectionString) {
  throw new Error(
    'AZURE_STORAGE_CONNECTION_STRING is not set. Copy .env.example to .env and fill it in.'
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Store a file buffer in Blob Storage and return the generated blob name.
async function uploadBuffer(buffer, originalName, contentType) {
  // Create the container on first use so a fresh storage account just works.
  await containerClient.createIfNotExists();

  // Prefix with a timestamp so two files named "notes.pdf" don't overwrite each other.
  const blobName = `${Date.now()}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blobName;
}

// Pull a previously uploaded file back out of Blob Storage as a Buffer.
async function downloadBuffer(blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  return blockBlobClient.downloadToBuffer();
}

module.exports = { uploadBuffer, downloadBuffer };
