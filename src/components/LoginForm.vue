<template>
  <div class="w-full max-w-md mx-auto">
    <div class="glass-card rounded-3xl p-8 border border-[#e8d2c0] shadow-xl">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 p-0.5 mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <div class="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl">
            🧁
          </div>
        </div>
        <h1 class="text-2xl font-bold font-display text-[#2b1e1a]">
          Panel de Administración
        </h1>
        <p class="text-sm text-[#735a4d] mt-1">
          Ingresa tus credenciales seguras para gestionar el catálogo
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3"
      >
        <svg class="w-5 h-5 shrink-0 mt-0.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#523e32] mb-1.5">
            Usuario
          </label>
          <input
            v-model="username"
            type="text"
            required
            autocomplete="username"
            placeholder="admin"
            class="w-full px-4 py-3 bg-white border border-[#debfa8] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736] focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#523e32] mb-1.5">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-white border border-[#debfa8] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d97736] focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 px-4 rounded-2xl bg-[#d97736] hover:bg-[#c46527] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Iniciando sesión...' : 'Ingresar al Panel' }}</span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-[#f0ded2] text-center">
        <a href="/" class="text-xs font-medium text-[#7d6455] hover:text-[#2b1e1a] transition-colors">
          ← Volver al sitio público
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      errorMessage.value = data.error || 'Credenciales inválidas o error de autenticación.';
      return;
    }

    // Redirect to admin panel
    window.location.href = '/admin';
  } catch (err: any) {
    errorMessage.value = 'Error al conectar con el servidor. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script>
