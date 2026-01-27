/**
 * Object containing optional extra config passed to ExternalBlur
 * class constructor
 *
 * @property {boolean?} autoUnset Whether or not to automatically
 *           unset event listeners after *"externalblur"* event is
 *           dispatched
 *
 *           __Default:__`TRUE`
 *
 *           * Useful when you're watching for an event that implies
 *             a blur on the element you're interested in.
 *
 * @property {boolean?} doConsole Whether or not to console log
 *           dispatched *"externalblur"* events
 *
 *           __Default:__ `FALSE`
 *
 *           * Useful for debugging
 *           * Should always be turned off in production
 *
 * @property {boolean?} watcherNode Additional DOM node from which
 *           to listen for *"pointerup"*, *"focus"* & *"keyup"*
 *           events.
 *
 *           __Default:__ `NULL`
 *
 *           * This would usually be the wrapper node for the target
 *             node. (The target node being the one supplied as the
 *             first argument to the `ExternalBlur` constructor).
 *
 *           * Useful when using a framework (like Vue) that intercepts
 *             events and may not allow those events to bubble all the
 *             way up to the `HTMLBodyElement` DOM node
 */
export type ExternalBlurOptions = {
  /**
   * Whether or not to automatically unset event listeners after
   * "externalblur" event is dispatched
   *
   * Default: `TRUE`
   *
   * > __Note:__ This is useful when you're watching for a blur event
   * >           when you want to close something and don't need to
   * >           watch it again until the next time that thing
   * >           receives focus
   * @property
   */
  autoUnset?: boolean,

  /**
   * @property Whether or not to console log dispatched
   *           "externalblur" events
   *
   * Default: `FALSE`
   *
   * > __Note:__ This is useful for debugging and should be turned
   * >           off in production
   */
  doConsole?: boolean,

  /**
   * @property Additional DOM node from which to listen for
   *           "pointerup", "focus" & "keyup" events.
   *
   * This would usually be the wrapper node for the target node.
   * (The target node being the one supplied as the first argument
   * to the `ExternalBlur` constructor).
   *
   * Default: `NULL`
   *
   * > __Note:__ This is useful when using a framework (like Vue)
   * >           that intercepts events and may not allow those
   * >           events to bubble all the way up to the
   * >           `HTMLBodyElement` DOM node
   */
  watcherNode?: HTMLElement,
};
