$(function() {
    $(".show-permissions").click(function(e) {
        e.preventDefault();
        var $this = $(this);
        var role = $this.data('role');
        var permissions = $(".permission-list[data-role='"+role+"']");
        var hideText = $this.find('.hide-text');
        var showText = $this.find('.show-text');

        // show permission list
        permissions.toggleClass('hidden');

        // toggle the text Show/Hide for the link
        hideText.toggleClass('hidden');
        showText.toggleClass('hidden');
    });

    //
    $('#employee_picture').on('change', function () {
        var files = !!this.files ? this.files : [];
       // if(!files || !window.FileReader) return;

        if(/^image/.test(files[0].type))
        {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = function () {
                $('#profile_image').attr('src', this.result);
            }
        }

    });
    $('#products').chosen({width:"100%"});
    
    /* in schedule page, ajax to select photographer */
    $('.schedule-photographer').on('change', function () {

        $(this).removeClass('select-alert');

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var schedule_id = $(this).attr('data-schedule');
        var photographer_id = $(this).val();
        var data = { schedule_id:schedule_id, user_id:photographer_id, user_role:'photographer' };
        $.ajax({
            type: 'POST',
            url: ajax_url_assign,
            data: data,
            success: function(result)
            {
                if(result == 'success')
                {
                    $('#schedule_' + schedule_id).css('color', 'green');
                }
            }
        })
    });

    /* in schedule page, ajax to select processor */
    $('.schedule-processor').on('change', function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var schedule_id = $(this).attr('data-schedule');
        var processor_id = $(this).val();
        var data = { schedule_id:schedule_id, user_id:processor_id, user_role:'processor' };
        $.ajax({
            type: 'POST',
            url: ajax_url_assign,
            data: data,
            success: function(result)
            {
                if(result == 'success')
                {
                    $('#schedule_proc_' + schedule_id).css('color', 'green');
                }
            }
        })
    });

    /* in schedule page, ajax to select shooting date */

    $('.schedule_time').on('change', function () {
        /*$.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var schedule_id = $(this).attr('data-schedule');
        var date = $(this).val();
        var data = {schedule_id:schedule_id, date:date, type:'shoot'};
        $.ajax({
            type: 'POST',
            url: ajax_url_schedule_date,
            data: data,
            success:function(result)
            {
                if(result == 'success')
                {
                    $('#schedule_date_' + schedule_id).css('color', 'green');
                }
            }
        })*/
    });

    /**
     * photographer check the shooting time
     */
    $('.photographer_schedule_time').on('change', function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var schedule_id = $(this).attr('data-schedule');
        var date = $(this).val();
        var data = {schedule_id:schedule_id, date:date, type:'shoot', check:'photographer'};
        $.ajax({
            type: 'POST',
            url: ajax_url_schedule_date,
            data: data,
            success:function(result)
            {
                if(result == 'success')
                {
                    $('#schedule_date_' + schedule_id).css('color', 'green');
                }
            }
        })
    });

    /**
     *
     */
    $('.processing_time').on('change', function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        var schedule_id = $(this).data('schedule');
        var date = $(this).val();
        var data = {schedule_id:schedule_id, date:date, type:'process'};
        $.ajax({
            type: 'POST',
            url: ajax_url_schedule_date,
            data: data,
            success:function(result)
            {
                if(result == 'success')
                {
                    $('#processing_date_' + schedule_id).css('color', 'green');
                }
            }
        })
    });

    /* double scroll(top) of schedule table */
    function DoubleScroll(element) {
        var scrollbar= document.createElement('div');
        scrollbar.className = 'top-x-scroll';
        scrollbar.appendChild(document.createElement('div'));
        scrollbar.style.overflow= 'auto';
        scrollbar.style.overflowY= 'hidden';
        scrollbar.firstChild.style.width= element.scrollWidth+'px';
        scrollbar.firstChild.style.paddingTop= '1px';
        scrollbar.firstChild.style.marginTop= '-18px';
        scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
        scrollbar.onscroll= function() {
            element.scrollLeft= scrollbar.scrollLeft;
        };
        element.onscroll= function() {
            scrollbar.scrollLeft= element.scrollLeft;
        };
        element.parentNode.insertBefore(scrollbar, element);
    }
    DoubleScroll(document.getElementById('schedule-table-div'));

    $(".top-scrollbar").css('width', document.getElementById('schedule-table-div').scrollWidth);
    $(".top-scrollbar-wrapper").css('width', document.getElementById('schedule-table-div').clientWidth);
    $(".top-scrollbar-back").css('width', document.getElementById('schedule-table-div').clientWidth);
    $(".top-scrollbar-wrapper").scroll(function(){
        $("#schedule-table-div")
            .scrollLeft($(".top-scrollbar-wrapper").scrollLeft());
    });
    $("#schedule-table-div").scroll(function(){
        $(".top-scrollbar-wrapper")
            .scrollLeft($("#schedule-table-div").scrollLeft());
    });



    /* event to mark as paid & unpaid in schedule table */
    $('.btn-payment-status').on('click', function () {
        $(this).addClass('schedule-payment-click');


        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        // true when click on "Mark as Paid" , false when click on "Mark as Unpaid"
        var payment_status = $(this).hasClass('btn-success');
        var order_id = $(this).closest('td').find('div').data('id');
        var data = {order_id:order_id, payment_status:payment_status}
        $.ajax({
            type: 'POST',
            url: ajax_url_schedule_payment_status,
            data: data,
            success:function(result)
            {
                var btn = $('.schedule-payment-click');
                if(result == 'completed')
                {
                    btn.addClass('btn-info').removeClass('btn-success').val('Mark as Unpaid');
                }else{
                    btn.removeClass('btn-info').addClass('btn-success').val('Mark as Paid');
                }
                btn.closest('td').find('.schedule-payment-status').text(result);
                btn.removeClass('schedule-payment-click');
            }
        })
    })

    /* event to set status of processing
    * and send email depending on photographer's status
    * */
    $('.schedule-progress li').on('click',function () {

        $(this).addClass('schedule-process-click');
        
        var status = $(this).val();
        var schedule_id = $(this).closest('tr').find('td:eq(0)').data('id');
        var notAsked = 1; // we will send email to photographer and customer both in this case

        
        // validate all status
        if(status == '1'){
            var isSelectedPhotographer = $(this).closest('tr').find('.schedule-photographer').val() != null ? 1 : 0;

            if(!isSelectedPhotographer){
                $(this).closest('tr').find('.schedule-photographer').addClass('select-alert');
                show_notification('alert','You should select a photographer...');
                return false;
            }
            var isSchedulded = $(this).closest('tr').find('.schedule_time').val() != '' ? 1 : 0; console.log(isSchedulded);
            if(!isSchedulded){
                $(this).closest('tr').find('.schedule_time').addClass('select-alert');
                show_notification('alert','You should select a schedule date...');
                return false;
            }
            notAsked = $(this).closest('tr').find('.ask_photographer').length; // 0 or 1

            
        }else if(status == '2'){
            
        }

        var data = {schedule_id:schedule_id, process_status:status, type: notAsked};
        
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: ajax_url_schedule_process_status,
            data: data,
            success:function(result)
            {
                var progressBtn = $('.schedule-process-click');
                progressBtn.closest('ul').find('li').removeClass('schedule-process-active');
                progressBtn.addClass('schedule-process-active').removeClass('schedule-process-click');
                if(result == 'success')
                {
                    show_notification('success','The status is updated...');
                }
            }
        })
    })

    /**
     * allow photogrpaher to schedule photography
     */
    $('.ask_photographer').on('change', function () {
        if($(this).is(':checked'))
        {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                }
            });
            var td = $(this).closest('td');
            var schedule_id = td.find('.schedule_time').attr('data-schedule');
            $.ajax({
                type: 'POST',
                url : ajax_url_allow_photographer,
                data:{id:schedule_id},
                success: function(result)
                {
                    if(result != 'failed')
                    {
                        td.find('.small-label').html('Asked Photogrpaher on ' + result);
                    }
                    else{
                        return false;
                    }
                }
            })
        }
    })

    /**
     * add comment for an order
     */
    $('.add-note-btn').on('click', function () {
        var content = $(this).closest('.modal-footer').find('.comment-reply-data').val();
        var order_id = $(this).closest('.modal-footer').find('.order-comment-id').val();
        if( content != '')
        {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                }
            });

            $.ajax({
                type: 'POST',
                url : ajax_url_add_comment,
                data:{user_id:current_user_id, content: content, order_id: order_id},
                success: function(result)
                {
                    location.reload();
                }
            })
        }
    })

    
    /* top scroll bar for flexiable */
    var fhHeight = 0;
    var ft = $('.flexitable');
    var win = $(window);
    var ftr = $('.flexitr');
    var fhold = $('.top-scrollbar-wrapper');
    var fhold_back = $('.top-scrollbar-back');

    $(window).scroll(function() {


        if(fhHeight==0 && (ft.offset().top - win.scrollTop()) <= 0) {
            fhHeight = ftr.height();
            fhold.show();
            fhold_back.show();
        }
        else if(fhHeight!=0 && fhHeight!=-1 &&
            (ft.offset().top - win.scrollTop() > fhHeight ||
            ft.offset().top + ft.outerHeight(true) - win.scrollTop() < 0))  {
            if(ft.offset().top + ft.outerHeight(true) - win.scrollTop() < 0) {
                fhHeight = -1;
            }
            else {
                fhHeight = 0;
            }
            fhold.hide();
            fhold_back.hide();
        }
        else if(fhHeight==-1 && ft.offset().top + ft.outerHeight(true) - win.scrollTop() > 0) {
            fhHeight = 0;
        }
    });

    $('.shoot_datetimepicker').each(function (i, obj) {

        var defaultDate = $(this).data('default') == '0000-00-00 00:00:00' ? '' : $(this).data('default');

        $(this).datetimepicker({
            defaultDate:defaultDate
        }).on("dp.change", function(e){

            $(this).removeClass('select-alert');

            /* in schedule page, ajax to select shooting date */
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                }
            });
            var schedule_id = $(this).attr('data-schedule');
            var date = $(this).data('date');
            var data = {schedule_id:schedule_id, date:date, type:'shoot'};
            $.ajax({
                type: 'POST',
                url: ajax_url_schedule_date,
                data: data,
                success:function(result)
                {
                    if(result == 'success')
                    {
                        $('#schedule_date_' + schedule_id).css('color', 'green');
                    }
                }
            })
        });
    })

    function show_notification(type, message) {
        // type : success or alert
        $(".hd-notification").addClass('hd-notification-'+type).text(message).show().delay(2000).fadeOut();
    }
})
