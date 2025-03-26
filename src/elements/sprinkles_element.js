/**
 * SprinklesElement is an abstract class to help us build custom elements
 *
 * By defining refs and events the element will automatically run some setup when connected.
 */
export default class SprinklesElement extends HTMLElement {
  /**
   * The default tagName that will be used to register this elements
   */
  static tagName = "sprinkles-element";

  /**
   * An array of elements that will be referenced in the elements
   *
   * These refs are expected to match DOM-nodes following the pattern
   * `[data-TAG-NAME-ref="refName"]`
   *
   * @type {string[]}
   */
  static refs = [];

  /**
   * An object with events that should be observed.
   *
   * For each event a listener will be added when the elements connects (and removed when it disconnects)
   *
   * @type {{ [eventName: string]: string | { method: string; ref?: string, options?: boolean | AddEventListenerOptions; immediate?: boolean } | string[] | { method: string; ref?: string, options?: boolean | AddEventListenerOptions; immediate?: boolean }[] }}
   */
  static events = {};

  static register(tagName = this.tagName, registry) {
    if ("customElements" in window) {
      (registry || customElements).define(tagName, this);
    }
  }

  /**
   * The found refs, based on the class field `refs`
   *
   * @type { [name: string]: Element | null}
   */
  refs = {};

  connectedCallback() {
    this.#detectRefs();
    this.#bindEvents();
    this.afterConnected();
  }

  disconnectedCallback() {
    this.beforeDisconnect();
    this.#unbindEvents();
  }

  // Callbacks
  afterConnected() {}

  beforeDisconnect() {}

  // Setup
  #detectRefs() {
    this.refs = {};
    this.constructor.refs.forEach((refName) => {
      this.refs[refName] = this.querySelector(
        `[data-${this.constructor.tagName}-ref=${refName}]`,
      );
    });
  }

  #bindEvents() {
    Object.entries(this.constructor.events).forEach(([eventName, settings]) => {
      this.#normalizeEventSettings(settings).forEach((setting) => {
        // If we don't have an element, we simply return (this can happen when a ref could not be found)
        if (!setting.element) return;

        setting.element.addEventListener(
          eventName,
          setting.callback,
          setting.options,
        );
        if (setting.immediate) setting.callback.call();
      });
    });
  }

  #unbindEvents() {
    Object.entries(this.constructor.events).forEach(([eventName, settings]) => {
      this.#normalizeEventSettings(settings).forEach((setting) => {
        if (!setting.element) return;

        setting.element.removeEventListener(
          eventName,
          setting.callback,
          setting.options,
        );
      });
    });
  }

  #normalizeEventSettings(settings) {
    // Settings can be passed as an object or an array of objects, we always normalize this to an array
    settings = Array.isArray(settings) ? settings : [settings];
    return settings.map((setting) => {
      // We always clone settings, so we don't modify the value that is stored as a class field
      // Otherwise setting `element` will mess with other instances of the same element
      setting =
        typeof setting === "string" ? { method: setting } : { ...setting };
      setting.element ||= setting["ref"] ? this.refs[setting["ref"]] : this;
      setting.immediate ||= false;
      setting.callback = this[setting.method].bind(this);
      return setting;
    });
  }
}
