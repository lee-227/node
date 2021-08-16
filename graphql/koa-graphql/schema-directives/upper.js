const { SchemaDirectiveVisitor } = require("graphql-tools");
const { defaultFieldResolver } = require("graphql");
class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (parent, args, context, info) => {
      const res = await resolve(parent, args, context, info);
      if (typeof res === "string") {
        return res.toUpperCase();
      }
      return res;
    };
  }
}
module.exports = UpperCaseDirective;
