class Admin::CategoriesController < Admin::BaseController

  before_action :load_category, only: [:update, :update_status]
  before_action :set_status, only: :update_status
  def index
    ## FIXME_NISH Please don't run the query in views.
    @categories = Category.order(:position).load
  end

  def create
    @category = Category.new(category_params)
    if @category.save
      flash[:notice] = 'Created Successfully'
    else
      ## FIXME_NISH Please use to_sentence.
      ## FIXME_NISH Please use alert instead of all.
      flash[:alert] = @category.errors.full_messages.to_sentence
    end
    redirect_to admin_categories_path
  end

  def update
    if @category.update(category_params)
      flash[:notice] = 'Updated Successfully'
    else
      ## FIXME_NISH Please use to_sentence.
      ## FIXME_NISH Please use alert instead of notice.
      flash[:alert] = @category.errors.full_messages.to_sentence
    end
    redirect_to admin_categories_path
  end

  def update_status
    ## FIXME_NISH Refactor this code.
    if @category.save
      render json: [@category.status]
    else
      render json: @category.errors, status: :unprocessable_entity
    end
  end

  def update_position
    ## FIXME_NISH Please refactor this.
    params[:position].each_with_index do |id, index|
      Category.find_by(id: id).update_columns(position: index)
    end
    render json: []
  end

  private

    def set_status
      ## FIXME_NISH Move this to model.
      @category.status = params[:categoryStatus] == 'true' ? false : true
    end

    def load_category
      ## FIXME_NISH Please check that the category is present or not.
      @category = Category.find_by(id: params[:id])
      unless @category
        flash[:alert] = 'No category'
        redirect_to admin_categories_path
      end
    end

    def category_params
      params.require(:category).permit(:name, :image)
    end

end
