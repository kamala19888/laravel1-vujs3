<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import InteractiveTable from "@/components/InteractiveTable.vue";
const isEdit = ref(false);
const permission = ref({});
const Permissions = ref([]);
const role_id = ref(0);
const Roles = ref([]);
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
const getPermissions = () => {
  axios.get(`get-permissions/${role_id.value}`).then((res) => {
    Permissions.value = res.data.permissions;
    // notify(res.data.message);
  });
};
const getPermission = (page_id, role_id, per) => {
  let permission = Permissions.value.find(
    (permission) =>
      permission.page_id === page_id &&
      permission.role_id === role_id &&
      permission[per] === 1
  );
  if (permission) {
    return true;
  } else {
    return false;
  }
};
const getRoles = () => {
  axios.get(`get-roles`).then((res) => {
    Roles.value = res.data.roles;
    Roles.value.push({id:0,name_role:'اختر دور'})
    // notify(res.data.message);
  });
};
const getPages = () => {
  axios.get(`get-pages`).then((res) => {
    Pages.value = res.data.pages;
    // notify(res.data.message);
  });
};
const updatePermission = (page_id, role_id, permission, event) => {
  if (role_id == 0) {
    toast.error("Please select role", {
      autoClose: 500,
      position: toast.POSITION.TOP_CENTER,
    });
    return false;
  }
  axios
    .post(`update-permission`, {
      page_id: page_id,
      role_id: role_id,
      permission: permission,
      event: event,
    })
    .then((res) => {
      if (res.data.status == 401) {
        toast.error(res.data.message, {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
        return false;
      }
      toast.success(res.data.message, {
        autoClose: 100,
        position: toast.POSITION.TOP_CENTER,
      });
    })
    .catch((err) => {
      notifyError(err.response.data.message);
    });
};
onMounted(async () => {
  await getRoles();
  await getPages();
  await getPermissions();
});
const perUser = ref(JSON.parse(localStorage.getItem("perUser")));
const chickPermission = (page, per) => {
  let permission = perUser.value.find(
    (permission) => permission.page.page === page && permission[per] === 1
  );
  if (permission) {
    return true;
  } else {
    return false;
  }
};
const tableColumns = ref([
  { key: "pageName", label: "الصفحة" },
  { key: "read", label: "قراءة", sortable: false },
  { key: "edit", label: "تعديل", sortable: false },
  { key: "create", label: "إنشاء", sortable: false },
  { key: "update", label: "تحديث", sortable: false },
  { key: "delete", label: "حذف", sortable: false },
]);
const permissionRows = ref([]);
watch(role_id, (value) => {
  if (!value || Number(value) === 0) {
    Permissions.value = [];
    return;
  }

  getPermissions();
}, { immediate: true });

watch(Pages, () => {
  permissionRows.value = (Pages.value || []).map((page) => ({
    ...page,
    pageName: page.page,
  }));
}, { immediate: true });
</script>
<template>
  <div>
    <div v-if="!isEdit" class="card o-hidden border-0 shadow-lg my-5 page-card">
      <div class="card-header page-header-bar">
        <div class="page-title-wrap">
          <h4 class="card-title page-title">{{ $t("table") }} {{ $t("permissions") }}</h4>
          <p class="page-subtitle">تعديل صلاحيات الأدوار بشكل مباشر وسريع</p>
        </div>
        <div class="page-actions">
          <v-sheet max-width="230">
            <v-select
              v-model="role_id"
              :label="$t('role')"
              variant="solo"
              :items="Roles"
              item-value="id"
              item-title="name_role"
            >
            </v-select>
          </v-sheet>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <InteractiveTable
            v-if="role_id != 0"
            :columns="tableColumns"
            :rows="permissionRows"
            row-key="id"
            :enable-pagination="false"
            search-placeholder="بحث في صلاحيات الصفحات"
          >
            <template #cell-pageName="{ row }">
              {{ $t(row.page) }}
            </template>
            <template #cell-read="{ row }">
              <input
                type="checkbox"
                :disabled="!chickPermission('permissions', 'update')"
                :checked="getPermission(row.id, role_id, 'read')"
                @change="updatePermission(row.id, role_id, 'read', $event.target.checked)"
              />
            </template>
            <template #cell-edit="{ row }">
              <input
                type="checkbox"
                :disabled="!chickPermission('permissions', 'update')"
                :checked="getPermission(row.id, role_id, 'edit')"
                @change="updatePermission(row.id, role_id, 'edit', $event.target.checked)"
              />
            </template>
            <template #cell-create="{ row }">
              <input
                type="checkbox"
                :disabled="!chickPermission('permissions', 'update')"
                :checked="getPermission(row.id, role_id, 'create')"
                @change="updatePermission(row.id, role_id, 'create', $event.target.checked)"
              />
            </template>
            <template #cell-update="{ row }">
              <input
                type="checkbox"
                :disabled="!chickPermission('permissions', 'update')"
                :checked="getPermission(row.id, role_id, 'update')"
                @change="updatePermission(row.id, role_id, 'update', $event.target.checked)"
              />
            </template>
            <template #cell-delete="{ row }">
              <input
                type="checkbox"
                :disabled="!chickPermission('permissions', 'update')"
                :checked="getPermission(row.id, role_id, 'delete')"
                @change="updatePermission(row.id, role_id, 'delete', $event.target.checked)"
              />
            </template>
          </InteractiveTable>
        </div>
      </div>
    </div>
  </div>
</template>
