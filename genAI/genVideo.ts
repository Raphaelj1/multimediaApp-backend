import { InferenceClient } from '@huggingface/inference';
import { AxiosError } from 'axios';

async function generateVideo(prompt: string, token: string): Promise<string> {
	if (!token) throw new Error('HUGGINGFACE_API_TOKEN not set');

	const client = new InferenceClient(token);

	try {
		// Returns a Blob (raw MP4 data), not a URL
		const videoBlob: Blob = await client.textToVideo({
			provider: 'fal-ai',
			model: 'Lightricks/LTX-Video',
			inputs: prompt,
		});

		// Convert Blob to ArrayBuffer, then to base64
		const arrayBuffer = await videoBlob.arrayBuffer();
		const base64Video = Buffer.from(arrayBuffer).toString('base64');
		console.log(base64Video.slice(0, 50));
		return `data:video/mp4;base64,${base64Video}`;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('HuggingfaceVideo Error:', axiosError.message);
		throw new Error(
			'Failed to generate video: ' + (axiosError.response?.data || axiosError.message)
		);
	}
}

export default generateVideo