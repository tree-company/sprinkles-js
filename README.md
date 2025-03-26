# Sprinkles

Sprinkles is a small library to add small amounts of javascript to your html.

We try to simplify working with custom elements by:
* Reducing the amount of boilerplate you have to write to add and remove event listeners
* Providing a convention for referencing nodes within your element

This approach takes inspiration from AlpineJS and Stimulus, but is fully build around custom elements.

## Using the library
### Build your own elements

You can easily build your own custom element on top of `SprinklesElement`. A simple hello world:
```js
import { SprinklesElement } from "sprinkles-js";

class HelloWorldElement extends SprinklesElement {
  static tagName = "hello-world";
  static events = {
    click: "greet"
  }

  greet(event) {
    console.log("Got click event: ", event);
    alert("Hello world!")
  }
}

HelloWorldElement.register();

```
```html
<hello-world></hello-world>
```

### Included components

In addition to the abstract sprinkles element, we also include some basic elements that you can use.

#### ClickableCard
A card that can be clicked anywhere to follow the link inside it:
```js
import { ClickableCard } from "sprinkles-js";

ClickableCard.register();
```

```html
<clickable-card>
  <p>Some text</p>
  </p>

  <a href="https://example.com" data-clickable-card-ref="link">A link</a>

  <button>A button that doesn't trigger</button>
</clickable-card>
```


This library was extracted from various projects at Tree company.

![Tree company](./logo_tree.png)
