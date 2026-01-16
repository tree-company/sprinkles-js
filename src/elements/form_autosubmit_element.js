import SprinklesElement from "./sprinkles_element";
import { debounce } from "../lib/debounce";

/**
 * This element submits a form automatically clicking on a hidden submit input/button
 *
 * The form gets submitted on each change or input with a configurable debounce.
 * You still need to make sure that this is what the user expects and/or that the submit is captured
 * and only part of the DOM get's updated using a technique like turbo frames.
 * (We don't use `form.submit()` since that event isn't captured by turbo)
 *
 * The debounce for the change or input event can be configured with `data-change-debounce`
 * or `data-input-debounce`. This value is only picked up when the component is connected
 * any later changes to this attribute are ignored.
 */
export default class FormAutosubmitElement extends SprinklesElement {
  static tagName = "form-autosubmit";
  static refs = ["button"];
  static events = {
    change: "handleChange",
    input: "handleInput",
  };

  beforeConnected() {
    this.changeDebounce = this.hasAttribute("data-change-debounce")
      ? parseInt(this.getAttribute("data-change-debounce"))
      : 0;
    this.inputDebounce = this.hasAttribute("data-input-debounce")
      ? parseInt(this.getAttribute("data-input-debounce"))
      : 250;

    this.handleChange = debounce(this.#submit.bind(this), this.changeDebounce);
    this.handleInput = debounce(this.#submit.bind(this), this.inputDebounce);
  }

  #submit() {
    // If one debounce triggers, we clear both
    // This avoids the two debounces being triggered close too each other
    this.handleChange.clear();
    this.handleInput.clear();

    // Submit the form
    this.refs.button.click();
  }
}
