<template>
  <ion-item>
    <ion-thumbnail slot="start">
      <ion-img :src="offer.imageURL"></ion-img>
    </ion-thumbnail>
    <ion-label>
      <h1>{{ offer.title }}</h1>
      <div class="offer-details">
        <ion-icon name="calendar" color="primary"></ion-icon>
        <ion-text color="tertiary" class="space-left">{{ offer.availableFrom | date }}</ion-text>
        <span class="space-left">to</span>
        <ion-icon name="calendar" color="primary" class="space-left"></ion-icon>
        <ion-text color="tertiary" class="space-left">{{ offer.availableTo | date }}</ion-text>
      </div>
    </ion-label>
  </ion-item>
</template>

<script>
import { calendar } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'ios-calendar': calendar.ios,
  'md-calendar': calendar.md
});

export default {
  props: {
    offer: Object
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 18px;
  border: 1px solid var(--ion-color-primary);
  padding: 8px;
  border-radius: 5px;
  color: var(--ion-color-primary);
}
.offer-details {
  display: flex;
  align-items: center;
}

.space-left {
  margin-left: 5px;
}
</style>
