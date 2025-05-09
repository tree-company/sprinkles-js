import SprinklesElement from "./sprinkles_element";

/**
 * An element that wraps an input and an element to print the character counter
 *
 * On every keystroke the counter is updated. If the max length of the input is reached
 * an error can be added to alert the user.
 */
export default class CharacterCounterElement extends SprinklesElement {
  static tagName = "character-counter";
  static refs = ["input", "output", "error"];
  static events = {
    input: { method: "updateCounter", immediate: true },
    // We detect that the limit is reached through `keydown`, since input isn't triggered (since the user can't input any more)
    // and `keyup` fires after the input event and would be triggered on the Nth character instead of the N + 1 character
    keydown: { method: "alertLimitReached" },
  };

  #hasAlerted = false;

  get maxLength() {
    const maxLength = this.refs.input.maxLength;
    // If maxLength isn't set (and returns -1), we set this to infinity
    return maxLength === -1 ? Infinity : maxLength;
  }

  get valueLength() {
    return this.refs.input.value.length;
  }

  get remainingCharacters() {
    return this.maxLength - this.valueLength;
  }

  updateCounter() {
    if (!Number.isFinite(this.maxLength)) return;
    if (this.refs.output === null) return;

    this.refs.output.innerText = this.dataset.characterCounterTemplate
      .replace("{{current}}", this.valueLength)
      .replace("{{total}}", this.maxLength)
      .replace("{{remaining}}", this.remainingCharacters);

    if (this.#hasAlerted && this.remainingCharacters > 0) {
      this.refs.error.innerText = null;
    }
  }

  alertLimitReached(event) {
    if (this.remainingCharacters > 0) return;
    if (this.dataset.characterCounterLimitMessage === undefined) return;

    if (isPrintableCharacter(event.key) || isAndroidKey(event)) {
      if (this.refs.error.hidden) this.refs.error.hidden = false;
      this.refs.error.innerText = this.dataset.characterCounterLimitMessage;
      this.#hasAlerted = true;
    }
  }
}

function isPrintableCharacter(str) {
  return str.length === 1 && str.match(/\S| /);
}

const ANDROID_KEYS = [
  "Process", // Firefox
  "Unidentified", // Chrome (but only 127+?)
];

// NOTE: Certain android devices always send an event with a special key and/or keyCode `229`
function isAndroidKey(event) {
  return ANDROID_KEYS.includes(event.key) || event.keyCode == 229;
}
