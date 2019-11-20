<template>
<div>
<nav class="navbar navbar-primary fixed-top bg-dark flex-md-nowrap p-0 shadow">
  <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Twister adminstration system</a>
  <ul class="navbar-nav px-3">
    <li class="nav-item text-nowrap">
      <a class="nav-link" href="#" @click.prevent="signout">Sign out</a>
    </li>
  </ul>
</nav>
</div>
</template>

<script>
export default {
  name: 'navbar',
  methods: {
    signout(){
      const api = `${process.env.APIPATH}/logout`;
           const vm = this;
            //API伺服器路經, 所申請api路徑
            this.$http.post(api).then((response) => {
            console.log(response.data);
            if(response.data.success){
                vm.$router.push('/login');
            }
          });
        }
  } 
}
</script>
