import generateText from './genText';
import generateImage from './genImage';
import generateVideo from './genVideo';
import generateAudio from './genAudio';
import generateMusic from './genMusic';

interface ApiKeys {
	text?: string;
	image?: string;
	audio?: string;
	music?: string;
	video?: string;
}

class GenAI {
	private apiKeys: ApiKeys;
	constructor(apiKeys: ApiKeys) {
		this.apiKeys = apiKeys;
	}

	text(prompt: string) {
		if (!this.apiKeys.text) throw new Error('Text API KEY is missing');
		return generateText(prompt, this.apiKeys.text);
	}
	image(prompt: string) {
		if (!this.apiKeys.image) throw new Error('Image API KEY is missing');
		return generateImage(prompt, this.apiKeys.image);
	}
	audio(prompt: string) {
		if (!this.apiKeys.audio) throw new Error('Audio API KEY is missing');
		return generateAudio(prompt, this.apiKeys.audio);
	}
	music(prompt: string) {
		if (!this.apiKeys.music) throw new Error('Music API KEY is missing');
		return generateMusic(prompt, this.apiKeys.music);
	}
	video(prompt: string) {
		if (!this.apiKeys.video) throw new Error('Video API KEY is missing');
		return generateVideo(prompt, this.apiKeys.video);
	}
}

const genAI = (apiKeys: ApiKeys) => {
	return new GenAI(apiKeys);
};

export default genAI;
