<template>
<div>
    <alert></alert>
    <navbar></Navbar>
    <div class="container-fluid">
    <router-view></router-view>
    <footerContent></footerContent>
    </div>
</div>
</template>

<script>
import navbar from './Navbar';
import footerContent from './Footer';
import alert from './admin/AlertMessage';

export default{
    components:{
        navbar,
        footerContent,
        alert
    },
};

</script>
