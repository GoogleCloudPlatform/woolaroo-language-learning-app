import React from "react";
import Fab from "@material-ui/core/Fab";
import PlayIcon from "@material-ui/icons/PlayArrowOutlined";
import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/StopOutlined";
import "./AudioRecorder.scss";
import ProgressRing from "./ProgressRing";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

/**
 * This component allows audio recording and playback.
 *
 * - Shows a UI to record audio, stop recording, save it to a server.
 */

const maximumSecondsToRecord = 5;
let recordingTimer;

class AudioRecorder extends React.Component {
  state = {
    isRecording: false,
    isPlaying: false,
    recordedBlob: null,
    recordingProgress: 0, //this denotes the percentage displayed on the inner circle of recording
    isError: false
  };

  render() {
    const record = (
      <Fab
        aria-label="record"
        className="record"
        onClick={() => this.startRecording_()}
      >
        <MicIcon className="icons" />
      </Fab>
    );
    const stopRecording = (
      <div>
        <Fab
          aria-label="stop recording"
          className="recording"
          onClick={() => this.stopRecording_()}
        >
          <StopIcon className="icons" />
        </Fab>
        <div className="progress-ring">
          <ProgressRing
            radius={32}
            stroke={4}
            progress={this.state.recordingProgress}
          />
        </div>
      </div>
    );
    const play = (
      <Fab
        aria-label="play"
        className={this.state.isPlaying ? "playing" : ""}
        onClick={() => this.playback_()}
      >
        <PlayIcon className="icons" />
      </Fab>
    );

    return (
      <div className="audio-buttons">
        {this.showAlertForErrorMessages()}
        {this.props.disableRecord
          ? null
          : this.state.isRecording
          ? stopRecording
          : record}
        {(this.state.recordedBlob || this.props.audioUrl) && play}
      </div>
    );
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
        "Unable to check if there are microphones on this device; " +
          "enumerateDevices() not supported."
      );
    } else {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === "audioinput");
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
      //TODO: Provide a viewable alert here
      this.setState({ isError: true });
      return;
      //throw new Error(`Failed to get local audio stream.`);
    }

    // Save it using MediaRecorder.
    this.mediaRecorder = getMediaRecorder(this.stream);
    this.mediaRecorder.addEventListener(
      "dataavailable",
      (e: { data: Blob }) => {
        this.onRecorderDataAvailable_(e);
      }
    );
    this.mediaRecorder.addEventListener("start", () => {
      this.onRecorderStart_();
    });
    this.mediaRecorder.addEventListener("stop", () => {
      this.onRecorderStop_();
    });
    this.mediaRecorder.start();

    this.setState({ isRecording: true });

    this.startTimer();
  }

  startTimer() {
    //Scope to access class methods from within
    let _this = this;

    let secondsElapsed = 0;

    recordingTimer = setInterval(() => {
      secondsElapsed += 0.1;

      let recordingProgress = (secondsElapsed / maximumSecondsToRecord) * 100;

      _this.setState({ recordingProgress: recordingProgress });

      if (secondsElapsed >= maximumSecondsToRecord) {
        _this.stopRecording_();
      }
    }, 100);
  }

  closeDialog = () => {
    this.setState({ isError: false });
  };

  showAlertForErrorMessages() {
    return (
      <Dialog open={this.state.isError} onClose={this.closeDialog}>
        <DialogTitle>Microphone Access Denied</DialogTitle>
        <DialogContent>Failed to get local audio stream.</DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
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

    clearInterval(recordingTimer);

    this.setState({
      isRecording: false,
      recordingProgress: 0
    });
  }

  onRecorderDataAvailable_(blob) {
    console.log("onRecorderDataAvailable", blob);
    this.setState({ recordedBlob: blob });
    this.props.onSavedAudio(blob);
  }

  onRecorderStart_() {
    console.log("onRecorderStart_");
  }

  onRecorderStop_() {
    console.log("onRecorderStop_");
  }

  playback_() {
    // Play the blob, fallback to audioUrl, otherwise error out.
    if (this.state.recordedBlob) {
      this.playRecording_();
    } else if (this.props.audioUrl) {
      this.playAudio_(this.props.audioUrl);
    } else {
      console.error("No recorded blob and no audioUrl found.");
    }
  }

  playRecording_() {
    if (!this.state.recordedBlob) {
      console.error("Nothing to play.");
      return;
    }
    const url = URL.createObjectURL(this.state.recordedBlob.data);
    this.playAudio_(url);
  }

  playAudio_(url) {
    const audio = new Audio();
    audio.src = url;
    this.setState({ isPlaying: true });
    audio.addEventListener("ended", () => {
      this.setState({ isPlaying: false });
    });
    audio.play();
  }
}

async function getLocalStream() {
  const mediaConstraints = { audio: true, video: false };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    return stream;
  } catch (e) {
    console.log("getUserMedia exception", e);
  }
  return null;
}

function getMediaRecorder(stream) {
  const options = { mimeType: "audio/webm" };
  return new MediaRecorder(stream, options);
}

export default AudioRecorder;
