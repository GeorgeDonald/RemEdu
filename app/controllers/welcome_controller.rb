class WelcomeController < ApplicationController
  include ActionController::Live
  def index
  end
  def video
    bufs = VideoBuffer.order(:created_at);
    if(!bufs.empty?)
      #response.headers['Content-Range'] = "bytes #{file.pos}-#{current_pos}/#{file.size}"
      #response.headers['Content-Length'] = "1024"
      response.headers['Content-Type'] = 'video/mp4'
      #response.headers['Accept-Ranges'] = 'bytes'

      bufs.each do |b|
        b.destroy
        if b.video_data === 'end_of_video_segment'
          break
        else
          response.stream.write( b.video_data )
        end
      end
    end
  ensure
    response.stream.close
  end
end
