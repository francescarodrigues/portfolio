// Freelancer Theme JavaScript


function truncate(str, size) {
    sub = str.substring(0, size);

    if (sub.length == str.length) {
        return str;
    } else {
        return `${sub}...`;
    }
}


function slice_posts(posts, page_size, page_number) {
    return posts.slice(page_number * page_size, (page_number + 1) * page_size);
}


function sort_by_date(posts) {
    return posts.sort(function(a, b) {
        return a.date < b.date? 1: -1
    })
}


function paginate(posts) {
    $("#posts").empty();
    posts.forEach(function(post) {
        $("#posts").append(
            `<div class="col-sm-4 portfolio-item">
                <a href="${post.url}" class="portfolio-link" target="_blank" title="${post.title}">
                    <div class="caption">
                        <div class="caption-content">
                            <i class="fa fa-search-plus fa-3x"></i>
                        </div>
                    </div>
                    <img src="${post.image}" class="img-responsive img-portfolio" alt="${post.title}">
                    <small class="portfolio-subtitle">${truncate(post.title, 50)}</small>
                </a>
            </div>`
        );
    });
}


(function($) {
    "use strict"; // Start of use strict
    var pagination = {
        'posts': null,
        'total': null,
        'page_size': 9,
        'page_number': 0
    };

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    $('#oldest').click(function(e) {
        e.preventDefault();

        if ($('#oldest').hasClass('disabled')) {
            return
        }

        var new_page = pagination.page_number + 1;
        var posts = slice_posts(pagination.posts, pagination.page_size, new_page);

        if (posts) {
            pagination.page_number = new_page;
            paginate(posts);
            $(document).scrollTop($('#portfolio').offset().top);
            $('#newlest').removeClass('disabled');

            var last_page = Math.ceil(pagination.total / pagination.page_size);
            if (new_page + 1 == last_page) {
                $('#oldest').addClass('disabled');
            }
        }

    });

    $('#newlest').click(function(e) {
        e.preventDefault();

        if ($('#newlest').hasClass('disabled')) {
            return
        }

        var new_page = pagination.page_number - 1;
        var posts = slice_posts(pagination.posts, pagination.page_size, new_page);

        if (posts) {
            pagination.page_number = new_page;
            paginate(posts);
            $(document).scrollTop($('#portfolio').offset().top);
            $('#oldest').removeClass('disabled');

            if (new_page == 0) {
                $('#newlest').addClass('disabled');
            }
        }
    });

    if (!pagination.posts) {
        $.getJSON('data/posts.json', function(data) {
            pagination.posts = sort_by_date(data.posts);
            pagination.total = data.posts.length;

            var posts = slice_posts(pagination.posts, pagination.page_size, pagination.page_number);

            if (posts) {
                paginate(posts);
            }

            if (pagination.page_number == 0) {
                $('#newlest').addClass('disabled');
            }

            if (pagination.total <= pagination.page_size) {
                $('#oldest').addClass('disabled');
            }
        });
    };

    // Floating label headings for the contact form
    $(function() {
        $("body").on("input propertychange", ".floating-label-form-group", function(e) {
            $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
        }).on("focus", ".floating-label-form-group", function() {
            $(this).addClass("floating-label-form-group-with-focus");
        }).on("blur", ".floating-label-form-group", function() {
            $(this).removeClass("floating-label-form-group-with-focus");
        });
    });

})(jQuery); // End of use strict
