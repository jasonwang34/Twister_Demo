<template>
<div>
    <section class="title text-center d-flex flex-column align-item-center justify-content-center">
        <h1 class="animated">Twister</h1>
        <p class="animated">twist your thought</p>
    </section>    

    <section class="quote container-fluid row align-item-center justify-content-center mt-5">
        <div class="quote-wrap col-md-5 pt-4 d-flex flex-column animatedSet">
        <h4>"Technology is changing the way we interact as humans."</h4>
        <small class="blockquote text-right">Dan Brown</small>
        </div>
        <img class="quote-img col-md-8" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="" style=" border-radius:20rem;">
    </section>

    <section class="content mt-5">
        <div class="row mt-5 align-items-center justify-content-center">
            <div class="text-wrap col-md-4 text-center align-self-center animatedSet" id="text-left">
            <h2>Technology whole new experience</h2>
            <p>domain your own furtur life</p>
            <div class="bottom-line"></div>
            </div>
            <img class="col-md-8 rounded" src="https://images.unsplash.com/photo-1451958683454-47a7f2adc864?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=966&q=80" alt="">
        </div>
        <div class="row mt-5 align-items-center justify-content-center">
            <img class="col-md-8 rounded" src="https://images.unsplash.com/photo-1471275382285-68e99fabd60a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="">
            <div class="text-wrap col-md-4 text-center align-self-center animatedSet" id="text-right">
            <h2>Explore deep secret of innovation</h2>
            <p>All for your need, your desire</p>
            <div class="bottom-line"></div>
            </div>
        </div>
    </section>

    <section class="shop mt-5 text-center flex-column align-item-center justify-content-center">
        <div class="shop-wrap"> 
        <h1>Twister Products</h1>
        <p>Quality makes your life convenient</p>
        <hr class="my-4">
        <router-link to="/products" class="btn btn-outline-dark">Start explore</router-link>
        </div>
    </section>    

</div>
</template>

<script>
import $ from 'jquery';

export default {
    mounted(){
         $(window).scroll(() => {
                if ($(window).scrollTop() > 180){
                    $('.quote-wrap').addClass('fadeIn');
                }
                if ($(window).scrollTop() > 850){
                    $('#text-left').addClass('fadeIn');
                } 
                if($(window).scrollTop() > 1150){
                    $('#text-right').addClass('fadeIn');
                }
            });
    },
};
</script>