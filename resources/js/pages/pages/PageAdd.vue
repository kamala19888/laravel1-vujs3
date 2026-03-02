<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { watchEffect } from "@vue/runtime-core";
const emit = defineEmits(["goBack"]);
const props = defineProps(["page", "Pages"]);
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
const item = ref({});
const goBack = () => {
  item.value = {};
  emit("goBack", false);
};
const createPage = () => {
  if (item.value.page === "") {
    alert("Please fill all fields");
  } else {
    axios
      .post("/create-page", item.value)
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
  if (props.page) {
    item.value = props.page;
  } else {
    item.value = {
      page: "",
      path: "#",
      icon: "fa-file-text-o",
      page_id: 0,
      order: 0,
    };
  }
  if (props.Pages) {
    Pages.value = props.Pages;
    Pages.value.push({ id: 0, page: "no page" });
  }
});
</script>
<template>
  <v-card class="form-card p-2" prepend-icon="mdi-file-tree-outline">
    <template v-slot:title>
      <span class="form-title">{{ props.page ? $t("update") : $t("create") }} {{ $t('pages') }}</span>
    </template>

    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="createPage()">
        <div class="form-grid">
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="item.page"
              :rules="[(v) => !!v || 'page is required']"
              variant="solo"
              :label="$t('page')"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="item.path"
              :rules="[(v) => !!v || 'path is required']"
              variant="solo"
              :label="$t('path')"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="item.icon"
              :rules="[(v) => !!v || 'icon is required']"
              variant="solo"
              :label="$t('icon')"
            ></v-text-field>
          </v-sheet>

          <v-sheet class="form-field form-col-6">
            <v-select
              v-model="item.page_id"
              :label="$t('page')"
              variant="solo"
              :items="Pages"
              item-value="id"
              item-title="page"
            >
            </v-select>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="item.order"
              :rules="[(v) => !!v || 'order is required']"
              variant="solo"
              :label="$t('order')"
            ></v-text-field>
          </v-sheet>
        </div>
        <div class="form-actions">
            <v-btn
              type="submit"
              :color="props.page ?'primary':'success' "
              :text="props.page ? $t('update') : $t('create')"
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
