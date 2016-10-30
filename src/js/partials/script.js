;(function($){
    $(function() {
        var header = $("#header");
        var menuBtn = $("#menuBtn");
        var topBtn = $("#topBtn");
        var popupGallery = $("#popupGallery");


        // Клик по кнопке меню раскрывает список навигации
        menuBtn.on("click", function(e){
            e.preventDefault();
            if (header.hasClass("header_nav-show")) {
                header.removeClass("header_nav-show");
            } else {
                header.addClass("header_nav-show");
            }
        });


        // Фиксирует шапку, если величина прокрутки страницы больше 0
        function isScrollTop() {
            if ($(window).scrollTop() > 0) {
                header.addClass("header_scroll");
            } else {
                header.removeClass("header_scroll");
            }
        }


        // Плавный скролл при клике на ссылку навигации до соответствующего ей раздела
        $(".header__nav-link, .footer__nav-link").on("click", function(e){
            e.preventDefault();
            var self = $(this);

            header.removeClass("header_nav-show");
            $("html, body").animate({
                scrollTop: $(self.attr("href")).offset().top - header.height()
            }, 500);
        });


        // Устанавливает значение прокрутки при загрузки страницы в зависимости от хэша
        function setScrollTop() {
            var hash = $(location).attr("hash");
            if (hash) {
                $(document).scrollTop($($(location).attr("hash")).offset().top - header.height());
            }
        }


        // Кнопка вверх
        topBtn.on("click", function(){
            $("html, body").animate({
                scrollTop: 0
            }, 500);
        });


        // Галерея в попапе
        popupGallery.slick({
            accessibility: false,
            arrows: false,
            dots: false,
            infinite: false,
        });


        // При перемещении между слайдами прокрутить страницу вверх
        popupGallery.on("afterChange", function(){
            //goTop();
        });

        function goTop() {
            $(".open-service").animate({
                scrollTop: 0
            }, 500);
        };


        // Кнопки "следующий слайд" и "предыдущий слайд"
        $("#prevSlide").on("click", function(){
            popupGallery.slick("slickPrev");
        });

        $("#nextSlide").on("click", function(){
            popupGallery.slick("slickNext");
        });


        // Клик по разделу на основной странице открывает попап и перемещает на соответствующий слайд
        $(".services__gallery-item").on("click", function() {
            var self = $(this);
            var slideNumber = self.data("slide");

            popupGallery.slick("slickGoTo", (parseInt(slideNumber)), true);
            $("body").addClass("show-gallery");
        });


        // Клик по кнопке закрыть в попапе
        $("#closeGalleryBtn").on("click", function(){
            $("body").removeClass("show-gallery");
        });

        $(window).on("scroll", function() {
            isScrollTop();
        });

        $(window).on("load", function() {
            setScrollTop();
            isScrollTop();
        });

        $(window).on("resize", function(){
            header.removeClass("header_nav-show");
        });
    })
})(jQuery);


// Гугл карта
var map;

function initMap() {
    var markerPosition = {lat: 55.8173, lng: 49.1401};
    /* Указать путь относительно конечной папки на сервере, например для https://www.site.com/tash/index.html путь картинки будет /tash/img/pin.png */
    var img = '/img/pin.png';

    map = new google.maps.Map(document.getElementById('map'), {
        center: markerPosition,
        zoom: 17,
        disableDefaultUI: true
    });

    var marker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        icon: img
    });
};