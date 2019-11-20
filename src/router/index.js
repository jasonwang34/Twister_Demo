import Vue from 'vue';
import VueRouter from 'vue-router';
//官方文件

import Index from '@/components/index';
import Home from '@/components/Home';
import About from '@/components/About';
import Login from '@/components/admin/login';
import Dashboard from '@/components/admin/Dashboard';
import ProductList from '@/components/admin/ProductList';
import Products from '@/components/Products';
import Product from '@/components/Product';
import CheckOut from '@/components/CheckOut';
import CustomerCheckout from '@/components/CustomerCheckout';
import OrderList from '@/components/admin/OrderList';
import Coupon from '@/components/admin/Coupon';



//自訂文件

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path:'*',
            redirect:'/home',
        },
        {
            name:'首頁', //元件呈現的名稱  
            path:'/',   //對應的虛擬路徑
            redirect:'/home',
            name: 'index',
            component:Index, //對應的元件
            children: [
                {
                    path:'home',
                    name:'Home',
                    component: Home, 
                },
                {
                    path:'about',
                    name:'About',
                    component: About,
                },
                {
                    path:'products',
                    name:'Products',
                    component: Products, 
                    children: [
                        {
                            path: 'laptop',
                            name: 'Laptop',
                            components: {
                                default: Products,
                            },
                            meta: { scroll: true },
                        },
                        {
                            path: 'headphone',
                            name: 'Headphone',
                            components: {
                                default: Products,
                            },
                            meta: { scroll: true },
                        },
                        {
                            path: 'speaker',
                            name: 'Speaker',
                            components: {
                                default: Products,
                            },
                            meta: { scroll: true },
                        },
                        {
                            path: 'phone',
                            name: 'Phone',
                            components: {
                                default: Products,
                            },
                            meta: { scroll: true },
                        },
                    ]
                },
                {
                    path:'product/:id',
                    name:'Product',
                    component: Product, 
                },
                {
                    path:'checkout',
                    name:'CheckOut',
                    component: CheckOut, 
                },
                {
                    path:'customer_checkout/:orderId',
                    name:'CustomerCheckout',
                    component: CustomerCheckout, 
                },
            ]
        },
        {
            path:'/login',
            name:'login',
            component: Login,
        },
        {
            path:'/admin',
            name: 'Dashboard',
            component: Dashboard,
            children: [
                {
                    path:'productlist',
                    name:'ProductList',
                    component: ProductList, 
                    meta: { requiresAuth: true },
                },
                {
                    path:'coupon',
                    name:'Coupon',
                    component: Coupon, 
                    meta: { requiresAuth: true },
                },
                {
                    path:'orderlist',
                    name:'OrderList',
                    component: OrderList, 
                    meta: { requiresAuth: true },
                },
            ]
        },
    ]
});