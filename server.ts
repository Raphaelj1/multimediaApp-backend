import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import genAI from './genAI'

const app = express();
const PORT = 5000;

dotenv.config();

// const corsOptions = {
// 	origin: 'http://localhost:3000',
// 	methods: ['GET', 'POST'],
// 	allowedHeaders: ['Content-Type'],
// 	credentials: true,
// };

app.use(cors());
app.use(express.json());

type ContentType = 'text' | 'image' | 'audio' | 'video';

interface GenerateResponse {
	type: ContentType;
	content?: string;
	error?: string;
}

const apiKeys = {
	// text: process.env.GEMINI_API_KEY as string,
	image: process.env.STABILITY_API_KEY as string,
	audio: process.env.ELEVENLABS_API_KEY as string,
	video: process.env.HUGGINGFACE_API_TOKEN as string,
};

const multimediaAI = genAI(apiKeys)

async function generate(prompt: string, type: ContentType): Promise<string> {
	switch (type) {
		case 'text':
			return await multimediaAI.text(prompt);
		case 'image':
			return await multimediaAI.image(prompt);
		case 'audio':
			return await multimediaAI.audio(prompt);
		case 'video':
			return await multimediaAI.video(prompt);
		default:
			throw new Error('Unsupported type');
	}
}

app.post('/generate', async (req: Request, res: Response): Promise<void> => {
	const { prompt, type }: { prompt: string; type: ContentType } = req.body;

	if (!prompt || typeof prompt !== 'string') {
		res.status(400).json({
			type: type || 'unknown',
			error: 'Prompt must be a non-empty string',
		});
		return;
	}
	if (!['text', 'image', 'audio', 'video'].includes(type)) {
		res.status(400).json({
			type: type || 'unknown',
			error: 'Type must be one of: text, image, audio, video',
		});
		return;
	}

	try {
		const content = await generate(prompt, type);
		res.json({ type, content } as GenerateResponse);
	} catch (error: any) {
		res.status(500).json({
			type,
			error: error.message || 'Internal server error',
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
