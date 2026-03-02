<script setup>
import { ref } from 'vue';
import AppFontAdd from "./AppFontAdd.vue";
import InteractiveTable from "@/components/InteractiveTable.vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { toast } from "vue3-toastify";
const isEdit = ref(false);
const appFont = ref({});
const AppFonts = ref([]);
const tableRows = ref([]);
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
const appFontEdit = (appFontSelect) => {
  isEdit.value = true;
  appFont.value = appFontSelect;
};
const addAppFont = () => {
  isEdit.value = true;
  appFont.value = false;
};
const getAppFonts= () =>{
    axios.get(`get-app-fonts`).then((res) => {
        AppFonts.value = res.data.appFonts;
        tableRows.value = (res.data.appFonts || []).map((item) => ({
          ...item,
          fontInfo: `${item.name_font || ''} ${item.path || ''}`.trim(),
        }));

    });
}
const goBack = (event) => {
  isEdit.value = event;
  appFont.value = false;
  getAppFonts(appFont);
};
onMounted(() => {
    getAppFonts();
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
  { key: "actions", label: "الإجراءات", visible: chickPermission('appFonts','delete') || chickPermission('appFonts','edit'), sortable: false },
  { key: "id", label: "المعرف" },
  { key: "fontInfo", label: "الاسم" },
  { key: "deleteAction", label: "حذف", visible: chickPermission('appFonts','delete'), sortable: false },
]);
</script>
<template>
  <div>
    <AppFontAdd v-if="isEdit"  @goBack="goBack($event)" :appFont="appFont" />
    <div v-if="!isEdit" class="card o-hidden border-0 shadow-lg my-5 page-card">
      <div class="card-header page-header-bar">
        <div class="page-title-wrap">
          <h4 class="card-title page-title">{{ $t('table') }} {{ $t('appFonts') }}</h4>
          <p class="page-subtitle">إدارة الخطوط المرفوعة وتفعيلها داخل النظام</p>
        </div>
        <div class="page-actions">
          <v-btn
            v-if="chickPermission('appFonts','create')"
            @click="addAppFont"
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
            :rows="tableRows"
            row-key="id"
            search-placeholder="بحث في خطوط التطبيق"
          >
            <template #cell-actions="{ row }">
              <v-btn
                v-if="chickPermission('appFonts','edit')"
                @click="appFontEdit(row)"
                class="ma-2"
                color="orange-darken-2"
                icon="mdi-pencil"
              ></v-btn>
            </template>
            <template #cell-fontInfo="{ row }">
              {{ row.name_font }} <br />
              {{ row.path }}
            </template>
            <template #cell-deleteAction>
              <button class="btn btn-danger btn-circle btn-sm m-1">
                <i class="fas fa-trash"></i>
              </button>
            </template>
          </InteractiveTable>
        </div>
      </div>
    </div>
  </div>
</template>
