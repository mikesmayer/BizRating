## FIXME_NISH Please add validation for phone_number.
## FIXED
class Website < Contact

  validates :info, format: /\A(https?:\/\/)?(www\.)?([A-Z0-9._%+-])+(\.[A-Z]{2,4}){1,2}\z/i

end