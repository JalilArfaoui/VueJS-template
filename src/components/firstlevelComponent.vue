<template>
  <li>
    {{ firstLevel.name }}
    <ul>
      <li
        v-for="secondLevel in firstLevel.secondLevels"
        >
        {{ secondLevel.name }}
        <ul>
          <li
            v-for="item in secondLevel.items"
            >
            <div>
              Titre de l'item : {{ item.name }} </br>
              Type : {{ item.type }} </br>
              Consigne : {{ item.consigne }} </br>
              Media : {{ item._mediaIn }} </br>
                <videoPlayer
                  v-if="item._mediaIn"
                  :_videoID="item._mediaIn"
                />
              L'utilisateur doit t'il s'enregistrer ? {{ item.record }} </br>
              Conclusion : {{ item.conclusion }} </br>
              Bouton gauche : {{ item.leftButton }} </br>
              Bouton droit : {{ item.rightButton }} </br>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>

<script>
import videoPlayer from './videoPlayer'

export default {
  components: {
    videoPlayer
  },
  props: {
    firstLevel: {
      type: Object,
      required: true
    }
  }
}
</script>
