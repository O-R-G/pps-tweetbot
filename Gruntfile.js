module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    forever: {
      bot: {
        options: {
          index: './bot-listener.js',
          logDir: 'logs'
        }
      }
    }
  });

  // Load the NPM plugins
  
  // Start, stop and restart an application as a daemon
  grunt.loadNpmTasks('grunt-forever');

  // Running grunt (without task arg)
  grunt.registerTask('default', ['forever:bot:start']);

};