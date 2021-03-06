module.exports=function(grunt){
	grunt.initConfig({
		//pkg:grunt.file.readJSON('package.json')
		watch: {
			jade: {
				files: ['views/**'],
				options: {
				 	livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
				 livereload: true
				}
			},
		},
		nodemon: {
		     dev: {
		        options: {
		          file: 'app.js',
		          args: [],
		          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
		          watchedExtensions: ['js'],
		          watchedFolders: ['./'],
		          debug: true,
		          delayTime: 1,
		          env: {
		            PORT: 2000
		          },
		          cwd: __dirname
		        }
		    }
		},
		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		},
		concurrent: {
		    tasks: ['nodemon', 'watch'/*, 'less', 'uglify', 'jshint'*/],
		    options: {
		        logConcurrentOutput: true
		    }
		}
	})

	grunt.loadNpmTasks("grunt-contrib-watch")
	grunt.loadNpmTasks("grunt-nodemon")
	grunt.loadNpmTasks("grunt-concurrent")
	grunt.loadNpmTasks("grunt-mocha-test")



	//grunt.loaNpmTasks("grunt-contrib-uglify")
	

	grunt.option('force',true)
	grunt.registerTask('default',['concurrent'])
	grunt.registerTask('test',['mochaTest'])


}