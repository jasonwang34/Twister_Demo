<template>
<div>
<loading :active.sync="isLoading" ></loading>
    <div class="text-right mt-4">
        <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
        <thead>
        <tr>
        <th width="120">分類</th>
        <th>名稱</th>
        <th width="120" class="text-right">原價</th>
        <th width="120" class="text-right">售價</th>
        <th width="80">狀態</th>
        <th width="80">編輯</th>
        <th width="80">刪除</th>
        </tr>
        </thead>
            <tbody>
            <tr v-for="(item, key) in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-right">{{ item.origin_price | currency }}</td>
            <td class="text-right">{{ item.price | currency }}</td>
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
            <a class="page-link" href="#" aria-label="Previous" @click.prevent ="getProducts(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            <li class="page-item" :class="{'active': pagination.current_page == page}"v-for="page in pagination.total_pages" :key="page"><a class="page-link" href="#" @click.prevent ="getProducts(page)">{{ page }}</a></li>
            <li class="page-item" :class="{'disabled': !pagination.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent ="getProducts(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>

    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span v-if="isNew">新增產品</span>
                <span v-else="!isNew">修改產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm-4">
                    <div class="form-group">
                    <label for="image">輸入圖片網址</label>
                        <input type="text" class="form-control" id="image"
                            v-model="tempProduct.imageUrl"
                            placeholder="請輸入圖片連結">
                        </div>
                        <div class="form-group">
                        <label for="customFile">或 上傳圖片
                            <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                        </label>
                        <input type="file" id="customFile" class="form-control"
                            ref="files" @change="uploadFile">
                        </div>
                        <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                        class="img-fluid" :src="tempProduct.imageUrl" alt="">
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title"
                            v-model="tempProduct.title"
                            placeholder="請輸入標題">
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">分類</label>
                            <input type="text" class="form-control" id="category"
                            v-model="tempProduct.category"
                            placeholder="請輸入分類">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">單位</label>
                            <input type="unit" class="form-control" id="unit"
                            v-model="tempProduct.unit"
                            placeholder="請輸入單位">
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                            <input type="number" class="form-control" id="origin_price"
                            v-model="tempProduct.origin_price"
                            placeholder="請輸入原價">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">售價</label>
                            <input type="number" class="form-control" id="price"
                            v-model="tempProduct.price"
                            placeholder="請輸入售價">
                        </div>
                        </div>
                    <hr>
                        <div class="form-group">
                        <label for="description">產品描述</label>
                        <textarea type="text" class="form-control" id="description"
                            v-model="tempProduct.description"
                            placeholder="請輸入產品描述"></textarea>
                        </div>
                        <div class="form-group">
                        <label for="content">說明內容</label>
                        <textarea type="text" class="form-control" id="content"
                            v-model="tempProduct.content"
                            placeholder="請輸入產品說明內容"></textarea>
                        </div>
                        <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            v-model="tempProduct.is_enabled"
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
                    <button type="button" class="btn btn-info" @click="updateProduct">確認</button>
                </div>
            </div>
        </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="delProduct">確認刪除</button>
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
            products:[],
            pagination: {},
            tempProduct:{},
            isNew:false,
            isLoading: false,
            status: {
                fileUploading: false,
            },
        };
    },
    methods:{
        getProducts(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            //API伺服器路經, 所申請api路徑
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
            });
        },
        openModal(isNew, item){
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            }
            else{
                this.tempProduct = Object.assign({}, item); // 若直接使用this.tempProduct = item 會發生物件傳參考性質 而造成雙方的值都一樣 
                this.isNew = false;
            } 
            $('#productModal').modal('show');
        },
        updateProduct(){
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            //API伺服器路經, 所申請api路徑
            this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
            console.log(response.data);
            if(response.data.success){
                $('#productModal').modal('hide');  //close modal
                vm.getProducts();   //update new list
            }
            else{
                $('#productModal').modal('hide');  //close modal
                vm.getProducts();   //update new list
                console.log('新增失敗');
            }
            });
        },
        delModal(item){
            $('#delProductModal').modal('show');
            this.tempProduct = item;
        },
        delProduct(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
            this.$http.delete(api).then((response) => {
            if(response.data.success){
                $('#delProductModal').modal('hide');  //close modal
                vm.getProducts();   //update new list
            }
             else{
                $('#delProductModal').modal('hide');  //close modal
                vm.getProducts();   //update new list
                console.log('刪除失敗');
            }
            });
        },
        uploadFile(){ //https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
            console.log(this);
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData();
            formData.append('file-to-upload', uploadedFile);
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
            vm.status.fileUploading = true;
            this.$http.post(url, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data'  // 需將物件內改成表單形式
                }
            }).then((response) => {
                console.log(response.data);
                vm.status.fileUploading = false;
                if(response.data.success){
                //vm.tempProduct.imageUrl = response.data.imageUrl; 若只執行此行 則後端無法雙向綁定
                vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl); //使用$set 強制寫入
                }
                else{
                    this.$bus.$emit('message:push', response.data.message, 'danger');
                }
            });
        },
    },
    created(){
        this.getProducts();
    }
}
</script>