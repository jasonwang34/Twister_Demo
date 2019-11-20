<template>
<div>
    <loading :active.sync="status.isLoading"></loading>
    <div class="row productpage">
        <div class="col-6 mt-5 product-img">
            <img :src="product.imageUrl" class="img-fluid" alt=""> 
        </div>
        <div class="col-6 mt-5 row detail">
            <h2 class="product-title">{{product.title}}</h2>
            <p class="mt-3">{{product.description}}</p>
            <br>
            <p class="mt-3 col-md-12 content">{{product.content}}</p>
            <div class="h4 col-md-12 text-right"> $ {{ product.price }}</div>
            <div class="unit-wrap col-md text-right">
                <div class="input-group col-md-8">
                    <div class="input-group-prepend">
                    <a href="#" class="btn btn-outline-secondary" :class="{'disabled':qty === 1}" @click.prevent="qty = qty - 1">−</a>
                    </div>
                <input type="number" min="1" class="form-control text-center" v-model.number="qty" />
                    <div class="input-group-append">
                    <a href="#" class="btn btn-outline-secondary" :class="{'disabled':qty === 99}" @click.prevent="qty = qty + 1">+</a>
                    </div>
                </div>
                <button type="button" class="btn btn-primary col-md-4 ml-auto mt-5" v-if="!status.isLoading" @click="addtoCart(product.id, qty)">
                加到購物車
                </button>
            </div>
        </div> 
    </div>
</div>  
</template>

<script>
import $ from 'jquery';

export default{
    data(){
        return{
            product: {},
            cart:{},
            qty:1,       
            status:{
                isLoading: false,
                loadingItem:'',
            },
        };
    },
    methods:{
        getProduct() {
            const vm = this;
            const id = vm.$route.params.id;
            //console.log(id);
            vm.status.isLoading = true;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
            vm.$http.get(api).then(response => {
                //console.log("取得單筆產品資料：", response);
                vm.product = response.data.product;
                vm.status.isLoading = false;
            });
        },
        addtoCart(id, qty = 1){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
            const vm = this;
            const cart = {
                product_id: id,
                qty
            }
            vm.status.isLoading = true;
            this.$http.post(url, {data: cart}).then((response) => { 
            vm.status.isLoading = false;
            vm.$bus.$emit('getCart');
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
    },
    created(){
        const vm = this;
        vm.getProduct();
    }
};
</script>


