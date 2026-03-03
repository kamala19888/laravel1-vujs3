<script setup>
import { ref } from 'vue'
import { onMounted } from "@vue/runtime-core";
const emit = defineEmits(["toggleSidebar"]);
onMounted(async () => {
   await  getPages();
});
const props = defineProps([
  "toggled", "activeTheme"]
)
const defaultPages = [
  { id: 'default-admin', page: 'Admin', icon: 'fas fa-fw fa-tachometer-alt', path: '/admin', page_id: 0, pages: [] },
  { id: 'default-users', page: 'Users', icon: 'fas fa-fw fa-users', path: '/users', page_id: 0, pages: [] },
  { id: 'default-roles', page: 'Roles', icon: 'fas fa-fw fa-user-tag', path: '/roles', page_id: 0, pages: [] },
  { id: 'default-pages', page: 'Pages', icon: 'fas fa-fw fa-file', path: '/pages', page_id: 0, pages: [] },
  { id: 'default-permissions', page: 'Permissions', icon: 'fas fa-fw fa-key', path: '/permissions', page_id: 0, pages: [] },
  { id: 'default-profile', page: 'Profile', icon: 'fas fa-fw fa-user', path: '/profile', page_id: 0, pages: [] },
]
const filteredSubPages=(pages,per)=>{
  if (!Array.isArray(pages)) {
    return [];
  }
  return pages.filter((page) => {
        return  chickPermission(page.id,per)}
        )
}
const textAlign = ref("left");
const token = localStorage.getItem("token");
const parseLocalJson = (key, defaultValue) => {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue || rawValue === 'null' || rawValue === 'undefined') {
      return defaultValue;
    }
    const parsed = JSON.parse(rawValue);
    return parsed ?? defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
const setting = parseLocalJson("setting", {});
const normalizeAssetPath = (path, fallbackPath) => {
  if (!path || path === '#') {
    return fallbackPath;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return path.startsWith('/') ? path : `/${path}`;
}
const chickPermission=(page_id,per)=>{
  if (!Array.isArray(perUser.value) || perUser.value.length === 0) {
    return true;
  }
  if (!Array.isArray(perUser.value)) {
    return false;
  }
    let permission = perUser.value.find(
        permission => permission.page_id === page_id
        && permission[per] === 1
        );
        if(permission){
            return true;
        }else{
            return false;
        }
}
const pages = ref([]);
const getPages = async () => {
   await  axios.get(`get-pages`).then((res) => {
    const fetchedPages = Array.isArray(res?.data?.pages) ? res.data.pages : [];
    pages.value = fetchedPages.length > 0 ? fetchedPages : defaultPages;
  }).catch(() => {
    pages.value = defaultPages;
  });
}
const perUser = ref(parseLocalJson("perUser", []));
</script>
<template>
  <!-- BEGIN: Main Menu-->
  <div
    :class="`main-menu menu-fixed menu-accordion menu-shadow ${props.activeTheme === 'dark' ? 'menu-dark' : 'menu-light'}`"
    data-scroll-to-active="true"
    :style="`text-align: ${textAlign}!important`"
  >
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item me-auto">
          <a href="/admin" class="logo logo-light">
            <img
              :src="normalizeAssetPath(setting.logo, '/app-assets/images/1679163509.png')"
              alt=""
              height="60"
            />
          </a>
        </li>
        <li class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pe-0" data-bs-toggle="collapse" href="#" @click.prevent="emit('toggleSidebar')">
            <i
              class="d-block d-xl-none text-primary toggle-icon font-medium-4"
              data-feather="x"
            ></i>
            <i
              class="d-none d-xl-block collapse-toggle-icon font-medium-4 text-primary"
              data-feather="disc"
              data-ticon="disc"
            ></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="shadow-bottom"></div>
    <div  class="main-menu-content">
      <ul
        class="navigation navigation-main"
        id="main-menu-navigation"
        data-menu="menu-navigation"
      >
        <li
          v-for="page in pages" :key="page.id"  :class="`nav-item main ${$route.path === page.path ? 'active' : ''}`"
        >
        <RouterLink
     v-if="page.path != '#' && chickPermission(page.id,'read') && Number(page.page_id) == 0"
     :to="page.path"
     class="nav-link"
     >
            <i :class="page.icon"></i>
            <span>{{ $t(page.page) }}</span>
        </RouterLink>
          <a  v-if="filteredSubPages(page.pages,'read').length > 0 && chickPermission(page.id,'read')"  class="d-flex align-items-center"
             href="#">
            <i :class="page.icon"></i>
            <span class="menu-title text-truncate" data-i18n="Dashboards">
                {{ $t(page.page) }}
            </span>
            <span class="badge badge-light-warning rounded-pill ms-auto me-1">
            </span>
          </a>
          <ul class="menu-content">
            <div >
              <li
              v-for="sub in filteredSubPages(page.pages,'read')"
            :key="sub.id"
                :class=" $route.name == sub.path ? 'active': ''  "
              >
              <RouterLink
              style="height: 50px;"
            :to="sub.path"
             class="collapse-item">
            <i :class="sub.icon"></i>
            <span class="m-2" > {{ $t(sub.page) }}</span>
            </RouterLink>
              </li>
            </div>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.navigation li a i{
    font-size:18px;
  color: currentColor;
}
</style>
