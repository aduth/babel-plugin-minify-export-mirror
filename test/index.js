const { expect } = require( 'chai' );
const { transform } = require( 'babel-core' );
const traverse = require( 'babel-traverse' ).default;
const plugin = require( '../' );

describe( 'babel-plugin-minify-export-mirror', () => {
	describe( 'plugin()', () => {
		let originalGetUniqueString;
		before( () => {
			originalGetUniqueString = plugin.getUniqueString;
			plugin.getUniqueString = () => '__REPLACED__';
		} );

		after( () => {
			plugin.getUniqueString = originalGetUniqueString;
		} );

		function getDeclaration( source ) {
			let declaration;

			traverse( transform( source, {
				plugins: [ plugin ],
			} ).ast, {
				ExportNamedDeclaration( path ) {
					declaration = path.node.declaration;
				},
			} );

			return declaration;
		}

		it( 'should replace named exports with matching string initialized value', () => {
			const declaration = getDeclaration( 'export const FOO = \'FOO\';' );

			expect( declaration.declarations[ 0 ].init.value ).to.equal( '__REPLACED__' );
		} );

		it( 'should not replace named exports with non-matching string initialized value', () => {
			const declaration = getDeclaration( 'export const FOO = \'BAR\';' );

			expect( declaration.declarations[ 0 ].init.value ).to.equal( 'BAR' );
		} );

		it( 'should not replace named exports without initialized value', () => {
			const declaration = getDeclaration( 'export let FOO;' );

			expect( declaration.declarations[ 0 ].init ).to.be.null;
		} );

		it( 'should not replace non-function declarations', () => {
			const declaration = getDeclaration( 'export function foo() {}' );

			expect( declaration.type ).to.equal( 'FunctionDeclaration' );
		} );
	} );

	describe( 'plugin.getUniqueString()', () => {
		it( 'generates unique strings', () => {
			const generated = new Set();
			for ( let i = 0; i < 1000; i++ ) {
				const nextGenerated = plugin.getUniqueString();
				expect( generated.has( nextGenerated ) ).to.be.false;
				generated.add( nextGenerated );
			}
		} );
	} );
} );
