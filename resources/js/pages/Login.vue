<script setup>
import { ref } from "vue";
const username = ref("");
const password = ref("");
const ruleUsername=ref([
        v => !!v || 'Username is required',

      ]);
const rulePassword=ref([
        v => !!v || 'password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ]);
const Login = () => {
  if (username.value === "" || password.value === "") {
    alert("Please fill all fields");
  } else {
    axios
      .post("/login", {
        username: username.value,
        password: password.value,
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("token", res.data.access_token);
          window.location.href = "/admin";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }
};
</script>
<template>
    <!-- Outer Row -->
    <v-card
    class="mx-auto"
    width="400"
    prepend-icon="mdi-home"
  >
    <template v-slot:title>
        {{ $t('Login In') }}
    </template>

    <v-card-text>
        <v-sheet max-width="300" class="mx-auto">
    <v-form validate-on="submit lazy" @submit.prevent="Login()">
      <v-text-field
      variant="solo"
        v-model="username"
        :rules="ruleUsername"
        label="username"
        type="text"
      ></v-text-field>
      <v-text-field
      variant="solo"
        v-model="password"
        :rules="rulePassword"
        :label="$t('password')"
        type="password"
      ></v-text-field>
      <v-btn type="submit" block class="mt-2">{{ $t('Login In') }}</v-btn>
    </v-form>



  </v-sheet>
    </v-card-text>
  </v-card>
    
</template>
