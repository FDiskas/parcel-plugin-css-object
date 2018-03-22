const { Asset } = require("parcel-bundler");
const css = require("css");
const camelCase = require("camelcase");

class CssObjectAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = "css";
  }
  parse(source) {
    var parsedStylesheet = css.parse(source).stylesheet;
    this.code =
      parsedStylesheet &&
      parsedStylesheet.rules.reduce(reduceRulesToSelectors, {});
  }
  generate() {
    // Send to JS bundler
    return {
      js: `module.exports = ${JSON.stringify(
        JSON.parse(JSON.stringify(this.code))
      )}`
    };
  }
}

module.exports = CssObjectAsset;

// Return `true` for an AST node with { type: 'rule' } and valid selectors
function isValidRule(rule) {
  return !!(rule.type === "rule" && rule.selectors && rule.selectors.length);
}
// Return `true` for an AST node with { type: 'declaration' } and any property
function isValidDeclaration(declaration) {
  return !!(
    declaration.type === "declaration" &&
    declaration.property &&
    declaration.property.length
  );
}

// Reduce a declaration node from the AST to a style object
function reduceDeclarationsToStyleObject(styleObj, declaration) {
  if (!isValidDeclaration(declaration)) {
    return styleObj;
  }
  var key = camelCase(declaration.property);
  var value = declaration.value;
  styleObj[key] = value;
  return styleObj;
}

// Reduce a rule to a collection of selectors
function reduceRulesToSelectors(selectors, rule) {
  if (!isValidRule(rule)) {
    return selectors;
  }
  var styleObject = rule.declarations.reduce(
    reduceDeclarationsToStyleObject,
    {}
  );
  const newSelectors = rule.selectors.map(selector => {
    return selector.replace(".", "");
  });
  newSelectors.forEach(selector => {
    selectors[selector] = Object.assign({}, selectors[selector], styleObject);
  });
  return selectors;
}
