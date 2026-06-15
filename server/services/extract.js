// Turns a document (PDF/Word/PowerPoint) into plain text using Azure
// Document Intelligence. Plain .txt files skip the service entirely.
const createClient = require('@azure-rest/ai-document-intelligence').default;
const {
  getLongRunningPoller,
  isUnexpected,
} = require('@azure-rest/ai-document-intelligence');
const { AzureKeyCredential } = require('@azure/core-auth');

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
const apiKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

// Build the client lazily so the server can still boot (and serve .txt files)
// even if Document Intelligence isn't configured yet.
let client;
function getClient() {
  if (!client) {
    if (!endpoint || !apiKey) {
      throw new Error(
        'Document Intelligence endpoint/key not set. Check your .env file.'
      );
    }
    client = createClient(endpoint, new AzureKeyCredential(apiKey));
  }
  return client;
}

async function extractText(buffer, fileName) {
  // A .txt file is already plain text — no need to spend a Document Intelligence call.
  if (fileName.toLowerCase().endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  // Everything else goes through the prebuilt "read" model (OCR + text layout).
  const di = getClient();

  const initialResponse = await di
    .path('/documentModels/{modelId}:analyze', 'prebuilt-read')
    .post({
      contentType: 'application/json',
      body: { base64Source: buffer.toString('base64') },
    });

  if (isUnexpected(initialResponse)) {
    throw initialResponse.body.error;
  }

  // Extraction is asynchronous; the poller waits until Azure finishes.
  const poller = getLongRunningPoller(di, initialResponse);
  const result = (await poller.pollUntilDone()).body.analyzeResult;

  return result?.content || '';
}

module.exports = { extractText };
