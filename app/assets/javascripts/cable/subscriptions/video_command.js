function initVideoCommandChannel(){
  App.videoCommandChannel = App.cable.subscriptions.create(
    { channel: "VideoCommandChannel", room: "Best Room" });
    {
      received: (data) =>
      {
      }
  });
}
