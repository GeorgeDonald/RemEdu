class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "ChatChannel_#{params[:room]}"
  end
  def receive(data)
    ActionCable.server.broadcast("ChatChannel_#{params[:room]}", data)
  end
end
