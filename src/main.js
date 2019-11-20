// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
import timestampFilter from './filters/timestamp';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;

//Vee Validation 
extend('secret', {
  validate: value => value === 'example',
  message: 'This is not the magic word',
});
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

//Loading overlay
Vue.component('Loading', Loading);

Vue.filter('currency', currencyFilter);
Vue.filter('timestamp', timestampFilter);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
});

router.beforeEach((to, from, next) => {
    console.log('to', to,'from', from, 'next', next);
    if(to.meta.requiresAuth){
      const api = `${process.env.APIPATH}/api/user/check`;
      //API伺服器路經, 所申請api路徑
      axios.post(api).then((response) => {
        if(response.data.success){
          next();
        }
        else{
          next({
            path:'/login'
          });
        }
      });
    }
    else{
      next();
    }
});
