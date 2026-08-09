import { mkdir, writeFile } from "node:fs/promises";

const contract = (
  await import("../src/production-contract.json", { with: { type: "json" } })
).default;

const { sampleRate, channels, fileName } = contract.audio;
const sampleCount = sampleRate * contract.durationInSeconds;
const bytesPerSample = 2;
const dataSize = sampleCount * channels * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
buffer.writeUInt16LE(channels * bytesPerSample, 32);
buffer.writeUInt16LE(bytesPerSample * 8, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

const twoPi = Math.PI * 2;
const tones = [55, 82.5, 110, 165];

for (let index = 0; index < sampleCount; index += 1) {
  const time = index / sampleRate;
  const beat = time % 6;
  const fadeIn = Math.min(1, time / 2.5);
  const fadeOut = Math.min(1, (contract.durationInSeconds - time) / 2.5);
  const envelope = Math.max(0, Math.min(fadeIn, fadeOut));
  const pulse = 0.58 + 0.42 * Math.max(0, Math.sin((beat / 6) * Math.PI)) ** 2;
  const shimmer = Math.sin(twoPi * tones[3] * time) * 0.055;
  const body =
    Math.sin(twoPi * tones[0] * time) * 0.42 +
    Math.sin(twoPi * tones[1] * time) * 0.23 +
    Math.sin(twoPi * tones[2] * time) * 0.12;
  const sample = Math.max(
    -1,
    Math.min(1, (body + shimmer) * pulse * envelope * 0.34),
  );
  buffer.writeInt16LE(Math.round(sample * 32767), 44 + index * bytesPerSample);
}

const outputDirectory = new URL("../generated/", import.meta.url);
await mkdir(outputDirectory, { recursive: true });
await writeFile(new URL(fileName, outputDirectory), buffer);
console.info(`Generated deterministic audio: generated/${fileName}`);
