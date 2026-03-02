<script setup>
import { ref } from 'vue';
import GeneralSettingAdd from "./GeneralSettingAdd.vue";
import InteractiveTable from "@/components/InteractiveTable.vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { toast } from "vue3-toastify";
const isEdit = ref(false);
const generalSetting = ref({});
const GeneralSettings = ref([]);
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
const generalSettingEdit = (generalSettingSelect) => {
  isEdit.value = true;
  generalSetting.value = generalSettingSelect;
};
const addGeneralSetting = () => {
  isEdit.value = true;
  generalSetting.value = false;
};
const getGeneralSettings= () =>{
    axios.get(`get-general_settings`).then((res) => {
        GeneralSettings.value = res.data.GeneralSettings;
        tableRows.value = (res.data.GeneralSettings || []).map((item) => ({
          ...item,
          info: `${item.name || ''} ${item.logo || ''}`.trim(),
          fontInfo: `${item?.font?.name_font || ''} ${item?.font_size || ''}`.trim(),
        }));

    });
}
const goBack = (event) => {
  isEdit.value = event;
  generalSetting.value = false;
  getGeneralSettings(generalSetting.value);
};
onMounted(() => {
    getGeneralSettings();
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
  { key: "actions", label: "الإجراءات", visible: chickPermission('GeneralSettings','delete') || chickPermission('GeneralSettings','edit'), sortable: false },
  { key: "id", label: "المعرف" },
  { key: "info", label: "الاسم" },
  { key: "fontInfo", label: "الخط" },
  { key: "deleteAction", label: "حذف", visible: chickPermission('GeneralSettings','delete'), sortable: false },
]);
</script>
<template>
  <div>
    <GeneralSettingAdd v-if="isEdit"  @goBack="goBack($event)" :generalSetting="generalSetting" />
    <div v-if="!isEdit" class="card o-hidden border-0 shadow-lg my-5 page-card">
      <div class="card-header page-header-bar">
        <div class="page-title-wrap">
          <h4 class="card-title page-title">{{ $t('table') }} {{ $t('GeneralSettings') }}</h4>
          <p class="page-subtitle">ضبط الهوية العامة والخطوط والإعدادات المركزية</p>
        </div>
        <div class="page-actions">
          <v-btn
            v-if="chickPermission('GeneralSettings','create')"
            @click="addGeneralSetting"
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
            search-placeholder="بحث في الإعدادات العامة"
          >
            <template #cell-actions="{ row }">
              <v-btn
                v-if="chickPermission('GeneralSettings','edit')"
                @click="generalSettingEdit(row)"
                class="ma-2"
                color="orange-darken-2"
                icon="mdi-pencil"
              ></v-btn>
            </template>
            <template #cell-info="{ row }">
              {{ row.name }} <br />
              {{ row.logo }}
            </template>
            <template #cell-fontInfo="{ row }">
              {{ row.font?.name_font }} <br />
              {{ row.font_size }}
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
