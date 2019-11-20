<template>
<div>
<loading :active.sync="isLoading" ></loading>
    <div class="text-right mt-4">
        <button class="btn btn-primary" @click="openModal(true)">建立新的優惠卷</button>
    </div>
    <table class="table mt-4">
        <thead>
        <tr>
        <th>名稱</th>
        <th width="80">折數</th>
        <th width="120">折扣碼</th>
        <th width="120">到期日</th>
        <th width="80">狀態</th>
        <th width="80">編輯</th>
        <th width="80">刪除</th>
        </tr>
        </thead>
            <tbody>
            <tr v-for="(item, key) in coupons" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.percent }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.due_date | timestamp}}</td>
            <td>
                <span v-if="item.is_enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
            </td>
            <td>
            <button class="btn btn-outline-info btn-sm" @click="openModal(false, item)">編輯</button>
            </td>
            <td>
            <button class="btn btn-outline-danger btn-sm" @click="delModal(item)">刪除</button>
            </td>
            </tr>
            </tbody>
        </table>

        <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled': !pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent ="getCoupons(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            <li class="page-item" :class="{'active': pagination.current_page == page}"v-for="page in pagination.total_pages" :key="page"><a class="page-link" href="#" @click.prevent ="getCoupons(page)">{{ page }}</a></li>
            <li class="page-item" :class="{'disabled': !pagination.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent ="getCoupons(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>

    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span v-if="isNew">新增優惠卷</span>
                <span v-else="!isNew">修改優惠卷</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                            <label for="title">標題</label>
                            <input type="text" class="form-control" id="title"
                                v-model="tempCoupon.title"
                                placeholder="請輸入標題">
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-2">
                                    <label for="percent">折數</label>
                                    <input type="number" class="form-control" id="percent"
                                    v-model="tempCoupon.percent"
                                    placeholder="">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="code">折扣碼</label>
                                    <input type="text" class="form-control" id="code"
                                    v-model="tempCoupon.code"
                                    placeholder="請輸入折扣碼">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="date">到期日</label>
                                    <input type="date" class="form-control" id="date"
                                    v-model="tempCoupon.due_date">
                                </div>
                            </div>
                            <hr>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox"
                                    v-model="tempCoupon.is_enabled"
                                    :true-value="1"
                                    :false-value="0"
                                    id="is_enabled">
                                    <label class="form-check-label" for="is_enabled">
                                    是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-info" @click="updateCoupon">確認</button>
            </div>
            </div>
        </div>
        </div>
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>刪除優惠卷</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    是否刪除 <strong class="text-danger"></strong> 優惠卷(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除</button>
                </div>
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
            coupons:[],
            pagination: {},
            tempCoupon:{},
            isNew:false,
            isLoading: false,
            status: {
                fileUploading: false,
            },
        };
    },
    methods:{
        getCoupons(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            //API伺服器路經, 所申請api路徑
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.coupons = response.data.coupons;
            vm.pagination = response.data.pagination;
            });
        },
        openModal(isNew, item){
            if(isNew){
                this.tempCoupon = {};
                this.isNew = true;
            }
            else{
                this.tempCoupon = Object.assign({}, item); // 若直接使用this.tempCoupon = item 會發生物件傳參考性質 而造成雙方的值都一樣 
                this.isNew = false;
            } 
            $('#couponModal').modal('show');
        },
        updateCoupon(){
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                httpMethod = 'put';
            }
            let dates = new Date(vm.tempCoupon.due_date);
            vm.tempCoupon.due_date = Math.floor(dates.getTime() / 1000);
            this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
            console.log(response.data);
            if(response.data.success){
                $('#couponModal').modal('hide');  //close modal
                vm.getCoupons();   //update new list
            }
            else{
                $('#couponModal').modal('hide');  //close modal
                vm.getCoupons();   //update new list
                console.log('新增失敗');
            }
            });
        },
        delModal(item){
            $('#delCouponModal').modal('show');
            this.tempCoupon = item;
        },
        delCoupon(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
            this.$http.delete(api).then((response) => {
            if(response.data.success){
                $('#delCouponModal').modal('hide');  //close modal
                vm.getCoupons();   //update new list
            }
             else{
                $('#delCouponModal').modal('hide');  //close modal
                vm.getCoupons();   //update new list
                console.log('刪除失敗');
            }
            });
        },
        // uploadFile(){ //https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
        //     console.log(this);
        //     const uploadedFile = this.$refs.files.files[0];
        //     const vm = this;
        //     const formData = new FormData();
        //     formData.append('file-to-upload', uploadedFile);
        //     const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
        //     vm.status.fileUploading = true;
        //     this.$http.post(url, formData, {
        //         headers:{
        //             'Content-Type': 'multipart/form-data'  // 需將物件內改成表單形式
        //         }
        //     }).then((response) => {
        //         console.log(response.data);
        //         vm.status.fileUploading = false;
        //         if(response.data.success){
        //         //vm.tempCoupon.imageUrl = response.data.imageUrl; 若只執行此行 則後端無法雙向綁定
        //         vm.$set(vm.tempCoupon, 'imageUrl', response.data.imageUrl); //使用$set 強制寫入
        //         }
        //         else{
        //             this.$bus.$emit('message:push', response.data.message, 'danger');
        //         }
        //     });
        // },
    },
    created(){
        this.getCoupons();
    }
}
</script>