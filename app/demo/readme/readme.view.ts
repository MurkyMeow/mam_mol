namespace $.$$ {
	export class $mol_app_demo_readme_not_found_error extends Error {
		constructor( public module: readonly string[] ) {
			super( 'Readme not found' )
		}
	}

	export class $mol_app_demo_readme extends $.$mol_app_demo_readme {

		link( module: readonly string[] ) {
			return this.link_template().replace( '{repo}', this.repo() ).replace( '{module}' , module.join('/') )
		}
		
		@ $mol_mem
		uri_base( next = ''  ) {
			$mol_wire_solid()
			return next
		}

		@ $mol_mem
		override readme(): string {
			let module = this.module()

			while( module.length ) {
				try {
					const link =  this.link( module )
					const text = this.$.$mol_fetch.text( link )
					this.uri_base( `https://github.com/${this.repo()}/tree/master/${module.join('/')}/` )
					return text
				} catch( error: any ) {
					if( error instanceof Promise ) $mol_fail_hidden( error )
					module = module.slice( 0 , -1 )
				}
			}
			
			throw new $mol_app_demo_readme_not_found_error( module )
		}

		@ $mol_mem
		override body() {
			try {
				this.readme()
				return [ this.Readme() ]
			} catch ( err ) {
				if( err instanceof Promise ) $mol_fail_hidden( err )
				return [ this.Not_found() ]
			}
		}
		
	}
}
