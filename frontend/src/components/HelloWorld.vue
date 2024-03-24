<template>
  <div class="base-container flex flex-col p-10 br-4 font-normal gap-6">
    <div class="font-bold text-left text-white">Technology choice request</div>

    <TextInput
      type="technologyName"
      inputHeader="Technology name"
      placeholderText="Your technology name"
      @input="updateFormData($event, 'technologyName')"
      v-model="formData.technologyName"
      :errorState="errorStates.technologyName"
      :start="start"
    />

    <TextInput
      inputHeader="Description"
      placeholderText="e.g. A C4 model diagramming and modelling tool for agile teams to align on technical decisions."
      messageText="For people new to this technology"
      @input="updateFormData($event, 'description')"
      v-model="formData.description"
      long
    />

    <UploadLogo
      v-model:baseLogoUrl="formData.baseLogoUrl"
      v-model:lightLogoUrl="formData.lightLogoUrl"
      v-model:darkLogoUrl="formData.darkLogoUrl"
      @reset-files="handleResetFiles"
    />

    <TextInput
      type="URL"
      inputHeader="Website URL"
      placeholderText="e.g. icepanel.io"
      @input="updateFormData($event, 'websiteUrl')"
      v-model="formData.websiteUrl"
      :errorState="errorStates.websiteUrl"
    />

    <TextInput
      type="URL"
      inputHeader="Docs URL (optional)"
      placeholderText="e.g. docs.icepanel.io"
      @input="updateFormData($event, 'docsUrl')"
      v-model="formData.docsUrl"
      :errorState="errorStates.docsUrl"
    />

    <TextInput
      type="URL"
      inputHeader="Change log (optional)"
      placeholderText="e.g. icepanel.io/changelog"
      @input="updateFormData($event, 'changeLogUrl')"
      v-model="formData.changeLogUrl"
      :errorState="errorStates.changeLogUrl"
    />

    <DropDown
      v-model="formData.brandColor"
      :selectedColor="selectedColor"
      @update:selectedColor="updateSelectedColor"
    />

    <div v-if="submitReady" class="flex flex-col gap-1">
      <div class="text-sm text-white">Available to all IcePanel customers</div>
      <div class="flex pt-1">
        <input
          v-model="formData.isPublicChecked"
          type="checkbox"
          class="form-checkbox h-4 w-4 mr-2 text-red"
          :style="{ color: formData.isPublicChecked ? 'rgba(27, 203, 245, 1)' : 'white' }"
          @change="handlePublicChange"
        />
        <div class="text-sm text-white">Public tech choice</div>
      </div>
    </div>
    <button
      type="button"
      :class="[submitButtonClass, 'flex gap-2 justify-center items-center w-full h-10 r-1']"
      :style="{ 'background-color': 'rgba(27, 203, 245, 1)' }"
      @click="submitForm"
    >
      <i class="fa-solid fa-paper-plane w-4 h-4"></i>
      <div class="text-sm">Request tech choice</div>
    </button>
  </div>
</template>

<script>
  import UploadLogo from './UploadLogo.vue' // Adjust the path based on your project structure
  import DropDown from './DropDown.vue'
  import TextInput from './TextInput.vue'
  import axios from 'axios'

  export default {
    data() {
      return {
        selectedColor: null,
        submitReady: false,
        start: true,
        formData: {
          technologyName: '',
          description: '',
          baseLogoUrl: '',
          lightLogoUrl: '',
          darkLogoUrl: '',
          websiteUrl: '',
          docsUrl: '',
          changeLogUrl: '',
          brandColor: '',
          isPublicChecked: true
        },
        errorStates: {
          technologyName: false,
          description: false,
          websiteUrl: false,
          docsUrl: false,
          changeLogUrl: false
        }
      }
    },
    methods: {
      handleResetFiles() {
        this.baseLogoUrl = null
        this.lightLogoUrl = null
        this.darkLogoUrl = null
      },
      updateSelectedColor(color) {
        this.selectedColor = color
        this.formData.brandColor = color
      },
      updateFormData(value, formDataType) {
        this.formData[formDataType] = value
      },
      validateUrl(url) {
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/
        return pattern.test(url)
      },
      async technologyNameExist() {
        try {
          const response = await axios.get(
            `http://localhost:3000/tech-name?technologyName=${this.formData.technologyName}`
          )
          const exists = response.data.exists
          return exists
        } catch (error) {
          console.log('Err during technologyNameExist api call: ', error)
        }
      },
      async submitForm() {
        try {
          const nameExists = await this.technologyNameExist()
          this.errorStates.technologyName = nameExists
        } catch (e) {
          console.log('Err during technologyNameExist api call: ', error)
          this.errorStates.technologyName = true
        }

        // check URL fields
        const urlFields = ['websiteUrl', 'docsUrl', 'changeLogUrl']
        urlFields.forEach((field) => {
          if (this.formData[field].length === 0 && field !== 'websiteUrl')
            this.errorStates[field] = false
          else if (!this.validateUrl(this.formData[field])) {
            this.errorStates[field] = true
          } else {
            this.errorStates[field] = false
          }
        })

        const hasError = Object.values(this.errorStates).some((state) => state)
        if (hasError) {
          return
        }

        this.start = false

        try {
          const response = await axios.post(`http://localhost:3000/form`, this.formData)
          console.log('Response from server:', response.data)
        } catch (error) {
          console.error('Error submitting form:', error)
        }
      }
    },
    computed: {
      submitButtonClass() {
        const requiredFields = [
          this.formData.technologyName,
          this.formData.description,
          this.formData.websiteUrl,
          this.formData.baseLogoUrl,
          this.formData.lightLogoUrl,
          this.formData.darkLogoUrl
        ]
        const requiredErrorStates = [
          this.errorStates.technologyName,
          this.errorStates.description,
          this.errorStates.websiteUrl,
          this.errorStates.baseLogoUrl,
          this.errorStates.lightLogoUrl,
          this.errorStates.darkLogoUrl
        ]

        const hasError = Object.values(requiredErrorStates).some((state) => state)

        const isFormReady = requiredFields.every((value) => value !== '')
        this.submitReady = isFormReady && !hasError

        return {
          'opacity-100 hover-pointer': isFormReady,
          'opacity-30 disabled': !isFormReady
        }
      }
    },
    components: {
      UploadLogo,
      TextInput,
      DropDown
    }
  }
</script>

<style scoped>
  .base-container {
    font-family: Arial;
    width: 480px;
    height: auto;
    opacity: 0px;
    background-color: rgba(30, 31, 32, 1);
  }

  .header {
    font-size: 24px;
    line-height: 27.6px;
  }
</style>
