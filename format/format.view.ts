namespace $.$$ {
	export class $mol_format extends $.$mol_format {
		
		@ $mol_mem
		selection( [ from, to ] = [ 0, 0 ] ): number[] {
			
			const prev = $mol_wire_probe( ()=> this.selection() )
			if( !prev ) return [ 0, 100 ]
			
			if( from === to ) {
				
				const allow = this.allow()
				const mask = this.mask( [ ... this.value_changed() ].filter( letter => allow.includes( letter ) ).join( '' ) )
				
				if( ( prev?.[0] ?? 0 ) < from ) {
					while( from && mask[ from ] && mask[ from ] !== '_' ) {
						++ from
						++ to
					}
				}
				
			}
			
			return [ from, to ]
		}
		
		@ $mol_mem
		value_changed( next?: string ) {
			
			const allow = this.allow()

			const normalize = ( val: string )=> {
				val = [ ... val ].filter( letter => allow.includes( letter ) ).join( '' )
				const letters = [ ... val ].reverse()
				return this.mask( val ).replace( /_/gu, ()=> letters.pop() ?? '_' ) + letters.reverse().join('')
			}
			
			if( next !== undefined ) {
				next = normalize( next )
				if( next.includes( '_' ) ) return next
			}
			
			return normalize( this.value( next ) )
			
		}
		
		event_change( next? : InputEvent ) {
			if( !next ) return
			if( next.data && !this.allow().includes( next.data ) ) return
			super.event_change( next )
		}
		
	}
}
