## FIXME_NISH Rename this model as TimeSlot.
## FIXED
class TimeSlot < ActiveRecord::Base
  serialize :days
  
  WEEK_DAYS = { 1 => 'Sunday', 2 => 'Monday', 3 => 'Tuesday', 4 => 'Wednessday',
                5 => 'Thrusday', 6 => 'Friday', 7 => 'Saturday' }

  belongs_to :business, required: true

  validates_each :days do |record, attribute, value|
    record.errors.add(attribute, 'Invalid time') unless ((record.business.time_slots.where.not(id: record.id).pluck(:days).flatten & value).empty? && record[:to] < record[:from] )
  end

end