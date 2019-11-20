<template>
<div>
<nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Administration</span>
          <a class="d-flex align-items-center text-muted" href="#">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item ml-4 mt-3">
            <router-link class="nav-link" to="/admin/productlist">
            <i class="fas fa-archive"></i>
            Product List
            </router-link>
          </li>
          <li class="nav-item ml-4 mt-3">
            <router-link class="nav-link" to="/admin/orderlist">
          <i class="far fa-list-alt"></i>            
          Order List
            </router-link>
          </li>
          <li class="nav-item ml-4 mt-3">
            <router-link class="nav-link" to="/admin/Coupon">
            <i class="fas fa-bullhorn"></i>
            Coupon List
            </router-link>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Shop</span>
          <a class="d-flex align-items-center text-muted" href="#">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link ml-4 mt-3" to="/home">
            <i class="fas fa-shopping-cart"></i>
            Shop-Home
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
</div>
</template>