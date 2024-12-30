import {
    // FunctionDeclarationSchemaType,
    HarmBlockThreshold,
    HarmCategory,
    VertexAI 
} from "@google-cloud/vertexai";

const project = "ai-agent-bamb00";
const location = 'asia-northeast1';

const vertexAI = new VertexAI({project: project, location: location});
const model = 'gemini-1.5-flash-001';

const generativeModel = vertexAI.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
});

export const streamGenerateBlog = async (inputText_: string) => {
    const message = {text: `${inputText_}を、わかりやすく説明するブログを作成して`}
    const req = {
        contents: [
            {
                role: 'user', 
                parts: [message]
            }
        ],
    };
    const streamingResp = await generativeModel.generateContentStream(req);
    for await (const item of streamingResp.stream) {
        process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
    }
    process.stdout.write('aggregated response: ' + JSON.stringify(await streamingResp.response));
};

export const generateContent = async (inputText_: string) => {
    const message = {text: `${inputText_}を、わかりやすく説明するブログを作成して`}
    const req = {
        contents: [
            {
                role: 'user', 
                parts: [message]
            }
        ],
    };
    const result = await generativeModel.generateContent(req);
    const response = result.response;
    console.log('Response: ', JSON.stringify(response));

    return JSON.stringify(response);
};