const audioContext = AudioContext || (window as any).webkitAudioContext;

export interface AudioStream {
  stop(): void;
}

export interface PlaybackStream extends AudioStream {
  setEndedListener(onEnded: () => void): void;
}

type RecordingEndedListener = (buffer: Float32Array, duration: number) => void;

export interface RecordingStream extends AudioStream {
  setEndedListener(onEnded: RecordingEndedListener): void;
}

export function startRecording(bufferSize: number): Promise<RecordingStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.reject(new Error('Browser does not support audio recording'));
  }
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(
      (stream) => {
        let buffer: Float32Array = new Float32Array();
        const context = new audioContext();
        const streamNode = context.createMediaStreamSource(stream);
        const processorNode = context.createScriptProcessor(bufferSize, 1, 1);
        const audioTrack = stream.getAudioTracks()[0];
        let endedListener: RecordingEndedListener|null = null;
        audioTrack.addEventListener('ended', () => {
          // audio recording ended unexpectedly
          streamNode.disconnect();
          processorNode.disconnect();
          if (endedListener) {
            endedListener(buffer, buffer.length / context.sampleRate);
          }
          context.close();
        });
        processorNode.addEventListener('audioprocess', (ev) => {
          const channelData = ev.inputBuffer.getChannelData(0);
          const newBuffer = new Float32Array(buffer.length + channelData.length);
          newBuffer.set(buffer, 0);
          newBuffer.set(channelData, buffer.length);
          buffer = newBuffer;
        });
        streamNode.connect(processorNode);
        processorNode.connect(context.destination);
        resolve({
          stop: () => {
            // stop audio recording - does not trigger the "ended" event
            audioTrack.stop();
            streamNode.disconnect();
            processorNode.disconnect();
            if (endedListener) {
              endedListener(buffer, buffer.length / context.sampleRate);
            }
            context.close();
          },
          setEndedListener: (listener: RecordingEndedListener) => {
            endedListener = listener;
          }
        });
      },
      (err) => {
        console.warn('Error creating audio stream', err);
        reject(err);
      }
    );
  });
}

export function playBuffer(buffer: Float32Array, duration: number): Promise<PlaybackStream> {
  return new Promise<any>((resolve) => {
    const context = new audioContext();
    let endedListener: (() => void)|null = null;
    const source = context.createBufferSource();
    source.addEventListener('ended', () => {
      source.disconnect();
      context.close();
      if (endedListener) {
        endedListener();
      }
    });
    source.buffer = context.createBuffer(1, buffer.length, Math.round(buffer.length / duration));
    source.buffer.copyToChannel(buffer, 0);
    source.connect(context.destination);
    source.start();
    resolve({
      stop: () => {
        source.stop();
        source.disconnect();
        context.close();
        if (endedListener) {
          endedListener();
        }
      },
      setEndedListener: (listener: (() => void)) => {
        endedListener = listener;
      }
    });
  });
}
