<template>
  <div>
    <star-rating v-model:rating="rating" :star-size="30" :show-rating="false"></star-rating>
    <p>Выбранный рейтинг: {{ rating }}</p>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating';
import { ref } from 'vue';

export default {
  components: {
    StarRating
  },
  setup() {
    const rating = ref(0);

    return {
      rating
    };
  }
};
</script>
