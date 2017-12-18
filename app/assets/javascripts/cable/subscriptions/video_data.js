
function initVideoChannel(){
  App.videoChannel = App.cable.subscriptions.create(
    { channel: "VideoDataChannel", room: "Best Room" },
    {
      received: (data) =>
      {
      }
  });
}
