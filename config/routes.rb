Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  root 'welcome#index'
  get 'welcome/index'

  get '/video', to: 'welcome#video'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
