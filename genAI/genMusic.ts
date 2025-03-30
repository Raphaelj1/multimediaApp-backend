import axios, { AxiosError, AxiosRequestConfig } from 'axios';

async function generateMusic(prompt: string, token: string): Promise<string> {
	if (!token) {
		throw new Error('Error: Hugging Face API token not set.');
	}

	const url = 'https://api-inference.huggingface.co/models/facebook/musicgen-small';
	const data = {
		inputs: prompt,
	};
	const config: AxiosRequestConfig = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		responseType: 'arraybuffer', // Get raw binary data (audio)
	};

	try {
		const response = await axios.post(url, data, config);

		// Handle specific status codes
		if (response.status === 503) {
			return 'Model is loading, please try again shortly.';
		}

		if (response.status !== 200) {
			throw new Error(`Error: ${response.status} - ${response.data.toString('utf8')}`);
		}

		if (response.status !== 200) throw new Error('Audio generation failed');

		const audioBuffer = Buffer.from(response.data);
		const base64Audio = audioBuffer.toString('base64');
		const audio = `data:audio/mp3;base64,${base64Audio}`;
		return audio;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Huggingface Error:', axiosError.message);
		throw new Error(
			'Failed to generate audio: ' + (axiosError.response?.data || axiosError.message)
		);
	}
}

export default generateMusic;
