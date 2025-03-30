import axios, { AxiosError, AxiosRequestConfig } from 'axios';

async function generateAudio(prompt: string, apiKey: string): Promise<string> {
	const url = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM';
	const data = {
		text: prompt,
		model_id: 'eleven_monolingual_v1',
		voice_settings: {
			stability: 0.5,
			similarity_boost: 0.5,
		},
	};
	const config: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'audio/mpeg',
			'xi-api-key': apiKey,
		},
		responseType: 'arraybuffer',
	};

	try {
		const response = await axios.post(url, data, config);

		if (response.status !== 200) throw new Error('Audio generation failed');
		const audioBuffer = Buffer.from(response.data);
		const base64Audio = audioBuffer.toString('base64');
		const audio = `data:audio/mp3;base64,${base64Audio}`;
		return audio;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('ElevenLabs Error:', axiosError.message);
		throw new Error(
			'Failed to generate audio: ' + (axiosError.response?.data || axiosError.message)
		);
	}
}

export default generateAudio;
