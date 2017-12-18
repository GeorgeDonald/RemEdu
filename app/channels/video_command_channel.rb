class VideoCommandChannel < ApplicationCable::Channel
  def subscribed
    stream_from "VideoCommandChannel_#{params[:room]}"
  end
  def receive(data)
    ActionCable.server.broadcast("VideoCommandChannel_#{params[:room]}", data)
  end
end
