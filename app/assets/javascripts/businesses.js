function Business (input) {
  this.new_business_form = input.newForm;
  this.statusLink = input.statusLink;
}

Business.prototype.initialize = function() {
  this.addStatus();
  this.bindEvents();
};


Business.prototype.addStatus = function() {
  this.statusLink.each(function(index, link) {
    link.text = ($(link).data('businessStatus') ? 'Disable' : "Enable");
  });
};

Business.prototype.bindEvents = function() {
  this.bindFormEvents();
  this.bindStatusEvent();
  // this.bindAutocomplete();
};

Business.prototype.bindFormEvents = function() {
    this.new_business_form.on('change', '#business_address_attributes_country', function() {
    $.ajax({
      url: "/admin/states/",
      dataType: 'json',
      type: 'get',
      data: {country: $(this).val()},
      success: function (data) {
        var options = [], option = null;
        $.each(data, function(index, value) {
          option = $('<option>', {
            value: value
          }).text(value);
          options.push(option)
        });
        $('#business_address_attributes_state').empty().append(options);
      },
    });
  });
};

Business.prototype.bindStatusEvent = function() {
  this.statusLink.on('click', function() {
  var linkdata = $(this).data(), 
  _this = this;
  confirmText = 'You want to' + (linkdata['businessStatus'] ? ' disable ' : ' enable ') + linkdata['businessName'];
  if (confirm(confirmText)) {
    $.ajax({
        url: "businesses/update_status",
        dataType: 'json',
        type: 'patch',
        data: linkdata,
        success: function (e) {
          $(_this).data('businessStatus', e[0]);
          _this.text = (e[0] ? 'Disable' : "Enable");
        },
        error: function (e) {
          alert($.parseJSON(e.responseText));
        }
      });
    }
  });
};

$( function() {
  var input = { 
    newForm: $("#new_business, .edit_business"),
    statusLink: $('td.btn-just a.btn.btn-xs.btn-danger.edit')
  },
  business = new Business(input);
  business.initialize();
});