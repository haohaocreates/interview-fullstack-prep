<template>
  <div class="flex flex-col">
    <!-- Input header -->
    <label class="text-xs text-white">{{ inputHeader }}</label>

    <!-- Input field -->
    <div class="relative py-2">
      <input
        v-model="inputValue"
        :placeholder="placeholderText"
        @focus="handleFocus"
        @blur="handleBlur"
        class="inputbox h-8 bg-gray-200 text-white placeholder-gray-500 rounded px-2 w-full whitespace-normal"
        :class="inputStateClass"
      />
      <div
        v-if="type === 'URL'"
        class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"
      >
        <i class="fa-solid fa-globe" style="color: #84898c"></i>
      </div>
    </div>

    <div class="text-xs text-left text-gray-600" :class="messageStateClass">
      {{ handleOptionalMessage() }}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      inputHeader: {
        type: String,
        required: true
      },
      placeholderText: {
        type: String,
        required: true
      },
      state: {
        type: String,
        default: 'default'
      },
      long: {
        type: Boolean,
        default: false
      },
      messageText: {
        type: String,
        default: ''
      },
      stateMessageText: {
        type: String,
        default: ''
      },
      errorState: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      start: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        inputValue: '',
        isFocused: false
      }
    },
    computed: {
      inputStateClass() {
        return {
          'border-blue-custom': this.isFocused,
          'border-green-300': !this.errorState && this.type === 'technologyName' && !this.start,
          'border-red-300':
            (this.errorState && this.type === 'URL') ||
            (this.errorState && this.type === 'technologyName' && !this.start),
          'h-8': !this.long,
          'min-h-12 inputbox-long placeholder:-translate-y-2': this.long,
          'pl-8': this.type === 'URL'
        }
      },
      messageStateClass() {
        return {
          'text-green-300': !this.errorState && this.type === 'technologyName',
          'text-red-300':
            (this.errorState && this.type === 'URL') ||
            (this.errorState && this.type === 'technologyName' && !this.start)
        }
      }
    },
    methods: {
      handleOptionalMessage() {
        let error = ''
        if (this.type === 'URL' && this.errorState) error = 'This is not a valid URL'
        else if (this.type === 'technologyName' && this.errorState)
          error = 'This name already exists!'
        else if (this.type === 'technologyName' && !this.errorState && !this.start)
          error = "Cool - this hasn't been added yet!"
        else error = ''
        return error
      },
      handleFocus() {
        this.isFocused = true
      },
      handleBlur() {
        this.isFocused = false
        this.$emit('input', this.inputValue) // Emit input event with updated value
      }
    }
  }
</script>

<style scoped>
  .inputbox {
    background-color: rgba(59, 60, 62, 0.25);
    font-size: 14px;
    overflow-y: auto;
  }
  .inputbox-long::placeholder {
    white-space: normal;
    line-height: normal;
    display: table-cell;
    vertical-align: middle;
  }
  .default-border-color {
    border-color: rgba(76, 80, 82, 1);
  }
  .border-blue-custom {
    border-color: rgba(98, 226, 254, 1);
  }
</style>
