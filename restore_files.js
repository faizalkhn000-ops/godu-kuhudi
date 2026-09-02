const fs = require('fs');

const transcriptPath = '/Users/faizalkhan/.gemini/antigravity-ide/brain/9348eac1-a8b9-4590-962b-1509792a24f0/.system_generated/logs/transcript_full.jsonl';
const log = fs.readFileSync(transcriptPath, 'utf8');

const lines = log.split('\n').filter(Boolean);

for (const line of lines) {
    try {
        const parsed = JSON.parse(line);
        if (parsed.type === 'PLANNER_RESPONSE' && parsed.tool_calls) {
            for (const toolCall of parsed.tool_calls) {
                if (toolCall.name === 'write_to_file') {
                    const targetFile = toolCall.args.TargetFile;
                    // If targetFile starts with quotes, parse it
                    let filePath = targetFile;
                    try { filePath = JSON.parse(targetFile); } catch(e) {}
                    
                    const codeContentRaw = toolCall.args.CodeContent;
                    let codeContent = codeContentRaw;
                    try { codeContent = JSON.parse(codeContentRaw); } catch(e) {}

                    if (filePath && filePath.startsWith('/Users/faizalkhan/gudi/') && filePath.includes('/src/')) {
                        console.log(`Restoring ${filePath}`);
                        // Ensure directory exists
                        const dir = require('path').dirname(filePath);
                        fs.mkdirSync(dir, { recursive: true });
                        fs.writeFileSync(filePath, codeContent, 'utf8');
                    }
                }
            }
        }
    } catch (e) {
        console.error("Error parsing line:", e);
    }
}
console.log("Done restoring files.");
