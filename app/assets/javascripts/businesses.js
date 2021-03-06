// FIXME_AB: Lets use JS as less as we can
function Business (input) {
  this.businessForms = input.forms;
  this.statusLink = input.statusLink;
  this.searchForm = input.searchForm;
  this.countryField = input.countryField;
  this.countryCode = null;
  this.stateIndexUrl = input.stateIndexUrl;
  this.updateStatusUrl = input.updateStatusUrl;
}

Business.prototype.initialize = function() {
  $('#loader').hide();
  this.addStatus();
  this.bindEvents();
};

Business.prototype.addStatus = function() {
  this.statusLink.each(function(index, link) {
    link.text = ($(link).data('businessStatus') ? 'Enable' : "Disable");
  });
};

Business.prototype.bindEvents = function() {
  this.bindFormEvents();
  this.bindStatusEvent();
  this.bindSearchEvent();
};

Business.prototype.setCountryValue = function() {
  this.countryCode = this.countryField.find('option:selected')
            .data('code').toLowerCase();
};

Business.prototype.bindSearchEvent = function() {
  var _this = this;
  this.searchForm.on('change', 'select', function() {
    _this.searchForm.submit();
  });
};

Business.prototype.bindFormEvents = function() {
  var _this = this;
  this.countryField.on('change', function() {
    $.ajax({
      // FIXME_AB: Lets not hard code urls in js. Use data attributes
      // Fixed
      url: _this.stateIndexUrl,
      dataType: 'json',
      type: 'get',
      data: {country: $(this).val()},
      // FIXME_AB: Whenever you are sending ajax request use spinner to show user that something is in progress
      // Fixed
      beforeSend: function() {
        $('#loader').show();
      },
      complete: function(){
        $('#loader').hide();
      },
      success: function (data) {
        var options = [], option = null,
          selectField = $('#business_address_attributes_state');
        if (data.length == 0) {
          var inputField = $('<input>', {
            name: selectField.attr('name'),
            type: 'text',
            class: selectField.attr('class'),
            id: selectField.attr('id')
          });
          selectField.replaceWith(inputField);
        } else {
          $.each(data, function(index, value) {
            option = $('<option>', {
              value: value
            }).text(value);
            options.push(option)
          });
          options.unshift($('<option>').text('Select State'));
          var newSelectField = $('<select>', {
            name: selectField.attr('name'),
            type: 'text',
            class: selectField.attr('class'),
            id: selectField.attr('id')
          });
          newSelectField.append(options);
          selectField.replaceWith(newSelectField);
        }
      },
    });
  });
};

Business.prototype.bindStatusEvent = function() {
  var _that = this;
  this.statusLink.on('click', function(e) {
    e.preventDefault();
  var linkdata = $(this).data(),
  _this = this;
  confirmText = 'Do you want to' + (linkdata['businessStatus'] ? ' enable ' : ' disable ') + linkdata['businessName'] + " ?";
  if (confirm(confirmText)) {
    $.ajax({
        url: _that.updateStatusUrl,
        dataType: 'json',
        type: 'patch',
        data: linkdata,
        success: function (e) {
          $(_this).data('businessStatus', !e[0]);
          _this.text = (e[0] ? 'Disable' : "Enable");
          $(_this).toggleClass('btn-danger btn-success');
        },
        beforeSend: function() {
        $('#loader').show();
        },
        complete: function(){
          $('#loader').hide();
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
    forms: $("#new_business, .edit_business"),
    statusLink: $('td a.btn.btn-xs.edit'),
    searchForm: $('#business_search'),
    countryField: $('#business_address_attributes_country'),
    stateIndexUrl: "/admin/states/",
    updateStatusUrl: "businesses/update_status"
  },
  business = new Business(input);
  business.initialize();
});
