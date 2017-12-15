module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :always

    def connect
      self.always = true
    end
  end
end
