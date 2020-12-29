<template>
  <div>
    <div class="picker">
      <ion-img
        v-if="selectedImage"
        :src="selectedImage"
        class="image"
        role="button"
        @click="onPickImage"
      ></ion-img>
      <ion-button v-if="!selectedImage" color="primary" @click="onPickImage"
        ><ion-icon name="camera" slot="start"></ion-icon
        ><ion-label>Take Picture</ion-label></ion-button
      >
    </div>
    <input
      type="file"
      accept="image/jpeg"
      v-if="usePicker"
      ref="filePicker"
      @change="onFileChosen"
    />
  </div>
</template>

<script>
import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { isPlatform } from '@ionic/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';

addIcons({
  'ios-camera': camera.ios,
  'md-camera': camera.md
});

export default {
  data() {
    return {
      selectedImage: null
    };
  },
  methods: {
    usePicker() {
      return (isPlatform('mobile') && !isPlatform('hybrid')) || isPlatform('desktop');
    },
    onPickImage() {
      if (!Capacitor.isPluginAvailable('Camera') || this.usePicker()) {
        this.$refs.filePicker.click();
        return;
      }
      Plugins.Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt,
        correctOrientation: true,
        width: 600,
        resultType: CameraResultType.DataUrl
      }).then(image => {
        this.selectedImage = image.dataUrl;
        this.$emit('imagePick', image.dataUrl);
      });
    },
    onFileChosen(event) {
      const pickedFile = event.target.files[0];
      if (!pickedFile) {
        return;
      }
      const fr = new FileReader();
      fr.onload = () => {
        const dataUrl = fr.result.toString();
        this.selectedImage = dataUrl;
        this.$emit('imagePick', pickedFile);
      };
      fr.readAsDataURL(pickedFile);
    }
  }
};
</script>

<style lang="scss" scoped>
.picker {
  width: 30rem;
  max-width: 80%;
  height: 20rem;
  max-height: 30vh;
  border: 1px solid var(--ion-color-primary);
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// Sneaky sneaky. The input is still in the DOM, but not displayed.
// We do the clicking through js.
input[type='file'] {
  display: none;
}
</style>
