var portfolioSlider;
var page = 1;
var sliderPrev;
var content_id;
var comment_page = 1;
var rotated_image_url;
function sliderInitialize()
{

  portfolioSlider = new MasterSlider();
  portfolioSlider.setup('portfolioSlider' , {
       width:800,    // slider standard width
       // height:840,   // slider standard height
       autoHeight: true,
       space:5,
       preload: 1,
       view: "flow",
       hideLayers: true,
       instantStartLayers: true,
       controls : {
           arrows : {autohide:false},
           bullets : {}
           // more slider controls...
       }
       // more slider options goes here...
       // check slider options section in documentation for more options.
  });

  portfolioSlider.api.addEventListener(MSSliderEvent.CHANGE_START, function() {

    var sliderIndex = portfolioSlider.api.view.index;
    var lastSlide = portfolioSlider.api.count() - 1;
    // console.log(lastSlide);
    // console.log(sliderPrev);
    // console.log(sliderIndex);
    // 
    content_id = portfolioSlider.api.currentSlide.$bg_img.data('content-id');
    bottomLoad(content_id);

    if (lastSlide == sliderIndex)
    {
      console.log('fire pagination');
      sliderLoad(sliderPrev < sliderIndex);
    }
    

  });  

}

/**
 * initializes credits forms
 * 
 */
function initCredits()
{
  // typeahead
  $('.typeahead_credit').typeahead('destroy');
  var users = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: '/searchuser?search_term=%QUERY.json',
      wildcard: '%QUERY'
    }
  });
  // binds the selected user's group and changes the group in dropdown
  $('.typeahead_credit').bind('typeahead:select', function(ev, suggestion)
  {
    // console.log(suggestion.groups[0].name);
    $('#user_group').val(suggestion.groups[0].name);
  });
  // binds users in dropdown
  $('.typeahead_credit').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'username',
    display: 'username',
    source: users
  });
  // on submit of the tags, reload bottom bar
  $('.content-credit-form').submit(function() {
    $.ajax({
      url: 'contents/credit/'+content_id,
      method: 'POST',
      data: $(this).serialize(),
      beforeSend: function()
      {
        $('#tagger').hide();
        $('#tagger_loading').show();
      },
      success: function() {
        bottomLoad(content_id);
      }
    });
  });

  $('.discredit_form').submit(function() {
    $.ajax({
      url: '/contents/discredit/'+content_id,
      method: 'DELETE',
      data: $(this).serialize(),
      beforeSend: function()
      {
         $('.edit').hide();
         $('.discredit_form').hide();
      },
      success: function() {
        bottomLoad(content_id);
      }
    })
  });

}


function initTag()
{
  $('.typeahead').typeahead('destroy');
  var portfolios = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: '/searchtag?search_term=%QUERY.json',
    wildcard: '%QUERY'
  }
  });

  $('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'title',
    display: 'title',
    source: portfolios
  });
  
  $('.content-tag-form').submit(function() {
    var content_form_id = $(this).data('content_id');
    if (content_form_id == undefined)
    {
      content_form_id = '';
    }
    $.ajax({
      method: "POST",
      url: "/contents/assign/"+content_form_id,
      data: $(this).serialize(),
      beforeSend: function() {
        $('.edit').hide();
      },
      complete: function()
      {
        bottomLoad(content_id);
      }
    });
  });

  $('.content-tag-remove-form').submit(function() {
    var content_form_id = $(this).data('content_id');
    var portfolio_form_id = $(this).data('portfolio_id');
    

    $.ajax({
      method: "DELETE",
      url: "/contents/removetag/"+content_form_id+'/'+portfolio_form_id,
      data: $(this).serialize(),
      beforeSend: function() {
        $('.edit').hide();
      },
      complete: function () {
        $.ajax({
          method: "GET",
          url: "/contents/tagform/"+content_form_id,
          success: function (r) {
            bottomLoad(content_id);
        }});
      }
    });
  });

}

function rotateAndDelete()
{
  $('.ajax-delete-photo').click(function() {
    var c_id = $(this).data('content_id');
    $.ajax({
      method: 'DELETE',
      url : "/contents/" + c_id,
      method : "DELETE",
      beforeSend: function() {
        $('.edit').hide();
      },
      success : function(r) {
        window.location.replace('/slider?content_id='+c_id)
      },
    });

  });

  /**
   * ROTATABLE
   *
   * Allow user to rotate images by click cw and ccw buttons
   */
  $('.rotate-button').click(function() {

    var id = $(this).data('content-id');
    var degrees = $(this).data('degrees');

    console.log({
      id: id,
      degrees: degrees
    });

    $.ajax({
      method: 'PUT',
      url: '/contents/' + id + '/' + degrees,
      beforeSend: function() {
        $('.edit').hide();
      },
      success: function (response) {
        $('.edit').show();
        // append timestamp to breack cache
        rotated_image_url = String(response.s3_full_image_url + '?' + new Date().getTime());
        console.log(rotated_image_url);

        
        if (!_.isEmpty(getUrlParameter('content_id')))
        {
          var sliderpaginationurl = 'slider?page='+page+'&content_id='+getUrlParameter('content_id');
        }
        else if (!_.isEmpty(getUrlParameter('portfolio_id')))
        {
          var sliderpaginationurl = 'slider?page='+page+'&portfolio_id='+getUrlParameter('portfolio_id');
        }
        else
        {
          var sliderpaginationurl = 'slider?page='+page;
        }
        window.location.replace(sliderpaginationurl)
        
      }
    });
  });
}

function commentsInit(comment_page)
{
  content_id = portfolioSlider.api.currentSlide.$bg_img.data('content-id');
  $.ajax({
    method: 'GET',
    url: '/comments?commentable_type=Content&commentable_id='+content_id+'&page='+comment_page,
    beforeSend: function() {
      $('#loadmorecomments').hide();
    },
    success: function (response) {
      if (_.isEmpty(response))
      {
        $('#loadmorecomments').hide();
      }
      else{
        $('#comments_ul').append(response);
        commentsFormInit();
        $('#loadmorecomments').show();
      }

    },
    error: function(response)
    {
      console.log(response);
      $('#loadmorecomments').hide();
    }
  });
  commentsFormInit();
}

function topLoad(content_id)
{
  $.get('slider/top/'+content_id, function(response, status, xhr) {
    $('.image-tools').empty();
    $('.image-tools').append(response);
    rotateAndDelete();
  });
}
function addThisInit()
{
  var addthis_config = addthis_config||{};
  addthis_config.pubid = 'ra-557f375a6cbf081f';
  $.getScript( "https://s7.addthis.com/js/300/addthis_widget.js#domready=1");
}

function bottomLoad(content_id)
{
  $('#bottombar').empty();
  $.get('slider/bottom/'+content_id, function(response, status, xhr) {
    $('#bottombar').append(response);

    $('#edit').click(function() {
      $(this).hide();
      $('.edit').show();
      $('#tagger').show();
    });

    topLoad(content_id);
    commentsInit(1);
    initCredits();
    initTag();

    $('#loadmorecomments').click(function() {
      comment_page++;
      commentsInit(comment_page);
    });

    $('.editable').editable({
      url: $(this).data('url'),
      ajaxOptions: {
        type: 'PUT',
          dataType: 'json'
      },
      pk: $(this).data('pk')
    });
    // readmore
    $('.readmore').readmore({
      collapsedHeight: 90,
      speed: 75,
      moreLink: '<a href="#">Read more</a>',
      lessLink: '<a href="#">Read less</a>',
    });
    
    // tagcloud
    $('.tagcloud').html(function() {
      var cloud = new TagCloud($(this).html());
      // console.log(cloud);
      return cloud.linkify();
    });

    addThisInit();

  });

}

function sliderLoad()
{

  page++;

  if (!_.isEmpty(getUrlParameter('user_id')))
  {
    if (!_.isEmpty(getUrlParameter('content_id')) && !_.isEmpty(getUrlParameter('portfolio_id')))
    {
      var sliderpaginationurl = 'slider?page='+page+'&content_id='+getUrlParameter('content_id')+'&portfolio_id='+getUrlParameter('portfolio_id')+"&user_id="+getUrlParameter('user_id');
    }
    else if (!_.isEmpty(getUrlParameter('content_id')))
    {
      var sliderpaginationurl = 'slider?page='+page+'&content_id='+getUrlParameter('content_id')+"&user_id="+getUrlParameter('user_id');
    }
    else if (!_.isEmpty(getUrlParameter('portfolio_id')))
    {
      var sliderpaginationurl = 'slider?page='+page+'&portfolio_id='+getUrlParameter('portfolio_id')+"&user_id="+getUrlParameter('user_id');
    }
    else
    {
      var sliderpaginationurl = 'slider?page='+page+"&user_id="+getUrlParameter('user_id');
    }
  }
  else
  {
    if (!_.isEmpty(getUrlParameter('content_id')) && !_.isEmpty(getUrlParameter('portfolio_id')))
    {
      var sliderpaginationurl = 'slider?page='+page+'&content_id='+getUrlParameter('content_id')+'&portfolio_id='+getUrlParameter('portfolio_id');
    } 
    else if (!_.isEmpty(getUrlParameter('content_id')))
    {
      var sliderpaginationurl = 'slider?page='+page+'&content_id='+getUrlParameter('content_id');
    }
    else if (!_.isEmpty(getUrlParameter('portfolio_id')))
    {
      var sliderpaginationurl = 'slider?page='+page+'&portfolio_id='+getUrlParameter('portfolio_id');
    }
    else
    {
      var sliderpaginationurl = 'slider?page='+page;
    }
  }

  portfolioSlider.api.destroy();
  $.get(sliderpaginationurl, function(response, status, xhr) {

    if (response == "")
    {
      page = 1;
      if (!_.isEmpty(getUrlParameter('content_id')))
      {
        var sliderpaginationurl = 'slider?page='+page+'&content_id='+getUrlParameter('content_id');
      }
      else if (!_.isEmpty(getUrlParameter('portfolio_id')))
      {
        var sliderpaginationurl = 'slider?page='+page+'&portfolio_id='+getUrlParameter('portfolio_id');
      }
      else
      {
        var sliderpaginationurl = 'slider?page='+page;
      }
      $.get(sliderpaginationurl, function(response, status, xhr) {
        $('#portfolioSliderContainer').append('<div class="master-slider ms-skin-default" id="portfolioSlider"></div>');
        $('#portfolioSlider').append(response);
        sliderInitialize();
      });
    }
    else
    {
      $('#portfolioSliderContainer').append('<div class="master-slider ms-skin-default" id="portfolioSlider"></div>');
      $('#portfolioSlider').append(response);
      sliderInitialize();
    }
  });
}



$(document).ready(function() {

  /*Portfolio Single Slider
  ************************************************/
    sliderInitialize();

    // only load once
    $('.left-arrow').click(function() {
      sliderPrev = portfolioSlider.api.view.index;
      portfolioSlider.api.previous();
    });

    $('.right-arrow').click(function() {
      sliderPrev = portfolioSlider.api.view.index;
      portfolioSlider.api.next();
    });
    
    $('.page').css('min-height', $(window).height());
});



