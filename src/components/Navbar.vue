<template>
<nav class="navbar-top row align-items-center justify-content-center">
    <div class="overlay" @click="cartToggle"></div>
    <div class="hemenu-wrapper col-2" style="z-index:101;">
        <a href="#" class="menuBtn" @click.prevent="menuToggle">
        <div class="menuline"></div>
        <div class="menuline"></div>
        <div class="menuline"></div>
        </a>
    </div>
    <div class="hmenu sidebar">
        <ul>
            <li><router-link class="col-md menulink " to="/products">View All</router-link></li>
            <li><router-link class="col-md menulink " to="/products/laptop">Laptop</router-link></li>
            <li><router-link class="col-md menulink " to="/products/phone">Phone</router-link></li>
            <li><router-link class="col-md menulink " to="/products/headphone">Headphone</router-link></li>
            <li><router-link class="col-md menulink " to="/products/speaker">Speaker</router-link></li>
        </ul>
    </div>
    <div class="menu-wrapper container col-10">
        <ul class="nav-menu adjust-menu">
            <li><router-link class="nav-link" to="/home">Home</router-link></li>
            <li><router-link class="nav-link" to="/products">Shop</router-link></li>
            <li><router-link class="nav-link" to="/about">About</router-link></li>
            <li><div class="dropdown">
                <button type="button" class="cartBtn" @click="cartToggle">
                    <i class="fas fa-shopping-cart"><span v-if="cart.carts.length">{{cart.carts.length}}</span></i>
                </button>
                    <div class="cart-dropdown p-1 align-items-center justify-content-center">
                        <table class="table">
                            <th colspan="4" class="text-center"><h5>Shopping Cart</h5></th>
                            <tbody>
                                <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts">
                                <td class="align-middle">
                                <img :src="item.product.imageUrl" class="img-fluid" style="height:60px" alt="...">
                                </td>
                                <td class="align-middle">
                                {{ item.product.title }}
                                </td>
                                <td class="align-middle">
                                x {{ item.qty }}
                                </td>
                                <td class="align-middle text-right">{{ item.final_total | currency}}
                                </td> 
                                </tr>
                                <tr>
                                <td colspan="4" class="text-right">總計 {{ cart.total | currency }}</td>
                                </tr>
                                <tr v-if="cart.final_total !== cart.total">
                                <td colspan="4" class="text-right text-success">折扣價</td>
                                <td class="text-right text-success">{{ cart.final_total | currency }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                <td colspan="5" class="text-right"><button class="btn btn-primary" @click="toCheckout">結帳去</button></td>  
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</nav>
</template>

<script>
import $ from 'jquery';

export default{
    data(){
        return{
            products:[],
            product:{},
            cart:{
                carts: [],
            },
            coupon_code:'',
            form:{
                user:{
                    name:'',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            status:{
                loadingItem:'',
            },
            isLoading: false,
        };
    },
    methods:{
        menuToggle() {
            $(".menuBtn").toggleClass("menuBtn-show");
            $(".sidebar").toggleClass("show");
        },
        cartToggle(){
            $(".cart-dropdown").toggleClass("show");
            $(".overlay").toggleClass("show");
        },
        toCheckout(){
            this.$router.push(`/CheckOut`);
            $(window).scrollTop(0);
            $(".cart-dropdown").removeClass("show");
            $(".overlay").removeClass("show");
        },
        getCart(){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            const vm = this;
           
            this.$http.get(url).then((response) => {
            vm.cart = response.data.data;
            });
        },
        removeCartItem(id){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
            const vm = this;

            this.$http.delete(url).then(() => {
            vm.$bus.$emit("getCart");
            vm.getCart();
            
            });
        },
    },
    created(){
        this.getCart();
        this.$bus.$on('getCart', this.getCart);
    },
    mounted(){  
        $(window).scroll(() => {
            if ($(window).scrollTop() > 60){
                    $('.navbar-top').addClass('navbar-show');
                }
                else{
                    $('.navbar-top').removeClass('navbar-show');
                }
        });
     
        $('.menulink').click(function(event){
            $(".menuBtn").toggleClass("menuBtn-show");
            $(".sidebar").toggleClass("show");
        });
    
    },
}
</script>