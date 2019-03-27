<template>
  <li>
    {{ firstLevel.name }}
    <ul>
      <li
        v-for="secondLevel in firstLevel.secondLevels"
        >
        {{ secondLevel.name }}
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    firstLevel: {
      type: Object,
      required: true
    }
  }
}
</script>
