<script setup>
import { ref } from 'vue';
import RoleAdd from "./RoleAdd.vue";
import InteractiveTable from "@/components/InteractiveTable.vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { toast } from "vue3-toastify";
const isEdit = ref(false);
const role = ref({});
const Roles = ref([]);
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
const roleEdit = (roleSelect) => {
  isEdit.value = true;
  role.value = roleSelect;
};
const addRole = () => {
  isEdit.value = true;
  role.value = false;
};
const getRoles= () =>{
    axios.get(`get-roles`).then((res) => {
        Roles.value = res.data.roles;
    });
}
const goBack = (event) => {
  isEdit.value = event;
  role.value = false;
  getRoles(role);
};
onMounted(() => {
    getRoles();
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
  { key: "actions", label: "الإجراءات", visible: chickPermission('roles','edit') || chickPermission('roles','delete'), sortable: false },
  { key: "id", label: "المعرف" },
  { key: "name_role", label: "الاسم" },
  { key: "deleteAction", label: "حذف", visible: chickPermission('roles','delete'), sortable: false },
]);
</script>
<template>
  <div>
    <RoleAdd v-if="isEdit"  @goBack="goBack($event)" :role="role" />
    <div v-if="!isEdit" class="card o-hidden border-0 shadow-lg my-5 page-card">
      <div class="card-header page-header-bar">
        <div class="page-title-wrap">
          <h4 class="card-title page-title">{{ $t('table') }} {{ $t('roles') }}</h4>
          <p class="page-subtitle">تنظيم الأدوار والصلاحيات بطريقة واضحة وسريعة</p>
        </div>
        <div class="page-actions">
          <v-btn
            v-if="chickPermission('roles','create')"
            @click="addRole"
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
            :rows="Roles"
            row-key="id"
            search-placeholder="بحث في جدول الأدوار"
          >
            <template #cell-actions="{ row }">
              <v-btn
                v-if="chickPermission('roles','edit')"
                @click="roleEdit(row)"
                class="ma-2"
                color="orange-darken-2"
                icon="mdi-pencil"
              ></v-btn>
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
