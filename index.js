/**
 * Babel plugin for minifying initial string values for module exports of the
 * same name.
 *
 * @return {Object} Babel plugin configuration
 */
function plugin() {
	return {
		visitor: {
			ExportNamedDeclaration( path ) {
				const { declaration } = path.node;
				if ( ! declaration || 'VariableDeclaration' !== declaration.type ) {
					return;
				}

				declaration.declarations.forEach( ( declarator )=> {
					if ( 'VariableDeclarator' !== declarator.type ) {
						return;
					}

					// Only override if export has initialized value
					if ( ! declarator.init ) {
						return;
					}

					// Only override if export name matches initialized value
					if ( declarator.id.name !== declarator.init.value ) {
						return;
					}

					// Replace assigned value with short unique string
					declarator.init.value = plugin.getUniqueString();
				} );
			},
		},
	};
}

/**
 * Returns a unique short string.
 *
 * @return {String} Unique short string
 */
plugin.getUniqueString = ( () => {
	/**
	 * Incrementing counter to guarantee uniqueness of unique string.
	 *
	 * @type {Number}
	 */
	let count = 0;

	/**
	 * Characters to use in string assignment. Intentionally avoids those which
	 * would either need to be escaped or transformed by Babel as hexadecimal
	 * escape sequence.
	 *
	 * @type {String}
	 */
	const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&()*+,-./:;<=>?@[]^_`{|}~ ';

	/**
	 * Given a positive integer, returns a deterministic short string.
	 *
	 * @param  {Number} number Number seed
	 * @return {String}        Unique short string
	 */
	function numberToString( number ) {
		let result = '';
		do {
			result = ALPHABET[ number % ALPHABET.length ] + result;
			number = Math.floor( number / ALPHABET.length ) - 1;
		} while ( number >= 0 );

		return result;
	}

	return () => numberToString( count++ );
} )();

module.exports = plugin;
