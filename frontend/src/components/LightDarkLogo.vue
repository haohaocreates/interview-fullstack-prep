<template>
  <div>
    <div class="flex flex-col items-center gap-2 w-full">
      <div class="text-xs text-gray-500">{{ light ? 'Light' : 'Dark' }} mode version22</div>
      <div class="w-full bg-white flex items-center justify-center h-16">
        <img :src="logoUrl" alt="Uploaded Logo" class="w-10 h-10" />
      </div>
      <button class="bg-gray-500 w-full h-10 rounded-xs">
        <div v-if="light" class="text-white text-xs">
          Upload {{ light ? 'light' : 'dark' }} icon
        </div>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      light: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        required: true
      }
    }
  }
</script>
