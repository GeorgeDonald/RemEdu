// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/
var cameraStream = null;
var mediaRecorder = null;
var mediaSource = null;
var sourceBuffer = null;
var encodeTimerId = undefined;
var playbackTimerId = undefined;
var eleVideo = null;
var playbackStopped = true;

function cameraInitialize(eleVideoId){
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  var options = {
    audio: true,
    video: {
      width: { min: 640, ideal: 1920, max: 3840 },
      height: { min: 480, ideal: 1080, max: 2160 }
    }
  };

  navigator.mediaDevices.getUserMedia(options)
  .then(function(stream) {
    cameraStream = stream;
    var video = document.querySelector(eleVideoId);
    if(video){
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
    }
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}

function cameraStart(){
  if(cameraStream === null){
    cameraInitialize('#live_local_video')
  } else {
    cameraStream.getTracks().forEach((t)=>t.stop());
    cameraStream = null;
  }
}

function onCodedData(data) {
  //console.log(`received ${data.data.size} byte data`);
  //jQuery.post('/video',e.data,()=>console.log("posted"));
  //console.log(mediaRecorder.mimeType);
  App.videoChannel.send({video_data: data.data});
  //sourceBuffer.appendBuffer(data);

  /*
  var fd = new FormData();
  fd.append('fname', 'test.webm');
  fd.append('data', data.data);
  $.ajax({
      type: 'POST',
      url: '/video',
      data: fd,
      processData: false,
      contentType: false
  }).done(function(data) {
  });
  */
}

function coderStart(){
  var types = ["video/webm;codecs=h264",
               "video/mp4",
               "audio/webm;codecs=opus",
               "video/webm",
               "audio/webm",
               "video/webm;codecs=vp8",
               "video/webm;codecs=daala",
               "video/mpeg"];

  // for (var i in types) {
  //   console.log( "Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :("));
  // }

  var options = {
    audioBitsPerSecond : 128000,
    videoBitsPerSecond : 2500000,
    mimeType : "video/webm;codecs=h264"
  }

  mediaRecorder = new MediaRecorder(cameraStream, options);
  mediaRecorder.ondataavailable = onCodedData;

  mediaRecorder.onerror = function(e) {
    console.log("Error: "+e.name+" -- "+e.message);
  }
  mediaRecorder.onstart = function(e) {
    //console.log("ok, started");
  }
  mediaRecorder.onstop = function(e) {
    //console.log("oop, stopped");
  }
  mediaRecorder.start(33);
}

function coderToggle(){
  if(!cameraStream)
    return;
  if(mediaRecorder === null){
    coderStart();
    encodeTimerId = setInterval(()=>{
      mediaRecorder.stop();
      App.videoChannel.send({video_data: 'end_of_video_segment'});
      if( playbackTimerId == undefined){
        playbackTimerId = setInterval(()=>{
          if(playbackStopped){
            playbackStopped = false;
            eleVideo.play();
          }
        }, 11);
      }
      mediaRecorder.start(33);
    }, 1000);
  }
  else {
    mediaRecorder.stop();
    mediaRecorder = null;
    clearInterval(videoTimerId);
    videoTimerId = undefined;
    clearInterval(playbackTimerId);
    playbackTimerId = undefined;
    playbackStopped = false;
  }
}

function mediaSourceCreate(){
  mediaSource = new MediaSource();
  var video = document.querySelector('#live_playback_video');
  video.src = window.URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', function(e) {
      sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs="vp8"');
      //sourceBuffer.appendBuffer(oneVideoWebMChunk);
      video.play();
    }, false);
}

window.onload=()=>{
  eleVideo = document.querySelector('#live_playback_video');
  eleVideo.src = '/video';
  eleVideo.addEventListener('ended',()=>{ playbackStopped = true; });

  initChatChannel();
  initVideoChannel();
  initVideoCommandChannel();
  //mediaSourceCreate();
  document.querySelector('#start_stop_live_local_video').addEventListener('click',
    event=>cameraStart());
  document.querySelector('#start_stop_live_playback_video').addEventListener('click',
    event=>coderToggle());
}
