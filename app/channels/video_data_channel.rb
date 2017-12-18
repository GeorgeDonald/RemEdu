require 'pry'
class VideoDataChannel < ApplicationCable::Channel
  def subscribed
    stream_from "VideoDataChannel_#{params[:room]}"
  end
  def receive(data)
    binding.pry
    VideoBuffer.create(video_data: data['video_data'])
    #ActionCable.server.broadcast("VideoDataChannel_#{params[:room]}", data)
  end
end
