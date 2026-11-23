import type { Drawing, PaletteSet, Stage } from '../types';

type EncodedStage = Omit<Stage, 'originalBlob' | 'flatBlob'> & {
	originalBlob: string;
	flatBlob: string;
	originalType: string;
	flatType: string;
};

function encodeBlob(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = String(reader.result);
			const comma = result.indexOf(',');
			if (comma < 0) reject(new Error('Could not encode an image for export.'));
			else resolve(result.slice(comma + 1));
		};
		reader.onerror = () => reject(new Error('Could not read an image for export.'));
		reader.readAsDataURL(blob);
	});
}

export async function exportDrawingData(
	drawing: Drawing,
	stages: Stage[],
	paletteSet?: PaletteSet
): Promise<Blob> {
	const encodedStages: EncodedStage[] = await Promise.all(
		stages.map(async (stage) => ({
			...stage,
			originalBlob: await encodeBlob(stage.originalBlob),
			flatBlob: await encodeBlob(stage.flatBlob),
			originalType: stage.originalBlob.type,
			flatType: stage.flatBlob.type
		}))
	);

	return new Blob(
		[
			JSON.stringify(
				{
					format: 'skepanion-drawing-v1',
					exportedAt: Date.now(),
					drawing,
					stages: encodedStages,
					paletteSet
				},
				null,
				2
			)
		],
		{ type: 'application/json' }
	);
}
