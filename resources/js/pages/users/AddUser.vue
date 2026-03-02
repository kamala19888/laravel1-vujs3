<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";

import { onMounted, watchEffect } from "@vue/runtime-core";
const emit = defineEmits(["goBack"]);
const props = defineProps(["user"]);
onMounted(  () => {
    getRoles();
});
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
const id = ref("");
const name = ref("");
const username = ref("");
const email = ref("");
const father_name = ref("");
const date_of_birth = ref("");
const gender = ref("");
const mobile = ref("");
const password = ref("");
const password_confirmation = ref("");
const role_id = ref("");
const Roles = ref([]);
const getRoles = () => {
  axios.get("/get-roles").then((res) => {
    Roles.value = res.data.roles;
  });
};
const genders = ref(["ذكر","أنثى"]);
const confirmPass = () => {
  if (password.value !== password_confirmation.value) {
    alert("Password not match");
  }
};
const goBack = () => {
  name.value = "";
  username.value = "";
  email.value = "";
  father_name.value = "";
  gender.value = "";
  date_of_birth.value = "";
  mobile.value = "";
  password.value = "";
  password_confirmation.value = "";
  emit("goBack", false);
};
const createUser = () => {
  if (
    (name.value === "" ||
      username.value === "" ||
      email.value === "" ||
      password.value === "" ||
      password_confirmation.value === "") &&
    !props.user
  ) {
    alert("Please fill all fields");
  } else if (name.value === "" || username.value === "" || email.value === "") {
    alert("Please fill all fields");
  } else {
    axios
      .post("/create-user", {
        id: id.value,
        name: name.value,
        username: username.value,
        email: email.value,
        father_name: father_name.value,
        gender: gender.value,
        date_of_birth: date_of_birth.value,
        mobile: mobile.value,
        password: password.value,
        role_id: role_id.value,
        password_confirmation: password_confirmation.value,
      })
      .then((res) => {
        notify(res.data.message);
        emit("goBack", false);
        id.value = "";
        name.value = "";
        username.value = "";
        email.value = "";
        father_name.value = "";
        gender.value = "";
        date_of_birth.value = "";
        mobile.value = "";
        password.value = "";
        password_confirmation.value = "";
        role_id.value = "";
      })
      .catch((err) => {
        notifyError(err.response.data.message);
      });
  }
};
const rulePassword=ref([
        v => !!v || 'password is required',
  v => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ]);
watchEffect(() => {
  if (props.user) {
    id.value = props.user.id;
    name.value = props.user.name;
    username.value = props.user.username;
    email.value = props.user.email;
    father_name.value = props.user.father_name;
    date_of_birth.value = props.user.date_of_birth;
    gender.value = props.user.gender;
    mobile.value = props.user.mobile;
    role_id.value = props.user.role_id;
  }
});
</script>
<template>
  <v-card class="form-card p-2" prepend-icon="mdi-account-plus-outline">
    <template v-slot:title>
      <span class="form-title">{{ props.user ? $t("update") : $t("create") }} {{ $t('users') }}</span>
    </template>

    <v-card-text>
      <v-form validate-on="submit lazy" @submit.prevent="createUser()">
        <div class="form-grid">
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="name"
              :rules="[v => !!v || 'name is required']"
              variant="solo"
              :label="$t('name')"

            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="father_name"
              :rules="[v => !!v || 'father_name is required']"
              variant="solo"
              :label="$t('father name')"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="date_of_birth"
              :rules="[v => !!v || 'date_of_birth is required']"
              variant="solo"
              type="number"
              :label="$t('date of birth')"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="mobile"
              :rules="[v => !!v || 'mobile is required']"
              variant="solo"
              type="number"
              :label="$t('mobile')"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="username"
              :rules="[v => !!v || 'username is required']"
              variant="solo"
              label="username"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
            <v-text-field
              v-model="email"
              :rules="[v => !!v || 'email is required']"
              variant="solo"
              type="email"
              :label="$t('email')"
            ></v-text-field>
          </v-sheet>
          <v-sheet class="form-field form-col-6">
             <v-select
              v-model="gender"
              :rules="[v => !!v || 'gender is required']"
              variant="solo"
              :label="$t('gender')"
              :items="genders"
              return-object
            ></v-select>
          </v-sheet>
          <v-sheet class="form-field form-col-6">

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
            <div v-if="!props.user" class="form-col-12 form-grid">
              <div class="form-col-6">
                    <v-text-field
                    variant="solo"
                        v-model="password"
                        :rules="rulePassword"
                        :label="$t('password')"
                        type="password"
                    ></v-text-field>
              </div>
              <div class="form-col-6">
                <v-text-field
                variant="solo"
                    v-model="password_confirmation"
                    :rules="rulePassword"
                    @change="confirmPass()"
                    :label="$t('password_confirmation')"
                    type="password"
                ></v-text-field>
              </div>
            </div>
        </div>
          <div class="form-actions">
            <v-btn
            v-if="chickPermission('users', 'create') || chickPermission('users', 'update')"
              type="submit"
              :color="props.user ?'primary':'success' "
              :text="props.user ? $t('update') : $t('create')"
            ></v-btn>

            <v-btn
            color="warning"
             @click="goBack"
              :text="$t('back')"
            ></v-btn>
          </div>
      </v-form>
    </v-card-text>


    <hr />
  </v-card>
</template>
