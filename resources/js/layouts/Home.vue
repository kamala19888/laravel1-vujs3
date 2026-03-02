<script setup>
import { ref } from "vue";
import Sidebar from "./SidBarComponent.vue";
import TopBar from "./TopBarComponent.vue";
import Footer from "./FooterComponent.vue";
const toggled = ref("");
const token = localStorage.getItem("token");
const user = ref("");
const setting = ref({});
const authReady = ref(!token);
const Dir = localStorage.getItem("direction");
const textAlign = ref("right");
if(token){
axios.get('/user').then((res) => {
      user.value = res.data.user;
  const settingData = res?.data?.setting ?? {};
  setting.value = settingData;
      const permissions = res?.data?.user?.role?.permissions ?? [];
      localStorage.setItem("perUser", JSON.stringify(permissions));
  localStorage.setItem("setting", JSON.stringify(settingData));
      authReady.value = true;
    }).catch((error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("perUser");
        localStorage.removeItem("setting");
        window.location.href = "/login";
      } else {
        authReady.value = true;
      }
    });
}
</script>
<template>
  <div  >
    <!-- Sidebar -->
    <Sidebar v-if="token && authReady" :toggled="toggled" />
    <!-- End of Sidebar -->
    <!-- Content Wrapper -->
    <div  >
      <!-- Main Content -->
      <div  >
        <!-- Topbar -->
        <TopBar v-if="token && authReady" @emitToggled="toggled = $event" :user="user" />
        <!-- End of Topbar -->
        <!-- Begin Page Content -->
        <div
    class="app-content content"
    :style="`text-align: ${textAlign}!important`"
  >
  <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
        <v-locale-provider :rtl="Dir=='rtl'">
          <router-view :user="user" ></router-view>
        </v-locale-provider>
        </div>
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- End of Main Content -->
      <!-- Footer -->
      <Footer v-if="token && authReady" />
      <!-- End of Footer -->
    </div>
    <!-- End of Content Wrapper -->
  </div>
</template>
<style scoped>
</style>
