<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between">
      <div class="text-xs text-white text-left">Icon</div>
      <div v-if="!baseLogoUrl"></div>
      <div v-else class="flex text-gray-500 text-xs align-center gap-2">
        <div>Reset</div>
        <button @click="handleResetFile">
          <i class="fas fa-undo w-4 h-4"></i>
        </button>
      </div>
    </div>
    <div v-if="!baseLogoUrl">
      <div
        class="icon-box-container w-full h-32 gap-4 bg-gray-500 flex flex-col justify-center items-center"
      >
        <div class="gap-2 flex flex-col justify-center">
          <div class="w-full subheader text-center align-center">Drag and drop image here</div>
          <div class="subheader text-center">Format: SVG / PNG / JPEG</div>
        </div>
        <label
          for="base-file-upload"
          class="icon-upload-container w-52 cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 text-center rounded text-white"
        >
          Click to choose image
        </label>
        <input
          id="base-file-upload"
          type="file"
          @change="handleFileUpload($event, 'baseLogoUrl')"
          class="hidden"
        />
      </div>
      <div class="subheader">Max file size: 5mb</div>
    </div>
    <div v-else>
      <div class="flex items-center justify-center gap-6 p-2 bg-gray-800">
        <div class="flex flex-col items-center gap-2 w-full">
          <div class="text-xs text-gray-500">Light mode version</div>
          <div class="w-full bg-white flex items-center justify-center h-16 rounded-md">
            <img :src="lightLogoUrl" alt="Uploaded Logo" class="w-10 h-10" />
          </div>
          <label
            for="light-file-upload"
            class="flex items-center justify-center bg-gray-500 w-full h-10 rounded-md text-white text-xs cursor-pointer"
            >Upload light icon</label
          >
          <input
            id="light-file-upload"
            type="file"
            @change="handleFileUpload($event, 'lightLogoUrl')"
            class="hidden"
          />
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
          <div class="text-xs text-gray-500">Dark mode version</div>
          <div class="w-full bg-black flex items-center justify-center h-16 rounded-md">
            <img :src="darkLogoUrl" alt="Uploaded Logo" class="w-10 h-10" />
          </div>
          <label
            for="dark-file-upload"
            class="flex items-center justify-center bg-gray-500 w-full h-10 rounded-md text-white text-xs cursor-pointer"
            >Upload dark icon</label
          >
          <input
            id="dark-file-upload"
            type="file"
            @change="handleFileUpload($event, 'darkLogoUrl')"
            class="hidden"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LightDarkLogo from './LightDarkLogo.vue'
  import Compressor from 'compressorjs'
  export default {
    data() {
      return {
        baseLogoUrl: null,
        lightLogoUrl: null,
        darkLogoUrl: null
      }
    },
    components: {
      LightDarkLogo
    },

    methods: {
      handleFileUpload(event, logoType) {
        if (!event.target.files || event.target.files.length === 0) {
          return // No files selected
        }

        const file = event.target.files[0]

        if (!file) return

        if (!file.type.startsWith('image/')) {
          alert('Please select an image file.')
          return
        }
        new Compressor(file, {
          quality: 0.5, // Set the desired quality (0 to 1)
          maxWidth: 50, // Set your maximum width here
          maxHeight: 50, // Set your maximum height here
          success: (compressedFile) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              console.log('e.target.result: ', e.target.result)
              this[logoType] = e.target.result
              if (logoType === 'baseLogoUrl') {
                this.lightLogoUrl = e.target.result
                this.darkLogoUrl = e.target.result
              }
            }
            reader.readAsDataURL(compressedFile)
          },
          error: (err) => {
            console.error('Image compression error:', err)
          }
        })
      },
      handleResetFile() {
        this.baseLogoUrl = null
        this.lightLogoUrl = null
        this.darkLogoUrl = null
        this.$emit('reset-files')
      }
    },

    watch: {
      baseLogoUrl(newValue) {
        this.$emit('update:baseLogoUrl', newValue)
      },
      lightLogoUrl(newValue) {
        this.$emit('update:lightLogoUrl', newValue)
      },
      darkLogoUrl(newValue) {
        this.$emit('update:darkLogoUrl', newValue)
      }
    }
  }
</script>

<style scoped>
  .icon-box-container {
    background-color: rgba(59, 60, 62, 0.25);
  }
  .icon-upload-container {
    background-color: rgba(90, 94, 96, 1);
    font-size: 12px;
  }
  .subheader {
    font-family: Arial;
    font-size: 12px;
    font-weight: 400;
    line-height: 13.8px;
    color: rgba(132, 137, 140, 1);
  }
</style>
