import Vue from 'vue';

Vue.prototype.$bus = new Vue();

//Message
// vm.$bus.$emit('message:push', message, status);
// message(string): 訊息內容
// status(string): alert的樣式