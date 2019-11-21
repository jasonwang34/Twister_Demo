<template>
 <div>
   <loading :active.sync="isLoading" ></loading>
    <section class="title-products text-center d-flex flex-column align-item-center justify-content-center">
    <h1 class="animated">Products</h1>
    <p class="animated">Quality the better world</p>
    </section>
    <div class="category row align-items-center text-center menu-wrap">
        <router-link class="col-md menulink" to="/products">View All</router-link>
        <router-link class="col-md menulink" to="/products/laptop">Laptop</router-link>
        <router-link class="col-md menulink" to="/products/phone">Phone</router-link>
        <router-link class="col-md menulink" to="/products/headphone">Headphone</router-link>
        <router-link class="col-md menulink" to="/products/speaker">Speaker</router-link>
    </div>    
    <section>
        <div class="row products align-items-center text-center justify-content-center">
            <div class="mt-3 card" v-show="item.is_enabled" v-for="item in filteredProducts" :key="item.id" @click="toProduct(item.id)">
                <div class="card-img" :style="`background-image:url('${item.imageUrl}');`"></div>
                <!--<img :src="item.imageUrl" class="card-img" alt="img-product">-->
                <div class="card-body">
                <div class="card-title">{{item.title}}</div>
                <div class="card-text"><small class="text-muted">${{item.price}}</small></div>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script>
import $ from 'jquery';

export default{
    data(){
        return{
            products:[],
            cart:{},
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
                isLoading: false,
            },
            
        };
    },
    methods:{
        getProducts(){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
            const vm = this;
            vm.isLoading = true;

            this.$http.get(url).then((response) => {
            //console.log(response.data);
            vm.products = response.data.products;
            vm.isLoading = false;
            });
        },
        toProduct(id){
            this.$router.push(`/product/${id}`);
            $(window).scrollTop(0);
        },
        addtoCart(id, qty = 1){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            const vm = this;
            vm.status.loadingItem = id;
            const cart = {
                product_id: id,
                qty
            }
            this.$http.post(url, {data: cart}).then((response) => { 
            vm.status.loadingItem = '';
            vm.getCart();
            });
        },
        getCart(){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            const vm = this;
            vm.isLoading = true;

            this.$http.get(url).then((response) => {
            vm.cart = response.data.data;
            vm.isLoading = false;
            });
        },
        removeCartItem(id){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
            const vm = this;
            vm.isLoading = true;

            this.$http.delete(url).then(() => {
            vm.getCart();
            vm.isLoading = false;
            });
        },
        addCoupon(){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
            const vm = this;
            const coupon = {
                code: vm.coupon_code
            }
            vm.isLoading = true;

            this.$http.post(url, {data: coupon}).then((response) => {
            if(response.data.success){
            vm.getCart();
            vm.isLoading = false;
            }
            else{
                this.$bus.$emit('message:push', response.data.message, 'danger');
                vm.getCart();
                vm.isLoading = false;
            }
            });
        },
        createOrder(){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
            const vm = this;
            const order = vm.form;
            vm.isLoading = true;

            this.$http.post(url, {data: order}).then((response) => {
                console.log('訂單已送出', response);
                if(response.data.success){
                    vm.$router.push(`/customer_checkout/${response.data.orderId}`);
                    vm.isLoading = false;
                }
            });
        }
    },
    computed: {
        filteredProducts() {
            const vm = this;
            const product = vm.products;
            let filter = '';
            switch (vm.$route.name) {
                case 'products':
                    return product;
                case 'Headphone':
                filter = vm.products.filter((el) => {
                    const result = el.category === 'Headphone';
                    return result;
                });
                    return filter;
                case 'Phone':
                filter = vm.products.filter((el) => {
                    const result = el.category === 'Phone';
                    return result;
                });
                    return filter;
                case 'Laptop':
                filter = vm.products.filter((el) => {
                    const result = el.category === 'Laptop';
                    return result;
                });
                    return filter;
                case 'Speaker':
                filter = vm.products.filter((el) => {
                    const result = el.category === 'Speaker';
                    return result;
                });
                    return filter;

                default:
                return product;
            }
        },
    },    
    created(){
        this.getProducts();
        this.getCart();
    },
}
</script>