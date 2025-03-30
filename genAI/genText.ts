import { GoogleGenerativeAI } from '@google/generative-ai';

async function generateText(prompt: string, apiKey: string): Promise<string> {
	try {
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		return text || '';
	} catch (error: any) {
		console.error('Gemini Error:', error.message);
		throw new Error('Failed to generate text: ' + error.message);
	}
}

export default generateText