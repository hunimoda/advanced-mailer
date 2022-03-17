import { uploadImageByDataUrl } from "../../../Firebase/storage";

export function generateLetterId() {
	let id = "";
	const PUSH_CHARS =
		"-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < 22; i++) {
		const randIdx = Math.floor(Math.random() * 64);

		id += PUSH_CHARS.charAt(randIdx);
	}

	return id;
}

async function convertDataUrlToDownloadUrl(value, letterId) {
	if (value?.startsWith("data:image/")) {
		return await uploadImageByDataUrl(value, letterId);
	}

	return value;
}

export async function processLetterBeforeSave(letter, id) {
	const letterCopy = JSON.parse(JSON.stringify(letter));

	letterCopy.canvas = await convertDataUrlToDownloadUrl(letterCopy.canvas, id);

	letterCopy.backgroundImage = await convertDataUrlToDownloadUrl(
		letterCopy.backgroundImage,
		id
	);
	letterCopy.sheet.backgroundImage = await convertDataUrlToDownloadUrl(
		letterCopy.sheet.backgroundImage,
		id
	);

	for (const id in letterCopy.objects) {
		const { type, value } = letterCopy.objects[id];

		if (type === "image") {
			letterCopy.objects[id].value = await convertDataUrlToDownloadUrl(
				value,
				id
			);
		}
	}

	return letterCopy;
}
