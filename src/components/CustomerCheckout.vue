<template>
<div>
  <div class="title-checkout text-center d-flex flex-column align-item-center justify-content-center">
  <h1>Confirmation</h1>
  </div>
  <div class="my-5 row justify-content-center">
    <form class="col-md-6" >
      <table class="table">
        <thead>
          <th width="120"></th>
          <th class="text-left">品名</th>
          <th width="120">數量</th>
          <th width="120" class="text-right">單價</th>
        </thead>
        <tbody>
          <tr v-for="item in order.products" :key="item.id">
            <td class="align-middle"><img :src="item.product.imageUrl" class="img-fluid" alt="img-product" style="height:60px; width:60px;"></td>
            <td class="align-middle text-left">{{ item.product.title }}</td>
            <td class="align-middle">{{ item.qty }}</td>
            <td class="align-middle text-right">{{ item.final_total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right">總計</td>
            <td class="text-right">${{ order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!order.is_paid">尚未付款</span>
              <span v-else class="text-success">付款完成</span>
            </td>
          </tr>
        </tbody>
      </table>
        <div class="text-right" v-if="order.is_paid === false">
          <button class="btn btn-primary" @click.prevent="payOrder">Place order</button>
        </div>
    </form>
  </div>
</div>
</template>

<script>
export default{
    data(){
        return{
            order:{
                user:{},
            },
            orderId:'',
        };
    },
    methods:{
        getOrder(){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${vm.orderId}`;            
            vm.isLoading = true;

            this.$http.get(url).then((response) => {
            vm.order = response.data.order;
            vm.isLoading = false;
            });
        },
        toCheckout(){
            this.$router.push(`/CheckOut`);
        },
        payOrder() {
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${vm.orderId}`;
            vm.isLoading = true;
            
            this.$http.post(url).then((response) => {
                console.log(response);
                if (response.data.success) {
                vm.getOrder();
                vm.$bus.$emit("getCart");
                }
                vm.isLoading = false;
            });
        },
    },
    created(){
        this.orderId = this.$route.params.orderId;        //console.log(this.orderId);
        this.getOrder();
    },
};
</script>