import SprinklesElement from "./sprinkles_element";
import { debounce } from "../lib/debounce";

/**
 * This element submits a form automatically clicking on a hidden submit input/button
 *
 * The form gets submitted on each change, or on input with a debounce.
 * You still need to make sure that this is what the user expects and/or that the submit is captured
 * and only part of the DOM get's updated using a technique like turbo frames.
 * (We don't use `form.submit()` since that event isn't captured by turbo)
 */
export default class FormAutosubmitElement extends SprinklesElement {
  static tagName = "form-autosubmit";
  static refs = ["button"];
  static events = {
    change: "submit",
    input: "debouncedSubmit",
  };

  debouncedSubmit = debounce(this.#submit.bind(this), 250);

  submit() {
    this.debouncedSubmit.trigger();
  }

  #submit() {
    this.refs.button.click();
  }
}
