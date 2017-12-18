class CreateVideoBuffers < ActiveRecord::Migration[5.1]
  def change
    create_table :video_buffers do |t|
      t.binary :video_data
      t.integer :user_id

      t.timestamps
    end
  end
end
