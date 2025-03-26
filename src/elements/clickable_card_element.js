import SprinklesElement from "./sprinkles_element";

/**
 * A card that can be clicked anywhere to follow a link inside it
 *
 * This ensures that a screen reader does not to read the whole card to announce the link, while a user can still click anywhere in the card.
 * You can include other links and buttons in the card, these will not trigger a navigation.
 *
 * This is based on the recipe and discussion from Web Accessibility Cookbook by Manuel Matuzović (O’Reilly). Copyright 2024 Manuel Matuzović, 978-1-098-14560-6.
 * and this article from Vikas Parashar: https://css-tricks.com/block-links-the-search-for-a-perfect-solution/#aa-method-4-sprinkle-javascript-on-the-second-method
 */
export default class ClickableCardElement extends SprinklesElement {
  static tagName = "clickable-card";
  static refs = ["link"];
  static events = {
    click: "handleClick",
  };

  handleClick(event) {
    // Don't handle clicks on buttons or anchors
    if (event.target.closest(`${this.constructor.tagName} :is(a,button)`)) {
      return;
    }

    // Check if text is selected and don't click if so
    const noTextSelected = !window.getSelection().toString();
    if (noTextSelected) this.refs.link.click();
  }
}
