<template>
  <svg
    class="smiling-sun"
    fill="none"
    height="56"
    version="1.1"
    viewBox="0 0 56 56"
    width="56"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern
        id="red-bars-bg"
        width="1.6175"
        height="2.25"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45 50 50)">
        <line class="red-hatching" stroke="var(--tsf-red)" stroke-width="1px" y2="10" />
      </pattern>
    </defs>
    <ellipse
      id="circle"
      cx="27.767"
      cy="27.946"
      rx="12.688"
      ry="12.685"
      class="tsf-lines tsf-lines--rounded red-bars" />
    <g class="sunbeams" :class="beamClass">
      <g class="red-triangles tsf-shapes tsf-lines red-shapes">
        <path id="north" d="m26.055 9.7266 3.418-0.007825-1.6992-7.125z" />
        <path id="south" d="m29.458 46.51-3.4179 0.01493 1.7141 7.1214z" />
        <path id="west" d="m9.5004 29.928-0.0148-3.4179-7.1215 1.7138z" />
        <path id="east" d="m46.504 26.477-0.0037 3.418 7.1307-1.6752z" />
      </g>
      <g class="white-triangles tsf-shapes tsf-lines white-shapes">
        <path id="north-west" d="m8.9453 9.4141 7.5469 4.625-2.9102 2.9219z" />
        <path id="south-east" d="m46.556 47.066-7.5452-4.6277 2.9112-2.9208z" />
        <path id="south-west" d="m8.9356 47.033 4.6556-7.528 2.91 2.922z" />
        <path id="north-east" d="m46.59 9.4094-4.6411 7.537-2.9157-2.9164z" />
      </g>
    </g>
    <g class="face tsf-lines tsf-lines--rounded ">
      <path id="left-eye" d="m20.335 24.97c0.07966-2.258 3.37-2.4813 3.5355 0.0058" />
      <path id="right-eye" d="m31.492 24.953c0.32031-2.5638 3.5312-2.1003 3.5625 0.03125" />
      <path id="mouth" d="m20.55 29.08c0.43458 9.0745 13.697 9.7301 14.429-0.08839" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: { type: Boolean, required: false, default: false },
});

const beamClass = computed(() => `sunbeams ${(props.loading) ? 'rotating' : 'pulsing'}`);
</script>
