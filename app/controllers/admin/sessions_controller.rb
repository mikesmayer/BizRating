class Admin::SessionsController < Devise::SessionsController
  before_action :load_user, only: :create

  layout 'admin'

  def create
    ## FIXME_NISH Refactor this code.
    if !@user
      flash[:alert] = "Invalid email or password"
      redirect_to :new_admin_session
    elsif !@user.valid_password?(params[:user][:password])
      flash[:alert] = 'invalid password'
    redirect_to :new_admin_session
    else
      sign_in(:user, @user)
      redirect_to :businesses
    end
  end

  private
  def load_user
    ## FIXME_NISH Please check if the user is present or not.
    @user = User.find_by(email: params[:user][:email])
  end
end
