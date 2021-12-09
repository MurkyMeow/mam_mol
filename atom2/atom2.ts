// namespace $ {

// 	export function $mol_atom2_value< Value >( task : ()=> Value, next?: Value ) : Value | undefined {
// 		const cached = $mol_atom2.cached
// 		try {
// 			$mol_atom2.cached = true
// 			$mol_atom2.cached_next = next
// 			return task()
// 		} finally {
// 			$mol_atom2.cached = cached
// 		}
// 	}

// 	export class $mol_atom2< Value = any > extends $mol_fiber< Value > {

// 		static logs = false

// 		static get current() {
// 			const atom = $mol_fiber.current
// 			if( atom instanceof $mol_atom2 ) return atom
// 			return null
// 		}

// 		static cached = false
// 		static cached_next = undefined as any

// 		static reap_task = null as null | $mol_fiber
// 		static reap_queue = [] as $mol_atom2[]

// 		static reap( atom : $mol_atom2 ) {

// 			this.reap_queue.push( atom )

// 			if( this.reap_task ) return

// 			this.reap_task = $mol_fiber_defer( ()=> {
// 				this.reap_task = null
				
// 				while( true ) {
					
// 					const atom = this.reap_queue.pop()
// 					if( !atom ) break
					
// 					if( !atom.alone ) continue
					
// 					atom.destructor()
// 				}
				
// 			} )

// 		}

// 		slaves = [] as ( $mol_fiber | number | undefined )[]
		
// 		rescue( master : $mol_atom2 , cursor : number ) {

// 			if(!( master instanceof $mol_atom2 )) return
			
// 			const master_index = this.masters.length
// 			const slave_index = this.masters[ cursor + 1 ] as number + 1
			
// 			master.slaves[ slave_index ] = master_index
// 			this.masters.push( master , this.masters[ cursor + 1 ] )
			
// 		}

// 		subscribe( promise : Promise<unknown> ) {
// 			const obsolete = ()=> this.obsolete()
// 			return promise.then( obsolete , obsolete )
// 		}

// 		get() {

// 			if( $mol_atom2.cached ) {

// 				if( $mol_atom2.cached_next !== undefined ) {
// 					this.push( $mol_atom2.cached_next )
// 					$mol_atom2.cached_next = undefined
// 				}
				
// 				return this.value
// 			}
			
// 			const value = super.get()
// 			if( value === undefined ) $mol_fail( new Error( `Not defined: ${ this }` ) )
			
// 			return value
// 		}

// 		obey( master : $mol_fiber , master_index : number ) : number {
// 			return master.lead( this , master_index )
// 		}

// 		lead( slave : $mol_fiber , master_index : number ) {
			
// 			if( $mol_atom2.logs ) this.$.$mol_log3_rise({
// 				place : this ,
// 				message : 'Leads' ,
// 				slave ,
// 			})
			
// 			const slave_index = this.slaves.length
// 			this.slaves[ slave_index ] = slave
// 			this.slaves[ slave_index + 1 ] = master_index
			
// 			return slave_index
// 		}

// 		dislead( slave_index : number ) {

// 			if( slave_index < 0 ) return // slave is fiber

// 			if( $mol_atom2.logs ) this.$.$mol_log3_rise({
// 				place : this ,
// 				message : 'Disleads' ,
// 				slave : this.slaves[ slave_index ] ,
// 			})

// 			this.slaves[ slave_index ] = undefined
// 			this.slaves[ slave_index + 1 ] = undefined

// 			$mol_array_trim( this.slaves )

// 			if( this.cursor > $mol_fiber_status.persist && this.alone ) $mol_atom2.reap( this )
// 		}

// 		obsolete( master_index = -1 ) {

// 			if( this.cursor > $mol_fiber_status.obsolete ) {
// 				if( master_index >= this.cursor - 2 ) return

// 				const path = [] as $mol_atom2[]
// 				let current = this as $mol_atom2
				
// 				collect : while( current ) {
// 					path.push( current )
// 					current = current.masters[ current.cursor - 2 ] as $mol_atom2
// 				}

// 				this.$.$mol_fail( new Error( `Obsoleted while calculation \n\n${ path.join( '\n' ) }\n` ) )
// 			}
			
// 			if( this.cursor === $mol_fiber_status.obsolete ) return
			
// 			if( $mol_atom2.logs ) this.$.$mol_log3_rise({
// 				place : this ,
// 				message : 'Obsoleted' ,
// 			})

// 			if( this.cursor !== $mol_fiber_status.doubt ) this.doubt_slaves()
			
// 			this.cursor = $mol_fiber_status.obsolete
			
// 		}

// 		doubt( master_index = -1 ) {
			
// 			if( this.cursor > $mol_fiber_status.obsolete ) {
// 				if( master_index >= this.cursor - 2 ) return

// 				const path = [] as $mol_atom2[]
// 				let current = this as $mol_atom2
				
// 				collect : while( current ) {
// 					path.push( current )
// 					current = current.masters[ current.cursor - 2 ] as $mol_atom2
// 				}

// 				this.$.$mol_fail( new Error( `Doubted while calculation \n\n${ path.join( '\n' ) }\n` ) )
// 			}
			
// 			if( this.cursor >= $mol_fiber_status.doubt ) return
				
// 			if( $mol_atom2.logs ) this.$.$mol_log3_rise({
// 				place : this ,
// 				message : 'Doubted' ,
// 			})

// 			this.cursor = $mol_fiber_status.doubt
			
// 			this.doubt_slaves()

// 		}

// 		obsolete_slaves() {
// 			for( let index = 0 ; index < this.slaves.length ; index += 2 ) {
// 				const slave = this.slaves[ index ] as $mol_atom2
// 				if( slave ) slave.obsolete( this.slaves[ index + 1 ] as number )
// 			}
// 		}

// 		doubt_slaves() {
// 			for( let index = 0 ; index < this.slaves.length ; index += 2 ) {
// 				const slave = this.slaves[ index ] as $mol_atom2
// 				if( slave ) slave.doubt( this.slaves[ index + 1 ] as number )
// 			}
// 		}

// 		get fresh() {
// 			return ()=> {
// 				if( this.cursor !== $mol_fiber_status.actual ) return

// 				this.cursor = $mol_fiber_status.obsolete
// 				this.update()
// 			}
// 		}

// 		get alone() {
// 			return this.slaves.length === 0
// 		}
		
// 		get derived() {
			
// 			for( let index = 0 ; index < this.masters.length ; index += 2 ) {
// 				if( this.masters[ index ] ) return true
// 			}

// 			return false
// 		}

// 		destructor() {

// 			if( !this.abort() ) return
			
// 			if( $mol_atom2.logs ) this.$.$mol_log3_rise({
// 				place : this ,
// 				message : 'Destructed'
// 			} )

// 			this.cursor = $mol_fiber_status.persist

// 			for( let index = 0 ; index < this.masters.length ; index += 2 ) {
// 				this.complete_master( index )
// 			}

// 		}
		
// 	}

// }
