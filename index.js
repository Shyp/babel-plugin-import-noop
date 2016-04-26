'use strict';

const defaultExtensions = ['css', 'scss', 'sass', 'less'];

module.exports = function (opts) {
  const t = opts.types;

  return {
    visitor: {
      ImportDeclaration: {
        // `state` is the set of plugin options. The only current option is
        // `extensions`; an array of file extensions for which to replace
        // imports with noops.
        exit: function(path, state) {
          const node = path.node;
          const fileName = node.source.value;

          // Bail unless the filename we're importing matches one of the
          // extensions we're filtering on.
          const matchedExtensions = (state.opts && state.opts.extensions) || defaultExtensions;
          const matchPattern = new RegExp('(' + matchedExtensions.join('|') + ')$');

          if (!matchPattern.test(fileName)) {
            return;
          }

          if (node.specifiers.length < 1) {
            // Import is not being given a name, remove it (it's most likely for webpack's sake).
            path.remove();
            return;
          }

          const importName = node.specifiers[0].local.name;

          path.replaceWith(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier(node.specifiers[0].local.name),
                t.objectExpression([])
              )
            ])
          );
        }
      }
    }
  };
}
