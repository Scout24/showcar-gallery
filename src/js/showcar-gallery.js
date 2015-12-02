$(document).ready(function() {

    function paginate(direction) {
        $('.gallery-item').each(function() {
            var left = parseInt($(this).css('left'));
            $(this).css('left', left + direction);
        });
        if (direction > 0) {
            //left clicked, move last item to the beginning
            var last = $('.gallery-item').last();
            last.hide();
            $('.gallery-wrapper').prepend(last);
            last.css('left', -300);
            last.show();
        }
        else if(direction < 0) {
            //right clicked, move first item to the end
            var first = $('.gallery-item').first();
            first.hide();
            $('.gallery-wrapper').append(first);
            first.css('left', 500);
            first.show();
        }
    }

    $('#left').click(function() {
        paginate(200);

    });
    $('#right').click(function() {
        paginate(-200);
    });
});
