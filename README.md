##How to run it:

npm install
npm start

Runs at http://localhost:3000.

Features
Notes textarea and/or file upload — either or both is accepted.
File validation: allowed types .doc .docx .pdf .ppt .pptx .txt, max 40 MB.
Empty-input validation with inline error messages.
Loading state (~1s) then results in three cards.

##<ins>Responsible AI</ins>
###Fairness
The AI may produce better results for notes written in clear, formal English. Notes that are written informally, in point form, or that contain heavy technical shorthand may result in a weaker summary or irrelevant questions. Students whose first language is not English may also find that the AI misses nuance or rephrases things in a way that does not match how they learned the material. We recommend reviewing the output and editing it to match your own understanding.

###Reliability and Safety
The AI can make mistakes. It may summarize something incorrectly, miss a key concept, or generate a practice question that does not match the material. The output should always be treated as a starting point, not a final answer. Students should not use the generated summary as a replacement for their actual notes or to verify facts. The AI does not know if your notes are correct to begin with.

###Privacy and Security
When a user pastes notes or uploads a file, that text is sent to the Azure OpenAI service for processing. We do not store the raw note text beyond what is needed to complete the request. Uploaded files are stored temporarily in Azure Blob Storage and are used only to extract text for the AI. All API keys and connection strings are stored in environment variables on the server and are never exposed to the browser or committed to the repository.

###Inclusiveness
The application works in any modern browser and on mobile. File uploads support common formats including PDF, Word, PowerPoint, and plain text, which covers most note taking workflows. The UI uses clear labels and readable font sizes. At this stage the app is English only, which is a known limitation, students writing notes in other languages may see reduced quality in the AI output.

###Transparency
The application clearly labels all output as AI generated. The header on the results page identifies it as a generated study guide, not a verified answer key. Users are shown exactly what the AI produced a summary, a list of key terms, and a set of practice questions so they can judge the quality themselves rather than receiving a single score or grade.

###Accountability
The student is always responsible for their own studying and learning. Study Helper is a tool to help organize notes, not to replace understanding. If the AI produces a summary that seems wrong or a question that does not make sense, the student should ignore it and refer back to their original notes or their instructor. No academic submission or decision should be based solely on the output of this tool.