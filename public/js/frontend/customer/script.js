/**
 * Created by hanying on 8/25/16.
 */
$(function () {
    $('#customer_picture').on('change', function () {
        var files = !!this.files ? this.files : [];
        // if(!files || !window.FileReader) return;

        if(/^image/.test(files[0].type))
        {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = function () {
                console.log(this.result);
                $('#profile_image').attr('src', this.result);
            }
        }

    })

});

/* get home data from excel grid table and check exist. */

$(function () {
    if(typeof table_header != 'undefined')
    {
        /* update order */
        function update_order(content) {
            $.ajax({
                type: 'POST',
                url: ajax_url_update,
                data: content,
                success: function(result)
                {
                    if(result == 'success')
                        location.reload();
                }
            })
        }
        /*****/
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });

        var table_new = document.getElementById("property_table");
        var maximize = document.querySelector('.maximize');
        var maxed = false, resizeTimeout, availableWidth, availableHeight, hot1;
        var data = [[]];
        var handsontable_new = new Handsontable(table_new, {
            data:data,
            maxCols:35,
            minCols:35,
            contextMenu: true,
            colHeaders: table_header,
            height:80,
            afterChange: function(change, source){           // check if the order already exist
                if(source !== 'loadData')
                {
                    var prop_code = change[0][3];
                    var search_data = {prop_code : prop_code};
                    $.ajax({
                       type: "POST",
                        url: ajax_url_search,
                        data: search_data,
                        success: function (data) {
                            console.log(data);
                            $('#customer-oreder-update').show();
                            if(data['property_id'])
                            {
                                var noticeHtml = '<b>Notice</b>: The home is already ordered. Order ID : ' + data['order_id'] + ', Property ID: ' + data['property_id'];
                                $('#property_confirm').html(noticeHtml).show();
                            }
                        }
                    });
                }
            }
        });
        $('#search_prop').on('click', function () {
            var content = handsontable_new.getData();
            var prop_code, data, property, order_data ;

            /* get order data */
            order_data = new Array();
            var test ='';
            $.each($('.order_products:checked'), function () {
               order_data.push({'product_id':$(this).val(), 'number':$('#number_' + $(this).val()).val()});
            });

            property = content[0];
            prop_code = content[0][0];
            if(!prop_code || prop_code == '')
            {
                alert('You must insert the prop code');
            }
            else
            {
                if( order_data.length >0 ) {
                    var data = {property: property, order_data: order_data};
                    update_order(data);
                }
                else {
                    alert('please select the product');
                }
            }

        });


        /* display the  price when select the products*/
        $('.order_products,.select-product-number').on('click', function () {
            calculate_price();
        });

        /* calculate the total price */
        function calculate_price() {
            var price = 0, number = 0, total = 0;
            $('.select-product-number').prop('disabled', true);
            $.each($('.order_products:checked'), function () {
                var row = $(this).closest('.select-products-row');

                price = row.find('.select-product-price').val();
                number = row.find('.select-product-number').prop('disabled',false).val();
                total += (price * number);
            });
            $('#order_total').text('$ ' + total);
        }
        calculate_price();
    }
});

