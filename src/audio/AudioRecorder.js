import React from 'react';
import Fab from '@material-ui/core/Fab';
import PlayIcon from '@material-ui/icons/PlayArrowOutlined';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import './AudioRecorder.css';

/**
 * This component allows audio recording and playback.
 *
 * - Shows a UI to record audio, stop recording, save it to a server.
 */
class AudioRecorder extends React.Component {
  state = {
    isRecording: false,
    isPlaying: false,
    recordedBlob: null,
  }

  render() {
    const playStyle = {border: this.isPlaying ? '1px solid black' : ''};
    const record = <Fab aria-label="record">
        <MicIcon onClick={() => this.startRecording_()}/>
      </Fab>;
    const stopRecording = <Fab aria-label="stop recording" className="recording">
        <StopIcon onClick={() => this.stopRecording_()}/>
      </Fab>;
    const play = <Fab aria-label="play" className={this.state.isPlaying ? 'playing' : ''}>
        <PlayIcon onClick={() => this.playback_()}/>
      </Fab>;

    return <div className="audio-buttons">
        {this.state.isRecording ? stopRecording : record}
        {(this.state.recordedBlob || this.props.audioUrl) && play}
    </div>;
  }

  toggleRecording_() {
    if (this.state.isRecording) {
      this.stopRecording_();
    } else {
      this.startRecording_();
    }
  }

  async startRecording_() {
    // Ensure that a microphone is detected.
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.info(
        'Unable to check if there are microphones on this device; ' +
        'enumerateDevices() not supported.');
    } else {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');
      if (!hasMic) {
        throw new Error(`No microphone on this device.`);
      }
    }

    if (this.state.isRecording) {
      console.info(`Can't start recording: already recording.`);
      return;
    }
    // Start a local stream.
    this.stream = await getLocalStream();

    if (!this.stream) {
      throw new Error(`Failed to get local audio stream.`);
    }

    // Save it using MediaRecorder.
    this.mediaRecorder = getMediaRecorder(this.stream);
    this.mediaRecorder.addEventListener('dataavailable', (e: {data: Blob}) => {
      this.onRecorderDataAvailable_(e);
    });
    this.mediaRecorder.addEventListener('start', () => {
      this.onRecorderStart_();
    });
    this.mediaRecorder.addEventListener('stop', () => {
      this.onRecorderStop_();
    });
    this.mediaRecorder.start();

    this.setState({isRecording: true});
  }

  async stopRecording_() {
    if (!this.state.isRecording) {
      console.info(`Can't stop recording: not recording yet.`);
      return;
    }
    // Stop the media recorder.
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }

    // Stop the stream tracks.
    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        track.stop();
      }
      this.stream = null;
    }

    this.setState({isRecording: false});
  }

  onRecorderDataAvailable_(blob) {
    console.log('onRecorderDataAvailable', blob);
    this.setState({recordedBlob: blob});
    this.props.onSavedAudio(blob);
  }

  onRecorderStart_() {
    console.log('onRecorderStart_');
  }

  onRecorderStop_() {
    console.log('onRecorderStop_');
  }

  playback_() {
    // Play the blob, fallback to audioUrl, otherwise error out.
    if (this.state.recordedBlob) {
      this.playRecording_();
    } else if (this.props.audioUrl) {
      this.playAudio_(this.props.audioUrl);
    } else {
      console.error('No recorded blob and no audioUrl found.');
    }
  }

  playRecording_() {
    if (!this.state.recordedBlob) {
      console.error('Nothing to play.');
      return;
    }
    const url = URL.createObjectURL(this.state.recordedBlob.data);
    this.playAudio_(url);
  }

  playAudio_(url) {
    const audio = new Audio();
    audio.src = url;
    this.setState({isPlaying: true});
    audio.addEventListener('ended', () => {
      this.setState({isPlaying: false});
    });
    audio.play();
  }
}

async function getLocalStream() {
  const mediaConstraints = {audio: true, video: false};
  try {
    const stream =
      await navigator.mediaDevices.getUserMedia(mediaConstraints);
    return stream;
  } catch (e) {
    console.log('getUserMedia exception', e);
  }
  return null;
}

function getMediaRecorder(stream) {
  const options = {mimeType: 'audio/webm'};
  return new MediaRecorder(stream, options);
}

export default AudioRecorder;
