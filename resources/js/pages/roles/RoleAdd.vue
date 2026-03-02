<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { watchEffect } from "@vue/runtime-core";
const emit = defineEmits(["goBack"]);
const props = defineProps(["role"]);
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
const item = ref({});
const goBack = () => {
  item.value = {};
  emit("goBack", false);
};
const createRole = () => {
  if (item.value.role === "") {
    alert("Please fill all fields");
  } else {
    axios
      .post("/create-role", item.value)
      .then((res) => {
        notify(res.data.message);
        emit("goBack", false);
        item.value = {};
      })
      .catch((err) => {
        notifyError(err.response.data.message);
      });
  }
};
watchEffect(() => {
  if (props.role) {
    item.value = props.role;
  }
});
</script>
<template>
  <v-card class="form-card p-2" prepend-icon="mdi-shield-account-outline">
    <template v-slot:title>
      <span class="form-title">{{ props.role ? $t("update") : $t("create") }} {{ $t('roles') }}</span>
    </template>
    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="createRole()">
        <div class="form-grid">
          <v-sheet class="form-field form-col-12">
            <v-text-field
              v-model="item.name_role"
              :rules="[(v) => !!v || 'role is required']"
              variant="solo"
              :label="$t('role')"
            ></v-text-field>
          </v-sheet>
        </div>
        <div class="form-actions">
          <v-btn
            type="submit"
            :color="props.role ? 'primary' : 'success'"
            :text="props.role ? $t('update') : $t('create')"
          ></v-btn>
          <v-btn
            color="warning"
            @click="goBack()"
            :text="$t('back')"
          ></v-btn>
        </div>
      </v-form>
    </v-card-text>
    <hr />
  </v-card>
</template>
