<template>
<div>
    <div class="title-checkout text-center d-flex flex-column align-item-center justify-content-center">
    <h1>Checkout</h1>
    </div>
    <section class="row content-checkout">
    <ValidationObserver ref="observer" class="col-md-4">
            <form>
                <h3>Customer information</h3>
                    <div class="form-group">
                    <label for="useremail">Email</label>
                    <ValidationProvider name="Email" rules="required|email" v-slot="{ errors }">
                    <input type="email" class="form-control" name="email" id="useremail"
                        v-model="form.user.email" placeholder="請輸入 Email" required>
                    <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                    </div>

                    <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <ValidationProvider name="Name" rules="required|min:2" v-slot="{ errors }">
                    <input type="text" class="form-control" name="name" id="username"
                        v-model="form.user.name" placeholder="輸入姓名">
                    <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                    </div>

                    <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <ValidationProvider name="Phone" rules="required|numeric|min:8|max:10" v-slot="{ errors }">
                    <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
                    <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                    </div>
                
                    <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <ValidationProvider name="Address" rules="required" v-slot="{ errors }">
                    <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address" placeholder="請輸入地址">
                    <span class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                    </div>
                
                    <div class="form-group">
                    <label for="comment">備註</label>
                    <textarea name="" id="comment" class="form-control" cols="10" rows="3" v-model="form.message"></textarea>
                    </div>
            </form>
    </ValidationObserver>
        <div class="col-md-8">
            <h3 class="text-center">Shopping cart</h3>
            <table class="table">
                <thead>
                    <th width="60"></th>
                    <th>品名</th>
                    <th width="120" class="text-center">數量</th>
                    <th width="120">單價</th>
                    <th width="80"></th>
                </thead>
                <tbody>
                    <tr v-for="item in cart.carts" :key="item.id" v-if="cart.carts">
                    <td>
                    <div class="img-checkout" :style="`background-image:url('${item.product.imageUrl}');width:100px;height:100px;`"></div>
                    </td>
                    <td class="align-middle">
                        {{ item.product.title }}
                        <div class="text-success" v-if="item.coupon">
                        已套用優惠券
                        </div> 
                    </td>
                    <td class="align-middle text-center">{{ item.qty }}</td>
                    <td class="align-middle">{{ item.final_total | currency}}</td>                    
                    <td class="align-middle">
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                         <i v-if="!status.isLoading" class="far fa-trash-alt"></i>
                        <i v-else class="fas fa-spinner fa-spin"></i>
                        </button>
                    </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <td colspan="4" class="text-right">總計</td>
                    <td class="text-right">{{ cart.total | currency }}</td>
                    </tr>
                    <tr v-if="cart.final_total !== cart.total">
                    <td colspan="4" class="text-right text-success">折扣價</td>
                    <td class="text-right text-success">{{ cart.final_total | currency }}</td>
                    </tr>
                </tfoot>
            </table>
            <p class="text-danger text-center">Apply "NOV30" for special discount</p>
            <div class="input-group mb-3 input-group-sm">
                <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="addCoupon">
                    套用優惠碼
                    </button>
                </div>
            </div>
            <div class="text-center">
                <button class="btn btn-primary" @click.prevent="createOrder">Process to checkout</button>
            </div>
        </div>
    </section>
   
</div>
</template>


<script>
import $ from 'jquery';
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

for (let rule in rules) {
  extend(rule, rules[rule]);
}

extend('required', {
  validate: value => !!value
});
 

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
                isLoading: false,
            }
        };
    },
    methods:{
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
            vm.status.isLoading = true;
            this.$http.delete(url).then(() => {
            vm.$bus.$emit("getCart");
            vm.getCart();
            vm.status.isLoading = false;
            });
        },
        addCoupon(){
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
            const vm = this;
            const coupon = {
                code: vm.coupon_code
            }
            
            this.$http.post(url, {data: coupon}).then((response) => {
            if(response.data.success){
                vm.getCart();
            }
            else{
                this.$bus.$emit('message:push', response.data.message, 'danger');
                vm.getCart();
            }
            });
        },
        async createOrder(){
            const isValid = await this.$refs.observer.validate(); // validate form 
             if (!isValid) {
                 return;
                }
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
            const vm = this;
            const order = vm.form;
            vm.isLoading = true;

            this.$http.post(url, {data: order}).then((response) => {
                //console.log('訂單已送出', response);
                if(response.data.success){
                    vm.$router.push(`/customer_checkout/${response.data.orderId}`);
                    vm.isLoading = false;
                }
            });
        }
    },
    created(){
        this.getCart();
    },
}
</script>