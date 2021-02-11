<template>
<div>
<video id="myVideo" playsinline class="video-js vjs-default-skin">
<p class="vjs-no-js">
To view this video please enable JavaScript, or consider upgrading to a
web browser that
<a href="https://videojs.com/html5-video-support/" target="_blank">
supports HTML5 video.
</a>
</p>
</video>
<br />
<button
type="button"
class="btn btn-info"
@click.prevent="startRecording()"
v-bind:disabled="isStartRecording"
id="btnStart" 
>
Start Recording
</button>



</div>
</template>

<script>
import "video.js/dist/video-js.css";
import "videojs-record/dist/css/videojs.record.css";
import videojs from "video.js";

import "webrtc-adapter";
import RecordRTC from "recordrtc";

import Record from "videojs-record/dist/videojs.record.js";

import FFmpegjsEngine from "videojs-record/dist/plugins/videojs.record.ffmpegjs.js";
import firebase from "firebase";
import UniqueId from "vue-unique-id";
import Vue from "vue";
import db from '@/fb'

export default {
props: ["uploadUrl"],
data() {
return {
player: "",
retake: 0,
isSaveDisabled: true,
isStartRecording: false,
isRetakeDisabled: true,
submitText: "Submit",
options: {
controls: true,
bigPlayButton: false,
controlBar: {
deviceButton: false,
recordToggle: false,
pipToggle: false,
},
width: 500,
height: 300,
fluid: true,
plugins: {
record: {
pip: false,
audio: true,
video: true,
maxLength: 10,
debug: true,
},
},
},
};
},

mounted() {
this.player = videojs("myVideo", this.options, () => {
// print version information at startup
var msg =
"Using video.js " +
videojs.VERSION +
" with videojs-record " +
videojs.getPluginVersion("record") +
" and recordrtc " +
RecordRTC.version;
videojs.log(msg);
});

// error handling
this.player.on("deviceReady", () => {
this.player.record().start();
console.log("device ready:");
});

this.player.on("deviceError", () => {

console.log("device error:", this.player.deviceErrorCode);
this.$router.push('/');
});

this.player.on("error", (element, error) => {
console.error(error);
});

// user clicked the record button and started recording
this.player.on("startRecord", () => {
console.log("started recording!");

});

// user completed recording and stream is available
this.player.on("finishRecord", () => {
this.isSaveDisabled = false;
if (this.retake == 0) {
this.isRetakeDisabled = false;
}
// the blob object contains the recorded data that
// can be downloaded by the user, stored on server etc.
console.log("finished recording: ", this.player.recordedData);

this.isSaveDisabled = true;
this.isRetakeDisabled = false;

//again restart camera 
this.player.record().start();
console.log("device ready:");
//this.player.record().getDevice();
this.player.record().stopStream();//
var data = this.player.recordedData;
data.name = Math.floor(Math.random() * 100) + data.name; //append current date with file name

// let a=Vue.use(UniqueId);

var formData = new FormData();
formData.append("video", data, data.name);

this.submitText = "Uploading " + data.name;

console.log("uploading recording:", data.name);
this.player.record().stopDevice();

console.log("upload url", this.uploadUrl);






const storageRef = firebase
.storage()
.ref(data.name)
.put(data);
storageRef.on(
`state_changed`,
(snapshot) => {
this.uploadValue =
(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
},
(error) => {
console.log(error.message);
},
() => {
this.uploadValue = 100;
storageRef.snapshot.ref.getDownloadURL().then((url) => {
console.log("recording upload complete.and Url is", url); //you can save this url into your DB
this.submitText = "Upload Complete"; //after saving url you can notify success msg ad successfully video uploaded
  const project = { 
          title: url,
          content: "this.content",
          due: new Date().toLocaleString(),
          person: 'The Net Ninja',
          status: 'ongoing'
        }
        db.collection('projects').add(project).then(() => {
          this.loading = false
          this.dialog = false
          this.$emit('projectAdded')
        })

//this.$router.push('gallery');
});
}
);

});
},
methods: {
startRecording() {
this.isStartRecording = true;
this.player.record().getDevice();

},

submitVideo() {
this.isSaveDisabled = true;
this.isRetakeDisabled = false;
// let today=new Date();
// today=today.getTime(); //current date to millie sec

var data = this.player.recordedData;
data.name = Math.floor(Math.random() * 100) + data.name; //append current date with file name

// let a=Vue.use(UniqueId);

var formData = new FormData();
formData.append("video", data, data.name);

this.submitText = "Uploading " + data.name;

console.log("uploading recording:", data.name);
this.player.record().stopDevice();

console.log("upload url", this.uploadUrl);






const storageRef = firebase
.storage()
.ref(data.name)
.put(data);
storageRef.on(
`state_changed`,
(snapshot) => {
this.uploadValue =
(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
},
(error) => {
console.log(error.message);
},
() => {
this.uploadValue = 100;
storageRef.snapshot.ref.getDownloadURL().then((url) => {
console.log("recording upload complete.and Url is", url); //you can save this url into your DB
this.submitText = "Upload Complete"; //after saving url you can notify success msg ad successfully video uploaded
  const project = { 
          title: url,
          content: "this.content",
          due: new Date().toLocaleString(),
          person: 'The Net Ninja',
          status: 'ongoing'
        }
        db.collection('projects').add(project).then(() => {
          this.loading = false
          this.dialog = false
          this.$emit('projectAdded')
        })

this.$router.push('gallery');
});
}
);
},


retakeVideo() {
this.isSaveDisabled = true;
this.isRetakeDisabled = true;
this.retake += 1;
this.player.record().start();
},
},

beforeDestroy() {
if (this.player) {
this.player.dispose();
}
},
};
</script>