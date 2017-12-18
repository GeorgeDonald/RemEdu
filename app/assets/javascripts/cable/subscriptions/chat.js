
function initChatChannel(){
  App.chatChannel = App.cable.subscriptions.create(
    { channel: "ChatChannel", room: "Best Room" },
    {
      received: (data) =>
      {
        var ele=document.createElement('div');
        ele.classList.add('chatitem');
        var ele2=document.createElement('div');
        ele2.classList.add('chatitem_text');
        ele2.innerText=data.body;
        ele.appendChild(ele2);
        document.querySelector("#chatitems").appendChild(ele);
      }
  });

  document.querySelector("#posttext").addEventListener('click',event=>
    {
      App.chatChannel.send({ body: document.querySelector("#chattext").value });
    });
}
