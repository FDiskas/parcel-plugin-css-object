# parcel-plugin-css-object

Parcel loader to load CSS into an object. The object has keys that are selectors from the CSS file; the value of each selector are the rules converted to camelCase properties ([see Style Object Properties](http://www.w3schools.com/jsref/dom_obj_style.asp)). This object is compatible with [React Inline Styles](https://facebook.github.io/react/tips/inline-styles.html).

## Install

`npm install -D parcel-plugin-css-object`

## Usage:

Requiring CSS rules:

```css
p {
  font-size: 14px;
}
h1 {
  text-indent: 20px;
}
.centered {
  width: 100%;
  margin: 0 auto;
}
```

```js
import style from "./rules.css";
console.log(style);
// Output:
// {
//    p: {
//      fontSize: '14px'
//    },
//    h1: {
//      textIndent: '20px'
//    },
//    centered: {
//      width: '100%',
//      margin: '0 auto'
//    }
// }
```

Now you can use those rules however you like:

###### React

```js
const MyComponent = ({ children }) => (
  <div style={selectors.centered}>{children}</div>
);
```

###### DOM

```js
function applyStylesToNode(styles, node) {
  Object.keys(styles).forEach(key => {
    node.style[key] = styles[key];
  });
}
applyStylesToNode(selectors.centered, document.querySelector("#some-div"));
```

### Use Case

1.  You want to inline all your styles, but you still want to write your CSS into CSS files.
2.  You want to use a CSS preprocessor to write your inline styles.

## Implementation

This library uses [reworkcss/css](https://github.com/reworkcss/css) to parse CSS to an AST. The AST is then traversed to find rule declarations and populate them into an object. Media queries are ignored.

Source code from [pl12133/css-object-loader](https://github.com/pl12133/css-object-loader)

## Contributing

Questions, criticism and pull requests are always welcome.
