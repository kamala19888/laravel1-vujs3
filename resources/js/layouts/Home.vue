<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./SidBarComponent.vue";
import TopBar from "./TopBarComponent.vue";
import Footer from "./FooterComponent.vue";
import { applyThemeMode, getStoredThemeMode, setThemeMode } from "../utils/theme";
const DESKTOP_BREAKPOINT = 1200;
const token = localStorage.getItem("token");
const user = ref("");
const setting = ref({});
const authReady = ref(!token);
const themeMode = ref(getStoredThemeMode());
const activeTheme = ref(applyThemeMode(themeMode.value));
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);
let autoThemeTimer = null;
const route = useRoute();
const Dir = localStorage.getItem("direction");
const textAlign = ref("right");

const isDesktopViewport = () => window.innerWidth >= DESKTOP_BREAKPOINT;

const applyMenuClasses = () => {
  const body = document.body;
  if (!body) {
    return;
  }

  body.classList.remove("menu-collapsed", "menu-expanded", "menu-open", "vertical-overlay-menu", "vertical-menu-modern");
  body.classList.add("footer-fixed");

  if (isDesktopViewport()) {
    body.classList.add("vertical-menu-modern");
    body.classList.add(isSidebarCollapsed.value ? "menu-collapsed" : "menu-expanded");
    isMobileMenuOpen.value = false;
    return;
  }

  body.classList.add("vertical-overlay-menu");
  if (isMobileMenuOpen.value) {
    body.classList.add("menu-open");
  }
};

const handleSidebarToggle = () => {
  if (isDesktopViewport()) {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  } else {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }

  applyMenuClasses();
};

const closeMobileMenu = () => {
  if (!isDesktopViewport() && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false;
    applyMenuClasses();
  }
};

const handleViewportResize = () => {
  applyMenuClasses();
};

const changeThemeMode = (mode) => {
  themeMode.value = mode;
  activeTheme.value = setThemeMode(mode);
};

onMounted(() => {
  activeTheme.value = applyThemeMode(themeMode.value);
  applyMenuClasses();
  window.addEventListener("resize", handleViewportResize);

  autoThemeTimer = window.setInterval(() => {
    if (themeMode.value === "auto") {
      activeTheme.value = applyThemeMode("auto");
    }
  }, 60000);
});

onBeforeUnmount(() => {
  if (autoThemeTimer) {
    window.clearInterval(autoThemeTimer);
  }
  window.removeEventListener("resize", handleViewportResize);
});

watch(() => route.fullPath, () => {
  closeMobileMenu();
});

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
  <div class="app-shell">
    <!-- Sidebar -->
    <Sidebar v-if="token && authReady" :active-theme="activeTheme" @toggleSidebar="handleSidebarToggle" />
    <div
      v-if="token && authReady && isMobileMenuOpen"
      class="sidebar-backdrop"
      @click="closeMobileMenu"
    ></div>
    <!-- End of Sidebar -->
    <!-- Content Wrapper -->
    <div class="app-main-wrapper">
      <!-- Main Content -->
      <div class="app-main-content">
        <!-- Topbar -->
        <TopBar
          v-if="token && authReady"
          @emitToggled="handleSidebarToggle"
          @changeTheme="changeThemeMode"
          :user="user"
          :theme-mode="themeMode"
          :active-theme="activeTheme"
        />
        <!-- End of Topbar -->
        <!-- Begin Page Content -->
        <div
      class="app-content content app-content-fill"
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
      <Footer v-if="token && authReady" :active-theme="activeTheme" />
      <!-- End of Footer -->
    </div>
    <!-- End of Content Wrapper -->
  </div>
</template>
<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-main-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main-content {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.app-content-fill {
  flex: 1 0 auto;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  z-index: 996;
}
</style>
