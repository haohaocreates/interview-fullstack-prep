<template>
  <div class="relative flex flex-col bg-red w-100 gap-1">
    <div class="subheader text-white">Brand colour (optional)</div>
    <!-- Dropdown toggle button -->

    <button
      type=""
      @click="toggleDropdown"
      class="dropdown-container w-full px-1 text-gray-700 rounded h-8"
    >
      <div class="flex justify-between pl-6">
        <div :style="{ color: colorMap[selectedColor] || '#84898c' }" class="text-sm">
          {{ selectedColor || 'Select Color' }}
        </div>
        <svg class="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="absolute left-0 pl-2 flex items-center pointer-events-none">
          <i
            class="fa-solid fa-palette"
            :style="{ color: colorMap[selectedColor] || '#84898c' }"
          ></i>
        </div>
      </div>
    </button>

    <!-- Dropdown options -->
    <div v-show="isOpen" class="absolute w-full z-10 bg-white shadow mt-1 rounded">
      <div
        v-for="(color, label) in colorMap"
        :key="color"
        @click="selectColor(label)"
        class="dropdown-option cursor-pointer flex items-center px-2 py-1 hover:bg-gray-100"
      >
        <div class="rounded-full w-4 h-4 mr-2" :style="{ backgroundColor: color }"></div>
        <div>{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isOpen: false
      }
    },
    props: {
      selectedColor: {
        type: String,
        default: ''
      },
      colorMap: {
        type: Object,
        default: () => ({
          Blue: 'rgba(27, 203, 245, 1)',
          DarkBlue: 'rgba(88, 138, 247, 1)',
          Pink: 'rgba(248, 45, 244, 1)',
          Purple: 'rgba(203, 128, 240, 1)',
          Green: 'rgba(146, 221, 120, 1)',
          Yellow: 'rgba(245, 184, 65, 1)',
          Orange: 'rgba(255, 136, 17, 1)',
          Red: 'rgba(235, 110, 110, 1)',
          Beaver: 'rgba(161, 130, 118, 1)',
          Black: 'rgba(59, 60, 62, 1)',
          White: 'rgba(245, 246, 246, 1)'
        })
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
      },
      selectColor(color) {
        this.$emit('update:selectedColor', color)
        this.isOpen = false
      }
    }
  }
</script>

<style scoped>
  .subheader {
    font-size: 12px;
    text-align: left;
  }
  .dropdown-container {
    color: rgba(132, 137, 140, 1);
    background-color: rgba(59, 60, 62, 0.25);
    border-color: rgba(76, 80, 82, 1);
    border-width: 1px;
  }
  .dropdown-option {
    background-color: rgba(30, 31, 32, 1);
    color: white;
  }
</style>
