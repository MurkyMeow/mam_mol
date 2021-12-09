namespace $.$$ {
	export class $mol_list_demo_tree extends $.$mol_list_demo_tree {
		
		root_rows() {
			return this.row_content( [] )
		}
		
		#titles = new Map< string, string >()
		
		@ $mol_mem_key
		row_title( id : number[] ) {
			$mol_wire_cache( this ).row_title( id ).solid()
			return `Node ${ id.join( '.' ) }: ${ $mol_stub_message( 512 ) } `
		}

		@ $mol_mem_key
		row_content( id : number[] ) {
			$mol_wire_cache( this ).row_content( id ).solid()
			return [ ... $mol_range2( index => this.Row([ ... id , index ]) , ()=> Math.floor( Math.random() * 10 + 5 ) ) ]
		}

		@ $mol_mem_key
		row_expanded( id : number[] , next = id.length < 4 ) {
			return next
		}

	}
}
