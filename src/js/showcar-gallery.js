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
    var ts;
    document.addEventListener('touchstart', function (e) {
        ts = e.touches[0].clientX;
    });

    document.addEventListener('touchend', function (e) {
        var te = e.changedTouches[0].clientX;
        if (ts - te > 0) {
            paginate(-200);
        } else {
            paginate(200);
        }
    });
});

