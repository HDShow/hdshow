/**
 * Created by gaojin on 9/16/16.
 */
$(function () {

    // tooltip image over every image
    imagePreview();

    // set count of selected images
    set_selected_count();

    // save image order via ajax
    $('#order-image-save').on('click', function () {
        $(this).html('<span class="fa fa-spinner fa-spin"></span> Saving ...').addClass('disabled');
        
        var order_images = {}; // image_id => new-name
        var type_images = {}; // image_id => room_type
        var sort_images = {}; // image_id => sort_index
        $('.order-thumb').each(function (index) {
            var image_id = $(this).data('id');
            order_images[image_id] = $(this).find('input[name=changed_name]').val();
            sort_images[image_id] = $(this).find('input[name=sort_id]').val();
            type_images[image_id] = $(this).find('select').val();
        })

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var order_id = $('#order-id').val();
        var data = {order_images: order_images, type_images:type_images, order_id: order_id, sort_order: sort_images};
        $.ajax({
            type: 'POST',
            url: ajax_url_save_image_order,
            data: data,
            success: function(result)
            {
                $('#order-image-save').html('<span class="glyphicon glyphicon-floppy-disk"></span> Save Image Order').removeClass('disabled').addClass('active');
                // show message bar to say that the order is saved correctly
                $('#order-image-notice').slideDown('slow').delay(2000).slideUp('slow');
            }
        })

    })

    /*$("#sortable").sortable({
        revert       : true,
        connectWith  : "#sortable",
        stop         : function(event,ui){
            // change name after sorting of photos
            change_name_photos();
        }
    });
    $("#sortable").disableSelection();*/

    

    /* manage to change name of photos */
    // show select box to change name of photo
    $('#allow_rename').on('click', function () {
        $('.order-img-name').toggle();
    })
    
    // change all name of photos according to type you selected
    $('.order-img-name').on('change', function () {

        var nameClass,image_name;
        nameClass = $(this).closest('.order-thumb').find('input');
        image_name = $(this).val();
        nameClass.removeClass().addClass(image_name);

        change_name_photos();
    })

    // select / deselect an image
    $(".checkmark").on('click', function () {
        $(this).toggleClass('checkmark-selected');
        set_selected_count();
    })

    // select / deselect all images
    $('#order-all-select').on('click', function () {
        if($(this).hasClass('all-select')){
            // change to deselect all button
            $(this).removeClass('all-select');
            $(this).text('').append('<span class="glyphicon glyphicon-remove"></span>  Deselect All');
            $('.checkmark').removeClass('checkmark-selected');
        }else{
            $(this).addClass('all-select');
            $(this).text('').append('<span class="glyphicon glyphicon-ok"></span>  Select All');
            $('.checkmark').addClass('checkmark-selected');
        }
    })
    
    // send email to myself
    $('#order-send-email-myself').on('click', function () {
        $(this).html('<span class="fa fa-spinner fa-spin"></span> Sending ...').addClass('disabled');
        var order_images = [];
        $('.order-thumb').each(function (index) {
            var image = $(this).find('input').val();//$(this).data('image');
            order_images.push(image);
        })
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var order_id = $('#order-id').val();
        var email = '';
        var data = {order_images: order_images, order_id: order_id, email: email};
        $.ajax({
            type: 'POST',
            url: ajax_url_send_email,
            data: data,
            success: function(result)
            {
                $('#order-send-email-myself').html('<span class="glyphicon glyphicon-send"></span> Send Email').removeClass('disabled').addClass('active');
            }
        })
    })

    // send email to 
    $('#order-send-email').on('click', function () {
        $(this).html('<span class="fa fa-spinner fa-spin"></span>').addClass('disabled');
        var order_images = [];
        $('.order-thumb').each(function (index) {
            var image = $(this).find('input').val();//$(this).data('image');
            order_images.push(image);
        })
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var order_id = $('#order-id').val();
        var email = '';
        var data = {order_images: order_images, order_id: order_id, email: email};
        $.ajax({
            type: 'POST',
            url: ajax_url_send_email,
            data: data,
            success: function(result)
            {
                $('#order-send-email').html('<span class="glyphicon glyphicon-send"></span>').removeClass('disabled').addClass('active');
            }
        })
    })

    // delete selected images
    $('#delete_btn').on('click', function () {
        $(this).html('<span class="fa fa-spinner fa-spin"></span>&nbsp;Deleting').addClass('disabled');

        var images = get_selected_images();

        if(images.length == 0)
        {
            return false;
        }
        var order_id = $('#order-id').val();
        var data = {order_id: order_id, images:images};
        $.ajax({
            type: 'POST',
            url: ajax_url_delete_photos,
            data: data,
            success: function(result)
            {
                $('#delete_btn').html('Delete').removeClass('disabled');
                $('#confirm_delete_photo').modal('toggle');
                $('.album_selected').remove();
            }
        });
    });

    // enable selected images

    // disable selected images
    
    // download selected images
    $('#download_btn').on('click', function () {
        if($('#image-full').is(':checked')){
            download_selected_photos('origin');
        }else{
            download_selected_photos('small');
        }
    });

   
});

// change name of photos when drag one or select type of one
function change_name_photos() {
    $('.order-thumb').each(function (index) {
        index++;
        var inputType = $(this).find('input');
        var image_name = inputType.attr('class')
        var type_index = $('.'+image_name).index(inputType) + 1;
        $(this).find('input[name=changed_name]').val(index+'-'+image_name+''+type_index+'.jpg');
        $(this).find('input[name=sort_id]').val(index);
    })
}

// show count of selected images
function set_selected_count() {
    var images = get_selected_images();
    var count = images.length;
    $('.image-numbers').text(count);
}
// get selected images
function get_selected_images() {
    var images = [];
    $('.order-thumb').removeClass('album_selected');
    $('.order-thumb').each(function (index) {
        if(!$(this).find('.checkmark').hasClass('checkmark-selected'))
        {
            images.push($(this).attr('data-id'));
            $(this).addClass('album_selected');
        }
    });
    return images;
}

// download selected images
function download_selected_photos(type) {

    var images = get_selected_images();

    if(images.length == 0)
    {
        alert('You have to select one image at least.');
        return false;
    }
    var order_id = $('#order-id').val();
    var data = {order_id: order_id, type: type, images:images};
    $.ajax({
        type: 'POST',
        url: ajax_url_download_photos,
        data: data,
        success: function(result)
        {
            $('#select_download_type').modal('toggle');
            var download_link = document.createElement('a');
            if(result == 'success') {
                download_link.setAttribute('href', download_route + '/' + order_id);
            }else{
                download_link.setAttribute('href', result);
            }
            download_link.click();
            download_link.remove();
        }
    });
}
this.imagePreview = function(){
    /* CONFIG */

    xOffset = 10;
    yOffset = 30;

    // these 2 variable determine popup's distance from the cursor
    // you might want to adjust to get the right result

    /* END CONFIG */
    $(".preview").hover(function(e){
            var url = $(this).data('url');
            this.t = $(this).closest('.order-thumb').find('input').val();///this.t = this.title;
            this.title = "";
            var c = (this.t != "") ? "<br/>" + this.t : "";
            $("body").append("<p id='preview'><img width='400' src='"+ url +"' alt='Image preview' />"+ c +"</p>");
            $("#preview")
                .css("top",(e.pageY - xOffset) + "px")
                .css("left",(e.pageX + yOffset) + "px")
                .fadeIn("fast");
        },
        function(){
            this.title = this.t;
            $("#preview").remove();
        });
    $(".preview").mousemove(function(e){
        $("#preview")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px");
    });
    $(".checkmark").hover(function(e){
            $("#preview").hide();
        },
        function(){
            $("#preview").show();
        });
    $(".preview").mousedown(function(e){
            $("#preview").hide();
        },
        function(){
            $("#preview").show();
        });

};