import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface GenerationResponse {
	artifacts: Array<{
		base64: string;
		seed: number;
		finishReason: string;
	}>;
}

// using old model because of credits
async function generateImage(prompt: string, apiKey: string): Promise<string> {
	const url = `https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image`;
	const data = {
		text_prompts: [{ text: prompt }],
		cfg_scale: 7,
		height: 512,
		width: 512,
		steps: 30,
		samples: 1,
	};
	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};
	const config: AxiosRequestConfig = {
		headers,
	};

	try {
		const response = await axios.post(url, data, config);

		const responseJSON = response.data as GenerationResponse;
		const base64Image = responseJSON.artifacts[0].base64;
		const image = `data:image/png;base64,${base64Image}`;
		return image;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Stability AI Error:', axiosError.message);
		throw new Error(
			'Failed to generate image: ' + (axiosError.response?.data || axiosError.message)
		);
	}
}

// highend version - 3 credits per image
async function generateImageLatest(prompt: string, apiKey: string): Promise<string> {
	try {
		const payload = {
			prompt,
			output_format: 'webp',
		};

		const response = await axios.postForm(
			`https://api.stability.ai/v2beta/stable-image/generate/core`,
			axios.toFormData(payload, new FormData()),
			{
				validateStatus: () => true,
				responseType: 'arraybuffer',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					Accept: 'image/*',
				},
			}
		);

		if (response.status !== 200) {
			const errorText = Buffer.from(response.data).toString('utf-8');
			throw new Error(`Stability AI Error: ${response.status} - ${errorText}`);
		}

		const imageBuffer = Buffer.from(response.data);
		const base64Image = imageBuffer.toString('base64');
		const image = `data:image/png;base64,${base64Image}`;
		return image;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Stability AI Error:', axiosError.message);
		throw new Error(
			'Failed to generate image: ' + (axiosError.response?.data || axiosError.message)
		);
	}
}

export default generateImage;
