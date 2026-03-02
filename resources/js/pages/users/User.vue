<script setup>
import { ref } from 'vue';
import AddUser from "./AddUser.vue";
import InteractiveTable from "@/components/InteractiveTable.vue";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { toast } from "vue3-toastify";
import Paginate from "vuejs-paginate-next";

const isEdit = ref(false);
const user = ref({});
const Users = ref([]);
const page = ref(1);
const search = ref("");
const length = ref(1);
const max = ref(3);
const perUser = ref(JSON.parse(localStorage.getItem("perUser")));
const fields ={
    'الرقم' : 'id',
    'الاسم' : 'name',
  'اسم المستخدم' : 'username',
    'اسم الأب' : 'father_name',
    'المواليد' : 'date_of_birth',
    'الجنس' : 'gender',
    'رقم الهاتف' : 'mobile',
    'الإيميل' : 'email',
    'الدور' : 'role.name_role',

}
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
  { key: "actions", label: "الإجراءات", visible: chickPermission('users','edit'), sortable: false },
  { key: "id", label: "المعرف" },
  { key: "name", label: "الاسم" },
  { key: "username", label: "اسم المستخدم" },
  { key: "email", label: "الإيميل" },
  { key: "mobile", label: "الهاتف" },
  { key: "role.name_role", label: "الدور" },
]);
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
const userEdit = (userSelect) => {
  isEdit.value = true;
  user.value = userSelect;
};
const addUser = () => {
  isEdit.value = true;
  user.value = false;
};
const deleteUser = (userId) => {
  if (!confirm("هل أنت متأكد من حذف المستخدم؟")) {
    return;
  }
  axios
    .delete(`/delete-user/${userId}`)
    .then((res) => {
      notify(res.data.message);
      getUsers(page.value);
    })
    .catch((err) => {
      notifyError(err?.response?.data?.message || "Delete failed");
    });
};
const getUsers= (page) =>{
    axios.get(`index-users?page=${page} && search=${search.value}`).then((res) => {
        Users.value = res.data.users.data;
        length.value = res.data.users.last_page

    });
}
const goBack = (event) => {
  isEdit.value = event;
  user.value = false;
  getUsers(page);
};
onMounted(() => {
    getUsers(page);
});
</script>
<template>
  <div>
    <AddUser v-if="isEdit"  @goBack="goBack($event)" :user="user" />
    <div v-if="!isEdit" class="card o-hidden border-0 shadow-lg my-5 page-card">
      <div class="card-header page-header-bar">
        <div class="page-title-wrap">
          <h4 class="card-title page-title">{{ $t('table') }} {{ $t('users') }}</h4>
          <p class="page-subtitle">إدارة المستخدمين مع بحث سريع وتحكم كامل بالعرض</p>
        </div>
        <div class="page-actions">
          <download-excel
            class="btn btn-success"
            :data="Users"
            :worksheet="'worksheet'"
            :name="'name'"
            :fields="fields"
          >
            {{ $t('download') }}
          </download-excel>
          <v-btn
            v-if="chickPermission('users','create') "
            @click="addUser"
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
            :rows="Users"
            row-key="id"
            :enable-pagination="false"
            search-placeholder="بحث في جدول المستخدمين"
          >
            <template #cell-actions="{ row }">
              <v-btn
                v-if="chickPermission('users','edit')"
                @click="userEdit(row)"
                class="ma-2"
                color="orange-darken-2"
                icon="mdi-pencil"
              ></v-btn>
              <button
                v-if="row.username !== 'admin'"
                @click="deleteUser(row.id)"
                class="btn btn-danger btn-circle btn-sm m-1"
              >
                <i class="fas fa-trash"></i>
              </button>
            </template>
          </InteractiveTable>
          <Paginate
            v-model="page"
            @click="getUsers(page)"
            :page-count="length"
            :page-range="max"
            :prev-text="$t('previous')"
            :next-text="$t('next')"
            :container-class="'pagination'"
            >
            </Paginate>
        </div>
      </div>
    </div>
  </div>
</template>
