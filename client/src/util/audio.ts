/// <reference types="@types/dom-mediacapture-record" />

export interface AudioStream {
  stop(): void;
}

export interface PlaybackStream extends AudioStream {
  onended: (() => void)|null;
  getDuration(): number;
  getCurrentTime(): number;
}

type RecordingEndedListener = (buffer: Blob) => void;

export interface RecordingStream extends AudioStream {
  onended: RecordingEndedListener|null;
}

function getSupportedMimeType(mimeTypes: string[]): string|null {
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return null;
}

export async function startRecording(bufferSize: number, mimeTypes?: string[]): Promise<RecordingStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser does not support audio recording');
  }
  return new Promise<RecordingStream>((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(
      (stream) => {
        if (typeof(MediaRecorder) !== 'undefined') {
          console.log('Starting MediaRecorder recording');
          startMediaRecorderRecording(stream, bufferSize, mimeTypes).then(
            str => resolve(str),
            ex => reject(ex)
          );
        } else {
          console.log('Starting AudioContext recording');
          startAudioContextRecording(stream, bufferSize).then(
            str => resolve(str),
            ex => reject(ex)
          );
        }
      },
      (err) => {
        console.warn('Error creating audio stream', err);
        reject(err);
      }
    );
  });
}

function startMediaRecorderRecording(stream: MediaStream, bufferSize: number, mimeTypes?: string[]): Promise<RecordingStream> {
  const options: MediaRecorderOptions = {};
  if (mimeTypes) {
    const type = getSupportedMimeType(mimeTypes);
    if (type) {
      options.mimeType = type;
    } else {
      console.warn('No supported mime type found - using default type');
    }
  }
  const recorder = new MediaRecorder(stream, options);
  const recordingStream: RecordingStream = {
    onended: null,
    stop: () => {
      recorder.stop();
    }
  };
  recorder.ondataavailable = (dataEvent: BlobEvent) => {
    console.log('Recording data available');
    if (recordingStream.onended) {
      recordingStream.onended(dataEvent.data);
    }
  };
  recorder.onstop = () => {
    console.log('Recording stopped');
  };
  return new Promise<RecordingStream>((resolve, reject) => {
    recorder.onstart = () => {
      console.log('Recording started');
      resolve(recordingStream);
    };
    recorder.onerror = (ev) => {
      console.warn('Recording error', ev.error);
      reject(ev.error);
    };
    recorder.start();
  });
}

async function startAudioContextRecording(stream: MediaStream, bufferSize: number): Promise<RecordingStream> {
  const audioContextType = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!audioContextType) {
    return Promise.reject(new Error('AudioContext not supported'));
  }
  const context = new audioContextType();
  const sampleRate = context.sampleRate;
  const streamNode = context.createMediaStreamSource(stream);
  const processorNode = context.createScriptProcessor(bufferSize, 1, 1);
  const recordingStream: RecordingStream = {
    onended: null,
    stop: () => {
      if (stream) {
        stream.getAudioTracks()[0].stop();
      }
      if (recordingStream.onended) {
        recordingStream.onended(audioBuffersToWAV(buffer, sampleRate));
      }
    }
  };
  let buffer: Float32Array = new Float32Array();
  streamNode.connect(processorNode);
  processorNode.connect(context.destination);
  stream.getAudioTracks()[0].onended = () => {
    streamNode.disconnect();
    processorNode.disconnect();
    if (recordingStream.onended) {
      recordingStream.onended(audioBuffersToWAV(buffer, sampleRate));
    }
  };
  processorNode.addEventListener('audioprocess', (ev: AudioProcessingEvent) => {
    const samples = ev.inputBuffer.getChannelData(0);
    const tmp = new Float32Array(buffer.length + samples.length);
    tmp.set(buffer, 0);
    tmp.set(samples, buffer.length);
    buffer = tmp;
  });
  return recordingStream;
}

function audioBuffersToWAV(sampleBuffer: Float32Array, sampleRate: number): Blob {
  const sampleCount = sampleBuffer.length;
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  writeWAVString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 32 + sampleCount * 2, true);
  writeWAVString(view, 8, 'WAVE');
  writeWAVString(view, 12, 'fmt ');
  // chunk length
  view.setUint32(16, 16, true);
  // sample format
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate
  view.setUint32(28, sampleRate * 4, true);
  // block align
  view.setUint16(32, 4, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeWAVString(view, 36, 'data');
  // data length
  view.setUint32(40, sampleCount * 2, true);
  // data
  let offset = 44;
  for (const spl of sampleBuffer) {
    const s = Math.max(-1, Math.min(1, spl));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

function writeWAVString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function play(buffer: Blob): Promise<PlaybackStream> {
  return new Promise<any>((resolve, reject) => {
    const audio = new Audio();
    const stream: PlaybackStream = {
      onended: null,
      getCurrentTime: () => {
        return audio.currentTime;
      },
      getDuration: () => {
        return audio.duration;
      },
      stop: () => {
        audio.pause();
        if (stream.onended) {
          stream.onended();
        }
    }};
    audio.src = URL.createObjectURL(buffer);
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audio.src);
      if (stream.onended) {
        stream.onended();
      }
    });
    audio.play().then(
      () => resolve(stream),
      reject
    );
  });
}
