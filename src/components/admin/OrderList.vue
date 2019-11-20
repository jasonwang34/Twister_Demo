<template>
<div>
    <loading :active.sync="isLoading" ></loading>
    <table class="table mt-4">
        <thead>
        <tr>
        <th width="180">訂單編號</th>
        <th width="180">客戶姓名</th>
        <th width="100">日期</th>
        <th width="100" class="text-right">總金額</th>
        <th width="120">付款狀態</th>
        <th>客戶留言</th>
        <th width="80">編輯</th>
        </tr>
        </thead>
            <tbody>
            <tr v-for="(item, key) in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.user.name }}</td>
            <td>{{ item.create_at | timestamp }}</td>
            <td class="text-right">{{ item.total | currency }}</td>
            <td>
                <span v-if="item.is_paid === true" class="text-primary">已付款</span>
                <span v-else class="text-danger">尚未付款</span>
            </td>
            <td>{{item.message}}</td>
            <td><button class="btn btn-outline-info btn-sm" @click="openModal(item)">編輯</button></td>
            </tr>
            </tbody>
        </table>

    <div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                        <span>修改訂單</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                    <label for="id">訂單編號</label>
                                    <input type="text" class="form-control" id="id"
                                        v-model="tempOrder.id" disabled>
                                    </div>
                                    <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="customerName">客戶姓名</label>
                                        <input type="text" class="form-control" id="customerName"
                                        v-model="tempOrder.user.name"
                                        placeholder="請輸入客戶姓名">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="customerPhone">客戶電話</label>
                                        <input type="text" class="form-control" id="customerPhone"
                                        v-model="tempOrder.user.tel"
                                        placeholder="請輸入客戶電話">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="customerAddress">客戶地址</label>
                                        <input type="text" class="form-control" id="customerAddress"
                                        v-model="tempOrder.user.address"
                                        placeholder="請輸入客戶地址">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="customerEmail">客戶Email</label>
                                        <input type="email" class="form-control" id="customerEmail"
                                        v-model="tempOrder.user.email"
                                        placeholder="請輸入客戶Email">
                                    </div>
                                    </div>
                                    <div class="form-group">
                                    <label for="message">客戶留言</label>
                                    <textarea type="text" class="form-control" id="message"
                                    v-model="tempOrder.message" cols="30" rows="5"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox"
                                            v-model="tempOrder.is_enabled"
                                            :true-value="1"
                                            :false-value="0"
                                            id="is_enabled">
                                            <label class="form-check-label" for="is_enabled">
                                            是否付款
                                            </label>
                                        </div>
                                    </div>
                                    <br>
                                    <table class="table">
                                        <thead>
                                            <th>品名</th>
                                            <th>數量</th>
                                            <th class="text-right">單價</th>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in tempOrder.products" :key="item.id">
                                            <td class="align-middle">{{ item.product.title }}</td>
                                            <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                                            <td class="align-middle text-right">{{ item.product.price | currency }}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                            <td colspan="2" class="text-right">總計</td>
                                            <td class="text-right">{{ tempOrder.total | currency }}
                                            </td> 
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-info" @click="updateOrder">確認</button>
                    </div>
                </div>
            </div>
    </div>
        <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled': !pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent ="getOrders(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            <li class="page-item" :class="{'active': pagination.current_page == page}"v-for="page in pagination.total_pages" :key="page"><a class="page-link" href="#" @click.prevent ="getOrders(page)">{{ page }}</a></li>
            <li class="page-item" :class="{'disabled': !pagination.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent ="getOrders(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>
</div>
</template>

<script>
import $ from 'jquery';
export default{
    data(){
        return{
            orders:[],
            pagination: {},
            tempOrder:{
                create_at: "",
                id: "",
                is_paid: "",
                message: "",
                paid_date: "",
                payment_method: "",
                products: {},
                total: "",
                user: {
                address: "",
                email: "",
                name: "",
                tel: ""
                },
            },
            isLoading: false,
        };
    },
    methods:{
        getOrders(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
                vm.isLoading = false;
                vm.orders = response.data.orders;
                vm.pagination = response.data.pagination;
            });
        },
        openModal(item){
            this.tempOrder = Object.assign({}, item);
            $('#orderModal').modal('show');
        },
        updateOrder(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempOrder.id}`;

            this.$http[put](api, { data: vm.tempOrder }).then((response) => {
            if(response.data.success){
                $('#orderModal').modal('hide');  //close modal
                vm.getOrders();   //update new list
            }
            else{
                $('#orderModal').modal('hide');  //close modal
                vm.getOrders();   //update new list
                this.$bus.$emit('message:push', response.data.message, 'danger');
            }
            });
        },
    },
    created(){
        this.getOrders();
    }
}
</script>