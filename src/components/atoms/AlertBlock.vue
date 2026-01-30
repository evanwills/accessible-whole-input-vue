<template>
  <Transition
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="!dismissed" :class="wrapClass" :role="role">
      <TsfLoadingSpinner
        v-if="icon === 'ring' && noIcon === false"
        :class="iconClass"
        ring />
      <span
        v-if="symbol && noIcon === false"
        aria-hidden="true"
        :class="iconClass">{{ symbol }}</span>
      <div class="flex flex-col gap-y-2">
        <component
          v-if="heading.trim() !== ''"
          :class="hClass"
          :is="hTag">
          {{ heading }}
        </component>

        <slot>
          <div :class="bodyClass" v-html="body"></div>
        </slot>

        <slot name="button">
          <p v-if="showLink" class="mb-0">
            <a class="btn-east-rt !py-4 inline-block text-bold-md" :href="linkUrl">
              {{ linkTxt }}
            </a>
          </p>
        </slot>
      </div>

      <button
        v-if="dismissable"
        class="absolute top-0 right-0 bg-transparent p-4 material-symbols-rounded text-[1.25rem]"
        type="button"
        v-on:click="dismiss">Close</button>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { isNonEmptyStr } from '../../utils/data-utils';
import { getHtag } from '../../utils/vue-utils';
import {
  getTwStatusColours,
  getTwStatusIcon,
  getTwStatusTxtColour,
} from '../../utils/status-class-utils';
import ConsoleLogger from '../../utils/ConsoleLoggerDummy.class';
import TsfLoadingSpinner from './TsfLoadingSpinner.vue';

// --------------------------------------------------
// START: Component config

const emit = defineEmits(['dismissed']);

//  END:  Component config
// --------------------------------------------------
// START: Properties/attributes

const props = defineProps({
  /**
   * Body content for the alert block
   *
   * > __Note:__ Body content can also be passed in via the
   * >           component's default slot
   *
   * > __Note also:__ You could use the body slot to render the
   * >           entire contents of the component if you leave all
   * >           other properties empty
   * >           (except `type` for non-error alerts)
   *
   * @property {string} body
   */
  body: { type: String, required: false, default: '' },

  /**
   * Whether or not this alert can be dismissed
   *
   * @property {boolean} dismissable
   */
  dismissable: { type: Boolean, required: false, default: false },

  /**
   * Whether or not this alert block should span the full width of
   * the containing box
   *
   * @property {boolean} fullWidth
   */
  fullWidth: { type: Boolean, required: false, default: false },

  /**
   * Heading text for the alert block
   *
   * > __Note:__ Headings with `<AlertBlock>` are rendered using
   * >           semantic HTML H tags
   *
   * @property {string} heading
   */
  heading: { type: String, required: false, default: '' },

  /**
   * The semantic heading level to be used for the alert block
   * (relative to the context in which it will be used)
   *
   * @property {number} hLevel
   */
  hLevel: { type: Number, required: false, default: 3 },

  /**
   * By default, the icon is defined by the type. However, if you
   * wish to use a different icon for a given alert type, you can
   * set the icon type here.
   *
   * @property {string} icon
   */
  icon: { type: String, required: false, default: '' },

  /**
   * For dismissable alerts/notices, it is useful to know which
   * alert/notice was dismissed.
   *
   * if ID is supplied, it will be the value passed along with the
   * dismiss event.
   *
   * @property {string} id
   */
  id: { type: String, required: false, default: '' },

  /**
   * Text to render in the alert's footer link
   *
   * > __Note:__ Both `linkTxt` and `linkUrl` are required for the
   * >           link to be rendered
   *
   * @property {string} linkTxt
   */
  linkTxt: { type: String, required: false, default: '' },

  /**
   * URL for the alert's footer link
   *
   * > __Note:__ Both `linkUrl` and `linkTxt` are required for the
   * >           link to be rendered
   *
   * @property {string} linkUrl
   */
  linkUrl: { type: String, required: false, default: '' },

  /**
   * Whether or not hide the alert's icon
   *
   * @property {boolean} noIcon
   */
  noIcon: { type: Boolean, required: false, default: false },

  /**
   * By default `AlertBlock` renders a thick border along the left
   * hand side of the alert box and rounded corners on the right.
   * There are times when you want the thick border to be on the
   * top and the rounded corners on the bottom.
   * Adding the `notice` attribute to the `<AlertBlock />` HTML will
   * achieve this.
   *
   * @property {boolean} disminoticessable
   */
  notice: { type: Boolean, required: false, default: false },

  /**
   * Define the alert type (and set the default icon for that type)
   *
   * Known types are:
   * * `brand` - purple border & text with pale purple background
   * * `error` (default) - Red border & text with pale red background
   * * `info` - Blue border & text with pale blue background
   * * `success` - Green border & text with pale green background
   * * `warning` - Yellow/sand border & text with pale yellow background
   *
   * > __Note:__ You can override the default type icon via the
   * >           `icon` attribute
   *
   * @property {string} icon
   */
  type: { type: String, required: false, default: 'error' },
});

//  END:  Properties/attributes
// --------------------------------------------------
// START: Local state

const dismissed = ref(false);

/**
 * `ePre()` is used for prefixing the function/method name to
 * thrown errors to help identify which function/method triggered
 * the error. It is also used as the value passed to
 * `console.group()` calls to improve the information rendered in
 * the browser console when debugging issues during development
 * or bug fixing.
 *
 * This is here to make development and debugging easier.
 * It will be treeshaken from production code
 *
 * @param {string}              method Function/Method name of
 *                                     that threw error or where
 *                                     `console.group()` is called
 * @param {boolean|string|null} before If `TRUE` append "(before)"
 *                                     to the console group name.
 *                                     If `FALSE` append "(After)"
 *                                     to the console group name.
 *                                     If string, append the
 *                                     string to the console group
 *                                     name.
 *                                     If `NULL` value is ignored
 *
 * @returns {string}
 */
const _cLog = ref(null); // eslint-disable-line no-unused-vars

//  END:  Local state
// --------------------------------------------------
// START: local helper functions

//  END:  local helper functions
// --------------------------------------------------
// START: Computed properties

const role = computed(() => { // eslint-disable-line arrow-body-style
  return (props.notice === true)
    ? undefined
    : 'alert';
});

const bodyClass = computed(() => {
  let colours = 'text-grey-900';

  if (props.notice === false) {
    colours = getTwStatusTxtColour(props.type, 'error', true);
  }

  return `text-body-md ${colours} mb-0`;
});

/**
 * All the classes needed to make the alert wrapper look how it
 * should
 *
 * @returns {ComputedRef<string>}
 */
const wrapClass = computed(
  () => {
    const colours = getTwStatusColours(props.type, 'error', !props.notice);
    const fullWidth = (props.fullWidth === true)
      ? 'w-full'
      : 'max-w-xl';
    let side = 'border-l-4';
    let corners = 'rounded-r-lg';
    let pad = 'py-4 pl-12';
    const rPad = (props.dismissable === true)
      ? 'pr-10'
      : 'pr-4';

    if (props.notice === true) {
      corners = 'rounded-b-lg';
      pad = 'pt-5 pb-2 pl-11';
      side = 'border-t-4';
    }

    return 'relative box-border flex flex-col max-w-xl '
      + `${fullWidth} ${pad} ${rPad} ${corners} ${side} ${colours}`;
  },
);

/**
 * The icon to render in the left column of the alert
 *
 * @returns {ComputedRef<string>}
 */
const symbol = computed(() => { // eslint-disable-line arrow-body-style
  _cLog.value.only(
    'symbol',
    {
      local: { symbol: getTwStatusIcon(props.type, 'error') },
      props: ['icon', 'type'],
    },
  );
  return (props.icon === '')
    ? getTwStatusIcon(props.type, 'error')
    : props.icon;
});

/**
 * All the classes to apply to the icon to ensure it looks how it
 * should
 *
 * @return {ComputedRef<string>}
 */
const iconClass = computed(() => {
  const font = (props.icon === 'ring')
    ? 'size-4'
    : 'material-symbols-rounded';

  const edge = (props.notice)
    ? 'left-3 top-5'
    : 'left-4 top-4';

  return `absolute ${edge} mr-3 leading-5 ${font} `
    + `${getTwStatusTxtColour(props.type, 'error', false)}`;
});

/**
 * Classes for the <H> tag to ensure it has the correct padding on
 * the right depending on whether the alert can be dismissed.
 *
 * @return {ComputedRef<string>}
 */
const hClass = computed(() => {
  const tmp = (props.dismissable === true && dismissed.value === false)
    ? 'pr-10'
    : '';

  return `text-bold-md ${tmp}`;
});

/**
 * Correct tag name to use for the heading.
 *
 * @return {ComputedRef<string>}
 */
const hTag = computed(() => getHtag(props.hLevel, 3));

/**
 * Whether or not to render the alert's footer link
 *
 * @return {ComputedRef<boolean>}
 */
const showLink = computed(() => isNonEmptyStr(props.linkUrl) && isNonEmptyStr(props.linkTxt));

//  END:  Computed properties
// --------------------------------------------------
// START: Local methods

//  END:  Local methods
// --------------------------------------------------
// START: Event handlers

/**
 * Event handler for dismiss button
 */
const dismiss = () => {
  dismissed.value = true;
  emit('dismissed', props.id);
};

//  END:  Event handlers
// --------------------------------------------------
// START: Watcher methods

//  END:  Watcher methods
// --------------------------------------------------
// START: Lifecycle events

onBeforeMount(() => {
  if (_cLog.value === null) {
    _cLog.value = new ConsoleLogger(
      '<alert-block>',
      props.heading,
      {
        props,
        refs: {
          dismissed,
          role,
          bodyClass,
          wrapClass,
          symbol,
          iconClass,
          hClass,
          hTag,
          showLink,
        },
      },
      false,
    );
  }
});

//  END:  Lifecycle events
// --------------------------------------------------
</script>
