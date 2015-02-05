module BusinessesHelper
  def step(step_input)
    "step#{ step_input }"
  end

  def add_error_class(field_name)
    @business.errors[field_name].empty? ? '' : 'has-error'
  end

  #FIXME_AB: method returning boolean value. should be ? method
  def day_checked(day, object)
    #FIXME_AB: use object.persisted? 
    ((!object.new_record?) && (object.days.include? day.to_s))
  end

end
