<script setup>
import { ref } from 'vue';
import PageAdd from "./PageAdd.vue";
import InteractiveTable from "@/components/InteractiveTable.vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { toast } from "vue3-toastify";
const isEdit = ref(false);
const page = ref({});
const Pages = ref([]);
const notify = (message) => {
  toast.success(message, {
    autoClose: 3000,
    position: toast.POSITION.TOP_CENTER,
  });
};
const notifyError = (message) => {
  toast.error(message, {
    autoClose: 3000,
    position: toast.POSITION.TOP_CENTER,
  });
};
const pageEdit = (pageSelect) => {
  isEdit.value = true;
  page.value = pageSelect;
};
const addPage = () => {
  isEdit.value = true;
  page.value = false;
};
const getPages= () =>{
    axios.get(`get-pages`).then((res) => {
        Pages.value = res.data.pages;

    });
}
const goBack = (event) => {
  isEdit.value = event;
  page.value = false;
  getPages(page);
};
onMounted(() => {
    getPages();
});
const perUser = ref(JSON.parse(localStorage.getItem("perUser")));
const chickPermission=(page,per)=>{
    let permission = perUser.value.find(
        permission => permission.page.page === page
        && permission[per] === 1
        );
        if(permission){
            return true;
        }else{
            return false;
        }
}
const tableColumns = ref([
  { key: "actions", label: "الإجراءات", visible: chickPermission('pages','delete') || chickPermission('pages','edit'), sortable: false },
  { key: "id", label: "المعرف" },
  { key: "page", label: "الاسم" },
]);
</script>
<template>
  <div>
    <PageAdd v-if="isEdit"  @goBack="goBack($event)" :page="page" :Pages="Pages" />
    <div v-if="!isEdit" class="card o-hidden border-0 shadow-lg my-5 page-card">
      <div class="card-header page-header-bar">
        <div class="page-title-wrap">
          <h4 class="card-title page-title">{{ $t('table') }} {{ $t('pages') }}</h4>
          <p class="page-subtitle">إدارة شجرة الصفحات بطريقة منظمة وسهلة التتبع</p>
        </div>
        <div class="page-actions">
          <v-btn
            @click="addPage"
            class="ma-2"
            color="indigo"
            icon="mdi-plus"
          ></v-btn>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <InteractiveTable
            :columns="tableColumns"
            :rows="Pages"
            row-key="id"
            search-placeholder="بحث في جدول الصفحات"
          >
            <template #cell-actions="{ row }">
              <button
                v-if="chickPermission('pages','delete')"
                class="btn btn-danger btn-circle btn-sm m-1"
              >
                <i class="fas fa-trash"></i>
              </button>
              <v-btn
                v-if="chickPermission('pages','edit')"
                @click="pageEdit(row)"
                class="ma-2"
                color="orange-darken-2"
                icon="mdi-pencil"
              ></v-btn>
            </template>
            <template #cell-page="{ value }">
              {{ $t(value) }}
            </template>
          </InteractiveTable>
        </div>
      </div>
    </div>
  </div>
</template>
